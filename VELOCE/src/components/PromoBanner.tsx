import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

const KEY = "veloce wear.promo.topbar.puma";

export function PromoBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(sessionStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;

  return (
    <div className="sticky inset-x-0 top-0 z-[60] overflow-hidden border-b border-gray-200 bg-white">
      <div className="relative flex items-center justify-center px-3 py-2 text-[10px] uppercase tracking-wider text-black font-bold sm:px-4 sm:py-2.5 sm:text-[11px]">
        <span className="text-center w-full">EXTRA 5% OFF AND FREE SHIPPING ON ALL ONLINE PAYMENTS*</span>
      </div>
    </div>
  );
}
