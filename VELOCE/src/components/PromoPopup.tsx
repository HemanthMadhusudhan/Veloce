import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteImage } from "@/lib/site-images";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const promoImgUrl = useSiteImage("promo-popup");

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeen = sessionStorage.getItem("veloce_promo_seen");
    if (!hasSeen) {
      // Delay slightly for a better user experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem("veloce_promo_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-4 animate-in fade-in zoom-in duration-300">
      <div className="relative w-[90%] max-w-[360px] overflow-hidden rounded-2xl bg-surface shadow-2xl">
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md hover:scale-105 transition-transform"
        >
          <X className="h-4 w-4 font-bold" />
        </button>
        <Link to="/shop" onClick={close} className="block relative w-full aspect-[3/4]">
          <img
            src={promoImgUrl}
            alt="Buy 2 Get 1 Free - End of Season Sale"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
