import { getPicture, type PictureSet } from "@/lib/images";

type Props = {
  src: string | PictureSet;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  fetchpriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
  aspect?: string; // e.g. "4/5", "16/9"
};

/**
 * Responsive <picture> wrapper. If `src` is a plain URL known to the images
 * registry, it emits WebP + JPEG srcsets. Otherwise it falls back to a single
 * <img> so runtime URLs (remote, generated) still render.
 */
export function Picture({
  src,
  alt,
  sizes = "100vw",
  className,
  imgClassName = "h-full w-full object-cover",
  loading = "lazy",
  fetchpriority,
  decoding = "async",
  aspect,
}: Props) {
  if (!src) return null;
  const pic: PictureSet | undefined = typeof src === "string" ? getPicture(src) : src;
  const fallback = typeof src === "string" ? src : src.src;
  const style = aspect ? { aspectRatio: aspect } : undefined;

  if (!pic) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={[imgClassName, className].filter(Boolean).join(" ")}
        loading={loading}
        decoding={decoding}
        // @ts-expect-error non-standard but supported by Chromium/Safari
        fetchpriority={fetchpriority}
        style={style}
      />
    );
  }

  return (
    <picture className={className}>
      <source type="image/webp" srcSet={pic.webp} sizes={sizes} />
      <source type="image/jpeg" srcSet={pic.jpg} sizes={sizes} />
      <img
        src={pic.src}
        alt={alt}
        sizes={sizes}
        className={imgClassName}
        loading={loading}
        decoding={decoding}
        // @ts-expect-error non-standard but supported by Chromium/Safari
        fetchpriority={fetchpriority}
        style={style}
      />
    </picture>
  );
}