"use client";

import {
  CheckCircleIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/helpers/classname-helper";
import { Link } from "@tanstack/react-router";
import { type Order } from "@/lib/store";
import { useCatalog } from "@/lib/catalog-store";
import { ArrowRight, Printer, PackageCheck } from "lucide-react";

export type ReceiptPrinterStage = "processing" | "printing" | "complete";
export type ReceiptFeedMotion = "smooth" | "stepped";

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  /** Disables all stage transitions when false. */
  animate?: boolean;
  children: ReactNode;
  /** Controls whether the paper feeds continuously or one line at a time. */
  feedMotion?: ReceiptFeedMotion;
  /** Current state of the printer. */
  stage: ReceiptPrinterStage;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<"article">;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Custom status content. Defaults to a label derived from the current stage. */
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(
  null,
);

const easeOut = [0.23, 1, 0.32, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;

    return `${x}% ${y}`;
  },
).join(", ");
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: "Processing your Veloce Wear order",
  printing: "Preparing your Veloce Wear order",
  complete: "Veloce Wear order complete",
};

const machineClassName =
  "relative isolate w-full overflow-hidden rounded-[var(--printer-radius)] border border-grayscale-12 bg-[color-mix(in_oklab,var(--color-grayscale-11)_30%,var(--color-grayscale-12))] p-[var(--printer-inset)] pb-8 shadow-[0_20px_36px_-20px_color-mix(in_oklab,var(--color-grayscale-12)_55%,transparent),0_6px_14px_-8px_color-mix(in_oklab,var(--color-grayscale-12)_24%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-grayscale-1)_14%,transparent),inset_0_-1px_0_color-mix(in_oklab,var(--color-grayscale-12)_55%,transparent)] [--printer-inner-radius:calc(var(--printer-radius)_-_var(--printer-inset))] [--printer-inset:0.75rem] [--printer-radius:1.5rem] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[url('/textures/plastic-noise.svg')] before:bg-[length:180px_180px] before:bg-repeat before:opacity-30 before:mix-blend-multiply before:content-[''] dark:border-grayscale-3 dark:bg-grayscale-4 dark:shadow-[0_20px_36px_-20px_color-mix(in_oklab,var(--color-grayscale-3)_55%,transparent),0_6px_14px_-8px_color-mix(in_oklab,var(--color-grayscale-3)_24%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-grayscale-12)_14%,transparent),inset_0_-1px_0_color-mix(in_oklab,var(--color-grayscale-3)_55%,transparent)]";

/**
 * Authentic Thermal Receipt Printer Audio Synthesizer (Web Audio API)
 */
export function playThermalPrintSound(durationMs = 3200) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const duration = durationMs / 1000;

    // 1. Gentle Stepper Motor Low Hum
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);

    // Motor stepping chatter flutter
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(26, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(22, now);
    lfo.connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(300, now);
    filter.Q.setValueAtTime(2.5, now);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.04, now + 0.1);
    oscGain.gain.setValueAtTime(0.04, now + duration - 0.2);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(ctx.destination);

    // 2. Paper Sliding & Thermal Print Head Friction Texture
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (0.7 + 0.3 * Math.sin(i / 120));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1700, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.035, now + 0.1);
    noiseGain.gain.setValueAtTime(0.035, now + duration - 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    noise.start(now);

    lfo.stop(now + duration);
    osc.stop(now + duration);
    noise.stop(now + duration);

    // Also trigger audio asset if present
    try {
      const audio = new Audio("/mixkit-long-pop-2358.wav");
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {}
  } catch (err) {
    console.debug("Audio play blocked or unsupported:", err);
  }
}

export function playCompleteChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;

    [
      { freq: 659.25, time: now, dur: 0.18 },
      { freq: 987.77, time: now + 0.14, dur: 0.38 },
    ].forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.06, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
    });
  } catch {}
}

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);

  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }

  return context;
}

function ReceiptPrinterRoot({
  "aria-label": ariaLabel = "Receipt printer",
  animate = true,
  children,
  className,
  feedMotion = "smooth",
  stage,
  ...props
}: ReceiptPrinterRootProps) {
  const context = {
    animate,
    feedMotion,
    shouldMove: animate,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          "relative isolate flex w-full max-w-sm flex-col items-center",
          className,
        )}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function ReceiptPrinterMachine({
  children,
  className,
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div className={cn(machineClassName, className)} {...props}>
      {children}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-[var(--printer-inset)] z-40 h-2 rounded-[0.25rem] border border-grayscale-12 bg-grayscale-12 shadow-inner shadow-grayscale-12 dark:border-grayscale-1 dark:bg-grayscale-1 dark:shadow-grayscale-1"
      />
    </div>
  );
}

function ReceiptPrinterHeader({
  children,
  className,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-11 items-start justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ReceiptPrinterScreen({
  children,
  className,
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={cn(
        "relative z-10 isolate overflow-hidden rounded-[var(--printer-inner-radius)] border border-grayscale-12 bg-grayscale-12 p-4 text-grayscale-1 shadow-inner shadow-grayscale-12/80 after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:shadow-[inset_0_0_24px_4px_color-mix(in_oklab,var(--color-grayscale-12)_52%,transparent)] after:content-[''] dark:border-grayscale-1 dark:bg-grayscale-2 dark:text-grayscale-12 dark:shadow-grayscale-1/80 dark:after:shadow-[inset_0_0_24px_4px_color-mix(in_oklab,var(--color-grayscale-1)_52%,transparent)]",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatusIndicator({
  animate,
  move,
  stage,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
}) {
  const isComplete = stage === "complete";

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid place-items-center text-green-9"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="complete"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CheckCircleIcon size={18} weight="fill" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid place-items-center text-grayscale-8 dark:text-grayscale-11"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.96)" : "scale(1)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? "scale(0.94)" : "scale(1)",
            }}
            key="working"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CircleNotchIcon
              className={cn(
                animate && "animate-spin motion-reduce:animate-none",
              )}
              size={18}
              weight="bold"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReceiptPrinterStatus({
  children,
  className,
  ...props
}: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Status",
  );

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div
        aria-live="polite"
        className="grid min-w-0 flex-1 items-center"
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            className="col-start-1 row-start-1 truncate font-medium text-grayscale-8 text-xs leading-none dark:text-grayscale-11"
            exit={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(-4px)" : "translateY(0px)",
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? "translateY(4px)" : "translateY(0px)",
            }}
            key={stage}
            transition={{ duration: animate ? 0.18 : 0, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReceiptPrinterPaper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={cn(
        "relative z-10 min-h-80 bg-grayscale-1 bg-[url('/textures/receipt-paper.svg')] bg-cover px-6 pt-7 pb-8 font-mono text-grayscale-12 bg-blend-soft-light dark:bg-grayscale-12 dark:text-grayscale-1",
        className,
      )}
      style={{ clipPath: receiptClipPath, ...style }}
      {...props}
    >
      {children}
    </article>
  );
}

function ReceiptPrinterOutput({
  children,
  className,
  ...props
}: ReceiptPrinterOutputProps) {
  const { stage } = useReceiptPrinter(
    "ReceiptPrinter.Output",
  );
  const isPrintingOrComplete = stage !== "processing";

  return (
    <div
      className={cn(
        "relative z-50 -mt-4 min-h-[34rem] w-[calc(80%+3rem)] max-w-full overflow-hidden px-6 pb-6",
        className,
      )}
      {...props}
    >
      {isPrintingOrComplete ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -top-1 z-20 h-2 bg-grayscale-12/75 blur-[6px] dark:bg-grayscale-1/75"
        />
      ) : null}

      <motion.div
        initial={{ y: "-100%" }}
        animate={{
          y: stage === "processing" ? "-100%" : "0%",
        }}
        transition={{
          y: {
            duration: 3.2,
            ease: [0.12, 0.9, 0.25, 1], // Smooth progressive extrusion curve
          },
        }}
        aria-hidden={stage !== "complete"}
        className="relative isolate before:pointer-events-none before:absolute before:inset-x-3 before:top-3 before:bottom-4 before:z-0 before:rounded-sm before:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-grayscale-12)_24%,transparent)] before:content-[''] after:pointer-events-none after:absolute after:right-[8%] after:bottom-0 after:left-[8%] after:z-0 after:h-3 after:translate-y-1.5 after:rounded-full after:bg-grayscale-12/10 after:blur-lg after:content-[''] dark:before:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-grayscale-1)_20%,transparent)] dark:after:bg-grayscale-1/10"
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};

/**
 * High-level OrderReceiptPrinter that wraps the exact OG ReceiptPrinter
 * component with Veloce Wear order details, slow smooth extrusion, and audio feedback.
 */
export function OrderReceiptPrinter({
  order,
  onContinueShopping,
}: {
  order: Order;
  onContinueShopping?: () => void;
}) {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  const { getById } = useCatalog();
  const hasPlayedSoundRef = useRef(false);

  useEffect(() => {
    // Stage 1: Processing (0 - 600ms)
    const t1 = setTimeout(() => {
      setStage("printing");
      if (!hasPlayedSoundRef.current) {
        hasPlayedSoundRef.current = true;
        playThermalPrintSound(3200);
      }
    }, 600);

    // Stage 2: Printing -> Complete (smooth 3.2s feed extrusion finishes at 3800ms)
    const t2 = setTimeout(() => {
      setStage("complete");
      playCompleteChime();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 pt-2 pb-8 font-sans">
      <ReceiptPrinter.Root stage={stage} feedMotion="smooth" animate={true}>
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Header>
            <ReceiptPrinter.Status />
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-grayscale-12 dark:text-grayscale-1">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </div>
          </ReceiptPrinter.Header>

          <ReceiptPrinter.Screen>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-grayscale-4">
                  {stage === "processing"
                    ? "Securing Payment..."
                    : stage === "printing"
                      ? "Generating Bill..."
                      : "Confirmed"}
                </p>
                <p className="font-mono text-[10px] text-grayscale-7">
                  REF #{order.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-grayscale-5">
                  {order.payment?.mode === "cod" ? "COD Mode" : "Online UPI/Card"}
                </p>
                <p className="font-mono text-[10px] text-green-400">
                  {order.items.reduce((sum, item) => sum + item.qty, 0)} Items
                </p>
              </div>
            </div>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            {/* Brand Header */}
            <div className="border-b border-dashed border-grayscale-6 pb-3 text-center dark:border-grayscale-7">
              <h2 className="text-base font-black tracking-widest uppercase text-grayscale-12 dark:text-grayscale-1">
                VELOCE WEAR
              </h2>
              <p className="text-[9px] uppercase tracking-wider text-grayscale-9">
                Authentic Matchwear & Streetwear
              </p>
              <p className="mt-0.5 text-[8px] text-grayscale-8">
                help@velocewear.shop
              </p>
            </div>

            {/* Order Metadata */}
            <div className="space-y-1 border-b border-dashed border-grayscale-6 py-2.5 text-[10px] text-grayscale-10 dark:border-grayscale-7">
              <div className="flex justify-between">
                <span>ORDER ID:</span>
                <span className="font-bold font-mono text-grayscale-12 dark:text-grayscale-1">
                  {order.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>DATE:</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT:</span>
                <span className="font-bold uppercase text-grayscale-12 dark:text-grayscale-1">
                  {order.payment?.mode === "cod"
                    ? "Cash On Delivery (COD)"
                    : "Prepaid Online (UPI/Card)"}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-b border-dashed border-grayscale-6 py-2.5 dark:border-grayscale-7">
              <div className="flex justify-between pb-1 text-[9px] font-bold uppercase text-grayscale-12 dark:text-grayscale-1">
                <span>ITEM / SIZE</span>
                <span>TOTAL</span>
              </div>
              <div className="space-y-2 mt-1">
                {order.items.map((item, idx) => {
                  const prod = getById(item.id);
                  return (
                    <div
                      key={idx}
                      className="flex justify-between text-[10px] leading-tight"
                    >
                      <div className="pr-2">
                        <p className="font-bold line-clamp-1 text-grayscale-12 dark:text-grayscale-1">
                          {prod?.name || item.id}
                        </p>
                        <p className="text-[9px] text-grayscale-8">
                          Size: {item.size} · Qty: {item.qty}
                          {item.customName && ` · Name: ${item.customName}`}
                          {item.customNumber && ` · #${item.customNumber}`}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono font-bold text-grayscale-12 dark:text-grayscale-1">
                        ₹{((prod?.price || 699) * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1 border-b border-dashed border-grayscale-6 py-2.5 text-[10px] text-grayscale-10 dark:border-grayscale-7">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700 dark:text-green-400 font-semibold">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-bold text-green-700 dark:text-green-400">FREE</span>
              </div>
              <div className="flex justify-between border-t border-grayscale-5 pt-1.5 text-xs font-black text-grayscale-12 dark:text-grayscale-1">
                <span>TOTAL AMOUNT:</span>
                <span className="font-mono">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
              {order.payment?.codDue && order.payment.codDue > 0 ? (
                <div className="mt-1 flex justify-between rounded bg-amber-500/10 p-1 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                  <span>COD Due on Delivery:</span>
                  <span>₹{order.payment.codDue.toLocaleString("en-IN")}</span>
                </div>
              ) : null}
            </div>

            {/* Delivery Address */}
            <div className="space-y-0.5 border-b border-dashed border-grayscale-6 py-2.5 text-[9px] text-grayscale-10 dark:border-grayscale-7">
              <p className="font-bold uppercase text-grayscale-12 dark:text-grayscale-1">
                SHIP TO:
              </p>
              <p className="font-semibold text-grayscale-12 dark:text-grayscale-1">
                {order.customer.name}
              </p>
              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.state} {order.customer.pincode}
              </p>
              <p>Ph: +91-{order.customer.phone}</p>
            </div>

            {/* Barcode & Footer */}
            <div className="flex flex-col items-center pt-3 pb-1 text-center">
              <div className="mb-1 flex h-8 w-40 items-center justify-center gap-0.5 bg-white p-1 border border-neutral-200">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2, 4, 2, 1, 3, 1, 2, 1, 4, 2, 3, 1, 2].map(
                  (w, i) => (
                    <div
                      key={i}
                      className="h-full bg-black"
                      style={{ width: `${w * 1.3}px` }}
                    />
                  ),
                )}
              </div>
              <p className="font-mono text-[8px] uppercase tracking-widest text-grayscale-8">
                {order.id}
              </p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-grayscale-9">
                100% Authentic Matchwear Guaranteed
              </p>
              <p className="text-[8px] text-grayscale-7">
                Thank you for choosing Veloce Wear
              </p>
            </div>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>

      {/* Interactive Actions when printing completes */}
      {stage === "complete" && (
        <div className="mt-4 w-full max-w-sm space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-neutral-800 shadow-sm transition hover:bg-neutral-50 active:scale-98 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Bill</span>
            </button>
            <Link
              to="/profile"
              search={{ tab: "orders", orderId: order.id }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white py-3 text-xs font-bold uppercase tracking-wider text-neutral-800 shadow-sm transition hover:bg-neutral-50 active:scale-98 text-center"
            >
              <PackageCheck className="h-4 w-4" />
              <span>Track Order</span>
            </Link>
          </div>

          <Link
            to="/"
            onClick={onContinueShopping}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-98 cursor-pointer"
          >
            <span>Back to Home</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
