import { useState, useRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCcw,
} from "lucide-react";

export function ImageCropper({
  imageUrl,
  onCropComplete,
  onCancel,
}: {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(NaN); // NaN for freeform in cropperjs
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sync zoom slider when cropper zoom event fires
  const onZoom = (e: CustomEvent) => {
    setZoomLevel(e.detail.ratio);
  };

  const handleZoomSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(Number(e.target.value));
    }
  };

  const handleZoomIn = () => cropperRef.current?.cropper.zoom(0.1);
  const handleZoomOut = () => cropperRef.current?.cropper.zoom(-0.1);
  const handleRotateLeft = () => cropperRef.current?.cropper.rotate(-90);
  const handleRotateRight = () => cropperRef.current?.cropper.rotate(90);
  const handleReset = () => cropperRef.current?.cropper.reset();

  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newAspect = val === "NaN" ? NaN : Number(val);
    setAspectRatio(newAspect);
    cropperRef.current?.cropper.setAspectRatio(newAspect);
  };

  const generateCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    // Preserve transparency and quality
    const canvas = cropper.getCroppedCanvas({
      imageSmoothingQuality: "high",
    });

    if (!canvas) return;

    const base64Image = canvas.toDataURL("image/webp", 0.9);
    onCropComplete(base64Image);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md animate-in fade-in">
      <div className="flex h-[95vh] w-[95vw] max-w-6xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl border border-border/20">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4 bg-background">
          <div className="font-display text-lg font-semibold text-foreground">Crop Image</div>
          <button
            onClick={onCancel}
            className="rounded-full border border-border/60 p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="flex-1 min-h-0 min-w-0 bg-black/60 relative">
          <Cropper
            src={imageUrl}
            style={{ height: "100%", width: "100%" }}
            initialAspectRatio={NaN}
            aspectRatio={aspectRatio}
            guides={true}
            ref={cropperRef}
            viewMode={0} // 0 allows unrestricted zooming and panning outside the canvas
            dragMode="move" // Allows dragging the image underneath the crop box
            background={true} // Checkerboard background
            responsive={true}
            autoCropArea={1} // Fill container initially
            checkOrientation={false} // Helps with EXIF orientation issues
            wheelZoomRatio={0.1} // Smooth mouse wheel zoom
            zoom={onZoom}
            className="veloce wear-cropper"
          />
        </div>

        {/* Controls Footer */}
        <div className="flex shrink-0 flex-col gap-4 border-t border-border/50 px-4 py-4 sm:px-6 bg-background">
          {/* Top Row: Sliders & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleZoomOut}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.01"
                value={zoomLevel || 1}
                onChange={handleZoomSlide}
                className="w-24 sm:w-32 accent-brand cursor-pointer"
              />
              <button
                onClick={handleZoomIn}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Rotate & Reset */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleRotateLeft}
                className="rounded-full border border-border/60 p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
                title="Rotate Left"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={handleRotateRight}
                className="rounded-full border border-border/60 p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
                title="Rotate Right"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-border/50 mx-1 sm:mx-2" />
              <button
                onClick={handleReset}
                className="rounded-full border border-border/60 p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
                title="Reset Image"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Aspect Ratio & Apply */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/20">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Aspect Ratio
              </span>
              <select
                className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs outline-none focus:border-foreground text-foreground cursor-pointer"
                value={Number.isNaN(aspectRatio) ? "NaN" : aspectRatio}
                onChange={handleAspectRatioChange}
              >
                <option value="NaN">Freeform (Custom)</option>
                <option value="1">1:1 (Square)</option>
                <option value="0.8">4:5 (Product Grid)</option>
                <option value="1.7777777777777777">16:9 (Hero Banner)</option>
                <option value="1.5">3:2 (Landscape)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={generateCroppedImage}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground transition-colors shadow-lg active:scale-95 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
