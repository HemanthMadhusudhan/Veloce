import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

export function SupportBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Hi there! Welcome to Veloce. I'm your virtual assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleToggle = () => setOpen((prev) => !prev);
    window.addEventListener("toggleSupportBot", handleToggle);
    return () => window.removeEventListener("toggleSupportBot", handleToggle);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response delay
    setTimeout(() => {
      const reply = generateResponse(userMsg.text);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "bot", text: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("time")) {
      return "We offer free shipping on orders over ₹499! Standard delivery takes 3-5 business days depending on your location.";
    }
    if (lower.includes("track") || lower.includes("status") || lower.includes("where is my order")) {
      return "Once your order is shipped, you will receive a tracking link via SMS and email. You can also track it directly from your account page!";
    }
    if (lower.includes("return") || lower.includes("exchange") || lower.includes("refund")) {
      return "We have a 4-day easy exchange policy. Just ensure the tags are intact and the item is unworn. Contact our Telegram support to initiate an exchange.";
    }
    if (lower.includes("size") || lower.includes("fit")) {
      return "Our jerseys are true to size. For player version (authentic) jerseys, we recommend going one size up as they have an athletic, tighter fit.";
    }
    if (lower.includes("authentic") || lower.includes("fake") || lower.includes("real") || lower.includes("quality")) {
      return "All our items come with a 100% authenticity guarantee. We curate official merchandise directly from the clubs and constructors.";
    }
    if (lower.includes("pay") || lower.includes("cod") || lower.includes("cash on delivery")) {
      return "We accept all major Credit/Debit Cards, UPI, and Net Banking. We also offer Cash on Delivery (COD) for most pin codes!";
    }
    if (lower.includes("custom") || lower.includes("print") || lower.includes("name")) {
      return "Yes! We offer custom name and number printing on most football jerseys. Just select the personalization option on the product page.";
    }
    if (lower.includes("wash") || lower.includes("care") || lower.includes("clean")) {
      return "To keep your jersey fresh, wash it inside out on a cold, gentle cycle. Do not iron directly on the prints or logos!";
    }
    if (lower.includes("contact") || lower.includes("human") || lower.includes("support") || lower.includes("talk")) {
      return "We don't use email support. For the fastest response, please reach out to our human support team on Telegram at @VeloceSupport (Mon-Sat, 9 AM to 6 PM).";
    }
    return "I'm currently a basic virtual assistant, but I can help with questions about shipping, tracking, returns, sizes, payments, or authenticity! For more complex queries, please message our support team on Telegram at @VeloceSupport.";
  };

  return (
    <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end sm:bottom-8 sm:right-8">
      {/* Chat Window */}
      {open && (
        <div className="mb-4 flex h-[400px] w-[320px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 sm:h-[450px] sm:w-[360px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-surface/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Veloce Assistant</h3>
                <p className="text-[10px] uppercase tracking-wider text-brand">Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[85%] gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-foreground text-background" : "bg-brand/20 text-brand"}`}>
                    {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-foreground text-background rounded-tr-sm" : "bg-surface text-foreground rounded-tl-sm border border-border/40"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border/40 bg-surface px-4 py-3">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 bg-surface/30 p-3">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-full border border-border/70 bg-background py-2.5 pl-4 pr-12 text-sm outline-none focus:border-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-foreground transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button (Desktop Only) */}
      <button
        onClick={() => setOpen(!open)}
        className={`hidden sm:flex group h-14 w-14 items-center justify-center rounded-full bg-brand text-background shadow-xl shadow-brand/30 transition-all duration-300 hover:scale-110 ${open ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
}
