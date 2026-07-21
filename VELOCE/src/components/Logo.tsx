import { Link } from "@tanstack/react-router";

export function Logo({
  className = "",
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="Veloce Wear home"
    >
      <img
        src="/logo.png?v=3"
        width={48}
        height={48}
        alt="Veloce Wear"
        className="transition-transform duration-500 group-hover:scale-110 object-contain drop-shadow-sm brightness-0 scale-125"
      />
      {showWord && (
        <span className="font-display text-[15px] font-bold uppercase tracking-[0.28em] gold-text">
          Veloce Wear
        </span>
      )}
    </Link>
  );
}
