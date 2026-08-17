/**
 * Smart Jersey Background Remover & Standardizer
 * 
 * Takes any image URL or File:
 * 1. Samples outer edges to determine background color
 * 2. Flood-fills / segments background and converts to transparent alpha
 * 3. Calculates the exact bounding box of the jersey (non-transparent pixels)
 * 4. Crops tightly to the jersey boundaries
 * 5. Centers and scales the jersey onto a standardized 1000x1000 square canvas with uniform padding
 * 6. Returns a standardized WebP / PNG data URL
 */

export async function processAndStandardizeJerseyImage(
  imageSource: string | File,
  options: {
    targetSize?: number;
    paddingRatio?: number; // e.g. 0.06 = 6% padding on all sides
    tolerance?: number; // Color distance tolerance (0-255)
  } = {}
): Promise<string> {
  const { targetSize = 1000, paddingRatio = 0.06, tolerance = 32 } = options;

  // 1. Load image into HTMLImageElement
  const img = await loadImage(imageSource);

  // 2. Create offscreen canvas for background removal
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = origWidth;
  canvas.height = origHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, origWidth, origHeight);
  const data = imgData.data;

  // 3. Sample background color from image corners
  const bgSamples = [
    getPixel(data, 0, 0, origWidth),
    getPixel(data, origWidth - 1, 0, origWidth),
    getPixel(data, 0, origHeight - 1, origWidth),
    getPixel(data, origWidth - 1, origHeight - 1, origWidth),
    getPixel(data, Math.floor(origWidth / 2), 0, origWidth),
  ];

  // Most common or average corner color
  const avgBg = averageColor(bgSamples);

  // 4. Background removal (Flood fill from edges + color distance threshold)
  // Check if corners already transparent
  const isAlreadyTransparent = bgSamples.some((p) => p[3] < 50);

  if (!isAlreadyTransparent) {
    // Mask array to mark transparent background pixels
    const isBg = new Uint8Array(origWidth * origHeight);
    const queue: number[] = [];

    // Push all border pixels to queue if they match background color
    const pushIfBg = (x: number, y: number) => {
      const idx = y * origWidth + x;
      if (isBg[idx]) return;
      const px = getPixel(data, x, y, origWidth);
      if (colorDist(px, avgBg) <= tolerance) {
        isBg[idx] = 1;
        queue.push(idx);
      }
    };

    for (let x = 0; x < origWidth; x++) {
      pushIfBg(x, 0);
      pushIfBg(x, origHeight - 1);
    }
    for (let y = 0; y < origHeight; y++) {
      pushIfBg(0, y);
      pushIfBg(origWidth - 1, y);
    }

    // BFS Flood Fill
    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cx = curr % origWidth;
      const cy = Math.floor(curr / origWidth);

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < origWidth && ny >= 0 && ny < origHeight) {
          const nidx = ny * origWidth + nx;
          if (!isBg[nidx]) {
            const px = getPixel(data, nx, ny, origWidth);
            if (colorDist(px, avgBg) <= tolerance) {
              isBg[nidx] = 1;
              queue.push(nidx);
            }
          }
        }
      }
    }

    // Find silhouette border pixels to draw crisp black border around jersey shape
    const isBorder = new Uint8Array(origWidth * origHeight);
    for (let y = 1; y < origHeight - 1; y++) {
      for (let x = 1; x < origWidth - 1; x++) {
        const idx = y * origWidth + x;
        if (!isBg[idx]) {
          if (
            isBg[idx - 1] ||
            isBg[idx + 1] ||
            isBg[idx - origWidth] ||
            isBg[idx + origWidth]
          ) {
            isBorder[idx] = 1;
          }
        }
      }
    }

    // Apply alpha transparency to background and dark border outline to jersey
    for (let i = 0; i < isBg.length; i++) {
      if (isBg[i]) {
        data[i * 4 + 3] = 0; // Transparent
      } else if (isBorder[i]) {
        data[i * 4] = 25;
        data[i * 4 + 1] = 25;
        data[i * 4 + 2] = 25;
        data[i * 4 + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 5. Calculate Bounding Box of the jersey (non-transparent pixels)
  let minX = origWidth;
  let minY = origHeight;
  let maxX = 0;
  let maxY = 0;
  let hasJerseyPixels = false;

  for (let y = 0; y < origHeight; y++) {
    for (let x = 0; x < origWidth; x++) {
      const alpha = data[(y * origWidth + x) * 4 + 3];
      if (alpha > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        hasJerseyPixels = true;
      }
    }
  }

  // Fallback if no bounding box found
  if (!hasJerseyPixels || minX >= maxX || minY >= maxY) {
    minX = 0;
    minY = 0;
    maxX = origWidth - 1;
    maxY = origHeight - 1;
  }

  // Add small 2px margin around bounding box to prevent harsh edge clipping
  const cropX = Math.max(0, minX - 2);
  const cropY = Math.max(0, minY - 2);
  const cropW = Math.min(origWidth - cropX, maxX - minX + 4);
  const cropH = Math.min(origHeight - cropY, maxY - minY + 4);

  // 6. Draw jersey centered and scaled onto standardized square canvas
  const outCanvas = document.createElement("canvas");
  outCanvas.width = targetSize;
  outCanvas.height = targetSize;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Could not get output canvas context");

  // Calculate scaled dimension with padding
  const maxContentSize = targetSize * (1 - paddingRatio * 2);
  const scale = Math.min(maxContentSize / cropW, maxContentSize / cropH);

  const drawW = cropW * scale;
  const drawH = cropH * scale;
  const drawX = (targetSize - drawW) / 2;
  const drawY = (targetSize - drawH) / 2;

  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";

  // Draw the cropped jersey right in the center
  outCtx.drawImage(
    canvas,
    cropX,
    cropY,
    cropW,
    cropH,
    drawX,
    drawY,
    drawW,
    drawH
  );

  return outCanvas.toDataURL("image/webp", 0.92);
}

/* Helper Functions */

function loadImage(source: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = (err) => {
      // If crossOrigin fails due to CORS, try fallback without crossOrigin or through proxy
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error("Failed to load image from source"));
      if (typeof source === "string") {
        fallbackImg.src = source;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          fallbackImg.src = e.target?.result as string;
        };
        reader.readAsDataURL(source);
      }
    };

    if (typeof source === "string") {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(source);
    }
  });
}

function getPixel(data: Uint8ClampedArray, x: number, y: number, width: number): [number, number, number, number] {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

function colorDist(p1: [number, number, number, number], p2: [number, number, number, number]): number {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) +
    Math.pow(p1[1] - p2[1], 2) +
    Math.pow(p1[2] - p2[2], 2)
  );
}

function isLightShade(p: [number, number, number, number], tol: number): boolean {
  // Catch off-whites / studio light greys (rgb values all > 240)
  return p[0] > 242 && p[1] > 242 && p[2] > 242;
}

function averageColor(samples: [number, number, number, number][]): [number, number, number, number] {
  let r = 0, g = 0, b = 0, a = 0;
  for (const s of samples) {
    r += s[0];
    g += s[1];
    b += s[2];
    a += s[3];
  }
  const len = samples.length;
  return [Math.round(r / len), Math.round(g / len), Math.round(b / len), Math.round(a / len)];
}
