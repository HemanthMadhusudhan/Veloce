import { useState, useRef } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check } from "lucide-react";

export function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
}: {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [aspect, setAspect] = useState<number | undefined>(4 / 5);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height), width, height));
    }
  }

  async function generateCroppedImage() {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    const base64Image = canvas.toDataURL("image/webp", 0.9);
    onCropComplete(base64Image);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div className="font-display text-lg font-semibold">Crop Image</div>
          <button onClick={onCancel} className="rounded-full border border-border/60 p-2 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-black/50 p-6 flex items-center justify-center min-h-[400px]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-h-full max-w-full"
          >
            <img
              ref={imgRef}
              alt="Crop preview"
              src={imageUrl}
              onLoad={onImageLoad}
              className="max-h-[60vh] w-auto object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-background">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Aspect Ratio</span>
            <select 
              className="rounded-full border border-border/60 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-foreground"
              value={aspect || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setAspect(undefined);
                  setCrop(undefined);
                } else {
                  const newAspect = Number(val);
                  setAspect(newAspect);
                  if (imgRef.current) {
                    const { width, height } = imgRef.current;
                    setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 90 }, newAspect, width, height), width, height));
                  }
                }
              }}
            >
              <option value="0.8">4:5 (Product Grid)</option>
              <option value="1">1:1 (Square)</option>
              <option value="1.7777777777777777">16:9 (Hero Banner)</option>
              <option value="">Free form</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button onClick={onCancel} className="rounded-full border border-border/70 px-5 py-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground">
              Cancel
            </button>
            <button onClick={generateCroppedImage} disabled={!completedCrop?.width || !completedCrop?.height} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground disabled:opacity-50">
              <Check className="h-3.5 w-3.5" /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
