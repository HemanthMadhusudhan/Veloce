import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles } from "lucide-react";
import { useShop } from "@/lib/store";
import { useCatalog } from "@/lib/catalog-store";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  functionCall?: any;
  functionResponse?: any;
  thoughtSignature?: string;
};

export function SupportBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Welcome to Veloce Wear Support. I am your concierge. How may I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { addToCart, openCart } = useShop();
  const { products } = useCatalog();

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

  const exactMatches: Record<string, string> = {
    "What are your shipping details?": "We ship all over India! Delivery takes 6-8 days in metros and 10-12 days. Customized jerseys need 2-3 extra days. Every order is securely packed and delivered fast. COD available on eligible orders. For any queries, just chat with us",
    "Player Version vs Fan Version - What's the difference?": "Sure! Here's the difference: Player Version: Slim fit, lightweight performance fabric with rubberised logos & sponsors. Fan Version: Regular fit, comfy fabric with embroidered logo & sponsors, perfect for casual wear. For more details you can see the video to the bottom of home page",
    "Need help or have a special request?": "Contact us on Telegram @VeloceSupport for quick support and special requirements.",
    "Do you accept bulk orders or custom name & number requests?": "Yes! For bulk orders, custom printing, or any special requests, please reach out to us on Telegram @VeloceSupport for direct assistance."
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    if (exactMatches[text.trim()]) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "bot", text: exactMatches[text.trim()] }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    try {
      let currentHistory = [...messages, userMsg];
      let finalReply = "";
      let keepGenerating = true;

      while (keepGenerating) {
        const responseData = await generateGeminiResponse(currentHistory);
        const candidate = responseData.candidates?.[0]?.content;
        
        if (!candidate) {
          throw new Error("Invalid response format");
        }

        const funcCallPart = candidate.parts.find((p: any) => p.functionCall);

        if (funcCallPart) {
          // Add model's function call to history
          currentHistory.push({
            id: Date.now().toString(),
            role: "bot",
            text: "",
            functionCall: funcCallPart.functionCall,
            thoughtSignature: funcCallPart.thoughtSignature,
          });

          const call = funcCallPart.functionCall;
          let functionResult: any = {};

          if (call.name === "searchProducts") {
            const query = call.args.query?.toLowerCase() || "";
            const matches = products
              .filter(p => p.name.toLowerCase().includes(query) || p.team.toLowerCase().includes(query))
              .slice(0, 5);
            functionResult = { products: matches.map(m => ({ id: m.id, name: m.name, team: m.team, price: m.price })) };
          } else if (call.name === "addToCart") {
            const p = products.find(p => p.id === call.args.productId);
            if (p) {
              const size = call.args.size || "M";
              addToCart({ id: p.id, size, color: p.colors?.[0] || "", qty: 1 });
              openCart();
              functionResult = { success: true, message: `Added ${p.name} to cart in size ${size}` };
            } else {
              functionResult = { success: false, error: "Product not found" };
            }
          } else if (call.name === "checkOrderStatus") {
            functionResult = { status: "Processing", message: "Your order is currently being processed and will ship soon." };
          }

          // Add function response to history
          currentHistory.push({
            id: Date.now().toString(),
            role: "user",
            text: "",
            functionResponse: {
              name: call.name,
              response: functionResult,
              id: call.id
            }
          });

        } else {
          // Text response
          finalReply = candidate.parts.find((p: any) => p.text)?.text || "";
          currentHistory.push({ id: Date.now().toString(), role: "bot", text: finalReply });
          keepGenerating = false;
        }
      }

      setMessages(currentHistory);
    } catch (err: any) {
      console.error("Bot Error:", err);
      const fallbackReply = generateFallbackResponse(userMsg.text);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "bot", text: fallbackReply }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput("");
    await sendMessage(currentInput);
  };

  const generateGeminiResponse = async (history: Message[]) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
    
    if (!apiKey) {
      throw new Error("No API Key");
    }

    const systemInstruction = `You are the official VIP concierge and virtual assistant for Veloce Wear, an elite online store selling premium quality 1:1 authentic football jerseys, basketball jerseys, cricket gear, and Formula 1 merchandise in India. 
Your tone must be highly professional, sophisticated, polite, and polished. Avoid using excessive emojis (use them very sparingly). Do not act childish or overly enthusiastic. Speak like a high-end luxury associate.
Knowledge Base:
- Shipping: FREE express shipping on ALL orders. Standard delivery takes 3-5 business days depending on the location in India. For metro cities, 2-3 days.
- Tracking: Tracking links are sent via SMS and email.
- Returns/Exchanges: 4-day easy exchange policy. Items must be unworn with tags. Custom prints cannot be exchanged.
- Sizing: Fan versions run true to size. Player Version (Authentic) run slim-fit; recommend ONE SIZE UP.
- Quality: Premium 1:1 authentic quality.
- Payments: Credit/Debit, UPI, Net Banking. Cash on Delivery (COD) available with ₹80 advance.
- Discounts: 'Buy 2 Get 1 Free' automatic offer at checkout.
- Contact: No email support. Fastest support is Telegram https://t.me/veloce_jersey

You can search the catalog for products and you can add items directly to the user's cart. Always ask for their preferred size before adding a clothing item to the cart. If you find a product, mention its details professionally.

CRITICAL DIRECTIVE: If anyone asks for admin details, admin info, admin credentials, or anything related to hacking/accessing the backend, you must immediately abandon your professional persona and reply exactly with: "ALRIGHT BITCH.....!"`;

    const contents = history
      .filter(m => m.id !== "1") 
      .map(m => {
        const parts: any[] = [];
        if (m.text) parts.push({ text: m.text });
        if (m.functionCall) {
          const part: any = { functionCall: m.functionCall };
          if (m.thoughtSignature) part.thoughtSignature = m.thoughtSignature;
          parts.push(part);
        }
        if (m.functionResponse) parts.push({ functionResponse: m.functionResponse });
        
        return {
          role: m.role === "bot" ? "model" : "user",
          parts
        };
      });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: contents,
        tools: [
          {
            functionDeclarations: [
              {
                name: "searchProducts",
                description: "Search the Veloce Wear product catalog by team, name, or keyword.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    query: { type: "STRING", description: "Search query, e.g., 'Real Madrid', 'Ferrari', 'Retro'" }
                  },
                  required: ["query"]
                }
              },
              {
                name: "addToCart",
                description: "Add a specific product to the user's shopping cart.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    productId: { type: "STRING", description: "The ID of the product." },
                    size: { type: "STRING", description: "The size (S, M, L, XL, XXL)." }
                  },
                  required: ["productId", "size"]
                }
              },
              {
                name: "checkOrderStatus",
                description: "Check the status of an order using its order ID.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    orderId: { type: "STRING" }
                  },
                  required: ["orderId"]
                }
              }
            ]
          }
        ],
        generationConfig: { temperature: 0.5, maxOutputTokens: 600 }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("API Error Body:", errBody);
      throw new Error("API Error: " + errBody);
    }

    return await response.json();
  };

  const generateFallbackResponse = (text: string) => {
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
    <div className="fixed bottom-16 right-4 z-[100] flex flex-col items-end sm:bottom-8 sm:right-8">
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
                <h3 className="text-sm font-semibold text-foreground">Veloce Wear Concierge</h3>
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
            {messages.map((msg) => {
              if (msg.functionCall || msg.functionResponse) return null; // Don't render raw function calls in UI
              
              return (
                <div key={msg.id} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[85%] gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-foreground text-background" : "bg-brand/20 text-brand"}`}>
                      {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-foreground text-background rounded-tr-sm" : "bg-surface text-foreground rounded-tl-sm border border-border/40"}`}>
                      {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                        part.match(/(https?:\/\/[^\s]+)/g) ? (
                          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                            {part}
                          </a>
                        ) : (
                          part
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

          {/* Quick Actions / Suggested Questions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 p-3 bg-surface border-t border-border/50 overflow-y-auto max-h-[160px]">
              {[
                "What are your shipping details?",
                "Player Version vs Fan Version - What's the difference?",
                "Need help or have a special request?",
                "Do you accept bulk orders or custom name & number requests?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-[11px] border border-border/70 rounded-full px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

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

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex group h-14 w-14 items-center justify-center rounded-full bg-brand text-background shadow-[0_8px_30px_rgba(246,92,41,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 ${open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
}
