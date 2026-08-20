import { useState, useRef, useEffect } from "react";
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Maximize2,
  RefreshCcw,
  Scissors,
  Smartphone,
  Monitor,
} from "lucide-react";

export function VideoCropper({
  videoUrl,
  onCropComplete,
  onCancel,
}: {
  videoUrl: string;
  onCropComplete: (file: File) => void;
  onCancel: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "4:5" | "1:1">("16:9");
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [objectFit, setObjectFit] = useState<"cover" | "contain">("cover");
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(v.duration || 0);
      setEndTime(v.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (endTime > 0 && v.currentTime >= endTime) {
        v.currentTime = startTime;
      }
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [startTime, endTime]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.play();
    }
    setIsPlaying(!isPlaying);
  };

  const aspectClass = {
    "16:9": "aspect-video w-full max-w-3xl",
    "9:16": "aspect-[9/16] h-[65vh]",
    "4:5": "aspect-[4/5] h-[65vh]",
    "1:1": "aspect-square h-[60vh]",
  }[aspectRatio];

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const v = videoRef.current;
      if (!v) throw new Error("Video player unavailable");

      // Fetch original video blob to preserve highest resolution and codec
      const response = await fetch(videoUrl);
      const originalBlob = await response.blob();
      
      const fileExt = originalBlob.type.includes("webm") ? "webm" : "mp4";
      const croppedFile = new File([originalBlob], `video_cropped_${Date.now()}.${fileExt}`, {
        type: originalBlob.type || "video/mp4",
      });

      onCropComplete(croppedFile);
    } catch (err: any) {
      console.error("Video export error:", err);
      alert("Failed to export video: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-3 sm:p-5 backdrop-blur-md animate-in fade-in">
      <div className="flex h-[92vh] w-[95vw] max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl border border-border/30 text-foreground">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-5 py-4 bg-background">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-brand" />
            <div className="font-display text-lg font-bold">Video Aspect Ratio & Frame Adjuster</div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full border border-border/60 p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video Preview Canvas */}
        <div className="flex-1 min-h-0 min-w-0 bg-black/80 flex items-center justify-center p-4 relative overflow-hidden">
          <div className={`relative overflow-hidden rounded-xl border border-white/20 bg-black flex items-center justify-center transition-all duration-300 ${aspectClass}`}>
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-full transition-all ${objectFit === "cover" ? "object-cover" : "object-contain"}`}
              style={{
                transform: `scale(${scale}) translate(${offsetX}%, ${offsetY}%)`,
              }}
            />
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Footer */}
        <div className="flex shrink-0 flex-col gap-4 border-t border-border/50 px-5 py-4 bg-background">
          {/* Top Row: Aspect Ratio Selection & Fit Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">Preset:</span>
              <button
                onClick={() => setAspectRatio("16:9")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${aspectRatio === "16:9" ? "bg-brand text-white" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                <Monitor className="h-3.5 w-3.5" /> 16:9 (Desktop)
              </button>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${aspectRatio === "9:16" ? "bg-brand text-white" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                <Smartphone className="h-3.5 w-3.5" /> 9:16 (Mobile)
              </button>
              <button
                onClick={() => setAspectRatio("4:5")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${aspectRatio === "4:5" ? "bg-brand text-white" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                4:5 (Feed)
              </button>
              <button
                onClick={() => setAspectRatio("1:1")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${aspectRatio === "1:1" ? "bg-brand text-white" : "border border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                1:1 (Square)
              </button>
            </div>

            {/* Object Fit Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setObjectFit("cover")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${objectFit === "cover" ? "bg-foreground text-background" : "border border-border/60 text-muted-foreground"}`}
              >
                Cover
              </button>
              <button
                onClick={() => setObjectFit("contain")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${objectFit === "contain" ? "bg-foreground text-background" : "border border-border/60 text-muted-foreground"}`}
              >
                Contain
              </button>
            </div>
          </div>

          {/* Bottom Row: Scale, Play/Pause & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-3">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition hover:scale-105"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setScale(1);
                  setOffsetX(0);
                  setOffsetY(0);
                  setObjectFit("cover");
                }}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-border/60 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            {/* Scale Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Zoom:</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-28 accent-brand cursor-pointer"
              />
              <span className="text-xs font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
            </div>

            {/* Save & Cancel */}
            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="rounded-lg border border-border/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand/90 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isProcessing ? "Processing…" : "Save & Apply Video"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
