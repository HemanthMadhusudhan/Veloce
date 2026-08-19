import { Link } from "@tanstack/react-router";

export function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  showWord?: boolean;
  light?: boolean;
}) {
  return (
    <Link
      to="/"
      className={`group inline-flex flex-col items-center leading-none select-none transition-transform active:scale-95 ${className}`}
      aria-label="Veloce home"
    >
      <span className={`font-black text-[24px] sm:text-[28px] tracking-tight uppercase font-display leading-none transition-colors duration-300 ${light ? "text-white" : "text-[#d32f2f]"}`}>
        VELOCE
      </span>
      <span className={`font-serif italic text-[12px] sm:text-[13px] tracking-[0.22em] -mt-0.5 font-black leading-none transition-colors duration-300 ${light ? "text-white/90" : "text-[#d32f2f]"}`}>
        Wear
      </span>
    </Link>
  );
}
