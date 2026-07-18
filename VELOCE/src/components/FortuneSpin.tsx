import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";

export type Prize = {
  label: string;
  code: string;
  color: string;
  weight: number;
};

const PRIZES: Prize[] = [
  { label: "10% OFF", code: "VELOCE10", color: "#E51E4E", weight: 30 }, // 30% chance
  { label: "20% OFF", code: "VELOCE20", color: "#222222", weight: 30 }, // 30% chance
  { label: "30% OFF", code: "VELOCE30", color: "#E51E4E", weight: 5 },  // 5% chance
  { label: "40% OFF", code: "VELOCE40", color: "#222222", weight: 1 },  // 1% chance
  { label: "BUY 1 GET 1", code: "B2G1", color: "#E51E4E", weight: 14 }, // 14% chance
  { label: "NO LUCK", code: "NONE", color: "#222222", weight: 20 },     // 20% chance
];

function canSpinToday(): boolean {
  const lastSpinStr = localStorage.getItem("veloce_last_spin");
  if (!lastSpinStr) return true;

  const lastSpinTime = new Date(parseInt(lastSpinStr, 10));
  const now = new Date();

  // Reset at 7 AM
  const getResetTime = (date: Date) => {
    const reset = new Date(date);
    reset.setHours(7, 0, 0, 0);
    if (date.getTime() < reset.getTime()) {
      // If it's before 7 AM, the reset time was 7 AM yesterday
      reset.setDate(reset.getDate() - 1);
    }
    return reset;
  };

  const lastReset = getResetTime(now);
  return lastSpinTime.getTime() < lastReset.getTime();
}

export function FortuneSpin({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (open) {
      setCanSpin(canSpinToday());
      const savedPrize = localStorage.getItem("veloce_last_prize");
      if (savedPrize && !canSpinToday()) {
        try {
          setPrize(JSON.parse(savedPrize));
          setShowResult(true);
        } catch {}
      }
    }
  }, [open]);

  if (!open) return null;

  const handleSpin = () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    setShowResult(false);

    // Weighted random selection
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let randomVal = Math.random() * totalWeight;
    let winIndex = 0;
    
    for (let i = 0; i < PRIZES.length; i++) {
      randomVal -= PRIZES[i].weight;
      if (randomVal <= 0) {
        winIndex = i;
        break;
      }
    }

    // Generate a unique random code for this user's spin (unless it's NO LUCK)
    const isNoLuck = PRIZES[winIndex].label === "NO LUCK";
    const uniqueCode = isNoLuck ? "NONE" : "VL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const winPrize = { ...PRIZES[winIndex], code: uniqueCode };

    // Calculate rotation:
    const sliceAngle = 360 / PRIZES.length;
    const extraSpins = 360 * 5;
    const targetAngle = extraSpins + (360 - (winIndex * sliceAngle)) + (Math.random() * 20 - 10); 
    
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setPrize(winPrize);
      setShowResult(true);
      setCanSpin(false);
      localStorage.setItem("veloce_last_spin", Date.now().toString());
      localStorage.setItem("veloce_last_prize", JSON.stringify(winPrize));
    }, 5000); 
  };

  const handleCopy = () => {
    if (prize) {
      navigator.clipboard.writeText(prize.code);
      // Optional: Could add a tiny toast here, but the active state will be enough
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-border/40 bg-background/95 p-6 shadow-2xl animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-widest text-brand">Daily Spin</h2>
          <p className="mt-2 text-xs text-muted-foreground">Spin the wheel to win a daily discount. Resets at 7 AM.</p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mb-8">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 z-10 h-8 w-6 -translate-x-1/2 drop-shadow-xl">
            <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white" />
          </div>

          {/* The Wheel */}
          <div 
            className="w-full h-full rounded-full border-4 border-white shadow-[0_0_20px_rgba(229,30,78,0.3)] overflow-hidden transition-transform duration-[5000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(from -30deg, 
                ${PRIZES[0].color} 0deg 60deg, 
                ${PRIZES[1].color} 60deg 120deg, 
                ${PRIZES[2].color} 120deg 180deg, 
                ${PRIZES[3].color} 180deg 240deg, 
                ${PRIZES[4].color} 240deg 300deg, 
                ${PRIZES[5].color} 300deg 360deg)`
            }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
              {PRIZES.map((p, i) => {
                const angle = (360 / PRIZES.length) * i;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 origin-center flex flex-col items-center justify-start pt-6"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span 
                      className="block text-center text-xs font-bold uppercase tracking-wider text-white"
                      style={{ transform: 'rotate(0deg)' }}
                    >
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-background z-20 flex items-center justify-center shadow-inner">
              <Gift className="h-5 w-5 text-brand" />
            </div>
          </div>
        </div>

        {/* Action / Result */}
        <div className="h-[100px] w-full flex flex-col items-center justify-center text-center">
          {showResult && prize ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              {prize.label === "NO LUCK" ? (
                <>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Oh no!</div>
                  <div className="mt-1 text-2xl font-bold text-foreground">Better luck next time!</div>
                  <div className="mt-2 text-xs text-muted-foreground">Come back tomorrow for another spin.</div>
                </>
              ) : (
                <>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">You won!</div>
                  <div className="mt-1 text-2xl font-bold text-brand">{prize.label}</div>
                  <button 
                    onClick={handleCopy}
                    className="mt-3 group relative inline-flex flex-col items-center rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 hover:bg-brand/20 active:bg-brand/30 transition-colors"
                    title="Tap to copy"
                  >
                    <span className="text-[9px] uppercase tracking-widest text-brand">Tap to copy code</span>
                    <span className="font-mono text-lg font-bold text-foreground tracking-widest">{prize.code}</span>
                  </button>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleSpin}
              disabled={!canSpin || spinning}
              className="rounded-full bg-brand px-12 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-background transition hover:bg-brand/90 disabled:opacity-50 disabled:hover:bg-brand shadow-lg shadow-brand/20 active:scale-95"
            >
              {spinning ? "Spinning..." : canSpin ? "SPIN NOW" : "COME BACK TOMORROW"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
