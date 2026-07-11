import { Link } from "@tanstack/react-router";

export function Logo({ className = "", showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="Veloce home">
      <svg width="28" height="28" viewBox="0 0 32 32" className="transition-transform duration-500 group-hover:rotate-[8deg]" fill="none">
        <defs>
          <linearGradient id="vg-gold" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="oklch(0.68 0.14 80)" />
            <stop offset="45%" stopColor="oklch(0.9 0.14 92)" />
            <stop offset="100%" stopColor="oklch(0.68 0.14 80)" />
          </linearGradient>
          <linearGradient id="vg-silver" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="oklch(0.62 0.01 260)" />
            <stop offset="50%" stopColor="oklch(0.95 0.005 260)" />
            <stop offset="100%" stopColor="oklch(0.62 0.01 260)" />
          </linearGradient>
        </defs>
        <path d="M4 5 L14 5 L16 22 L18 5 L28 5 L20 28 L12 28 Z" fill="url(#vg-gold)" />
        <circle cx="16" cy="16" r="14.5" stroke="url(#vg-silver)" strokeOpacity="0.45" />
      </svg>
      {showWord && (
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.28em] gold-text">
          Veloce
        </span>
      )}
    </Link>
  );
}
