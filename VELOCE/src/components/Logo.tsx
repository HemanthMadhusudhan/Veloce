import { Link } from "@tanstack/react-router";

export function Logo({
  className = "",
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <Link
      to="/"
      className={`group inline-flex flex-col items-center leading-none select-none transition-transform active:scale-95 ${className}`}
      aria-label="Veloce home"
    >
      <span className="font-black text-[24px] sm:text-[28px] tracking-tight uppercase text-[#d32f2f] font-display leading-none">
        VELOCE
      </span>
      <span className="font-serif italic text-[12px] sm:text-[13px] tracking-[0.22em] text-[#d32f2f] -mt-0.5 font-black leading-none">
        Wear
      </span>
    </Link>
  );
}
