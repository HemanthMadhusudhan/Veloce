import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles, ShoppingBag, ChevronLeft, ChevronRight, Box, Truck, RefreshCw, Ticket, CheckCircle2, HeadphonesIcon } from "lucide-react";
import { useShop } from "@/lib/store";
import { useCatalog } from "@/lib/catalog-store";
import { useRouterState } from "@tanstack/react-router";

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  functionCall?: any;
  functionResponse?: any;
  thoughtSignature?: string;
};

export function SupportBot() {
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === "/" || routerState.location.pathname === "";

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

  const [view, setView] = useState<"home" | "chat" | "ticket" | "ticket_success">("home");
  const [ticketData, setTicketData] = useState({ email: "", desc: "" });

  const { cartOpen, addToCart, openCart } = useShop();
  const { products } = useCatalog();

  const [hasOverlay, setHasOverlay] = useState(false);

  useEffect(() => {
    const handleOverlay = (e: any) => {
      setHasOverlay(!!e.detail?.open);
    };
    window.addEventListener("overlay-change", handleOverlay);
    return () => window.removeEventListener("overlay-change", handleOverlay);
  }, []);

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

  if (!isHome) return null;

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
            functionResult = { products: matches.map(m => ({ id: m.id, name: m.name, team: m.team, price: m.price, image: m.images[0] })) };
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

You can search the catalog for products and you can add items directly to the user's cart. Always ask for their preferred size before adding a clothing item to the cart. When you search for and show products via function call, do NOT output any text describing them in your response; let the UI cards do the talking.

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
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col items-end w-full sm:w-auto">
      {/* Overlay for mobile when open */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm sm:hidden animate-in fade-in z-[-1]" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Window */}
      {open && (
        <div className="flex h-[85vh] w-full sm:h-[600px] sm:w-[420px] sm:mb-24 sm:mr-8 flex-col overflow-hidden bg-white sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 border border-black/15 rounded-t-[2rem]">
          {/* Header */}
          <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-black/10 z-10 shrink-0">
            <div className="flex items-center gap-3">
              {view !== "home" && (
                <button onClick={() => setView("home")} className="p-1 hover:bg-black/5 rounded-full transition-colors -ml-2">
                  <ChevronLeft className="h-5 w-5 text-black" />
                </button>
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d32f2f]/10 text-[#d32f2f]">
                <HeadphonesIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-black tracking-tight leading-none mb-1">
                  {view === "home" ? "Veloce Help Center" : view === "chat" ? "AI Support" : "Submit Ticket"}
                </h3>
                <p className="text-[10px] font-bold text-[#d32f2f] uppercase tracking-widest">
                  {view === "home" ? "24/7 SUPPORT" : view === "chat" ? "ONLINE" : "WE'LL EMAIL YOU"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-neutral-600 hover:bg-black/5 hover:text-black transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* VIEWS */}
          <div className="flex-1 overflow-hidden relative">
            {/* HOME VIEW */}
            {view === "home" && (
              <div className="absolute inset-0 overflow-y-auto px-6 py-6 bg-white animate-in fade-in slide-in-from-left-4 duration-300">
                <h2 className="text-[20px] font-black tracking-tight text-black mb-1">How can we help you?</h2>
                <p className="text-[13px] text-neutral-600 mb-6 font-medium">Select an option below or chat with our AI concierge.</p>

                <div className="flex flex-col gap-3">
                  {[
                    { icon: Box, label: "Help with an Order", text: "Check order status", highlight: false },
                    { icon: Truck, label: "Shipping & Delivery", text: "What are your shipping details?", highlight: false },
                    { icon: RefreshCw, label: "Returns & Exchanges", text: "What is your refund policy?", highlight: false },
                    { icon: Sparkles, label: "Chat with AI Concierge", text: "Hello", highlight: true },
                  ].map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setView("chat"); sendMessage(opt.text); }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        opt.highlight 
                          ? "border-[#d32f2f]/30 bg-[#d32f2f]/10 hover:border-[#d32f2f] shadow-xs" 
                          : "border-black/15 bg-white/70 hover:bg-white hover:border-black/40 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${opt.highlight ? "bg-[#d32f2f] text-white shadow-xs" : "bg-black/5 text-neutral-800"}`}>
                          <opt.icon className="h-4 w-4" />
                        </div>
                        <span className={`text-[14px] font-bold ${opt.highlight ? "text-[#d32f2f]" : "text-black"}`}>{opt.label}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${opt.highlight ? "text-[#d32f2f]" : "text-neutral-400"}`} />
                    </button>
                  ))}
                  
                  <div className="mt-3 border-t border-black/10 pt-5">
                    <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest mb-3">Still need human help?</p>
                    <button 
                      onClick={() => setView("ticket")}
                      className="flex items-center justify-between w-full p-4 rounded-2xl border border-black/15 bg-white/70 hover:bg-white hover:border-black/40 shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                          <Ticket className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] font-bold text-black leading-tight mb-0.5">Submit a Ticket</span>
                          <span className="text-[11px] text-neutral-600 font-medium">We'll reach out to you via email</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CHAT VIEW */}
            {view === "chat" && (
              <div className="absolute inset-0 flex flex-col bg-white animate-in fade-in slide-in-from-right-4 duration-300">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
                  {messages.map((msg) => {
                    if (msg.functionCall) return null;
                    if (msg.functionResponse) {
                      if (msg.functionResponse.name === "searchProducts" && msg.functionResponse.response?.products?.length > 0) {
                        return (
                          <div key={msg.id} className="flex w-full justify-start overflow-x-auto pb-2 gap-3 no-scrollbar pl-10">
                            {msg.functionResponse.response.products.map((p: any) => (
                              <div key={p.id} className="min-w-[140px] max-w-[140px] rounded-2xl border border-black/20 bg-white shadow-xs overflow-hidden flex flex-col shrink-0 p-2">
                                <img src={p.image} alt={p.name} className="w-full aspect-square object-contain rounded-xl bg-black/5" />
                                <div className="pt-2 flex flex-col flex-1">
                                  <h4 className="text-[12px] font-bold text-black leading-tight mb-1 line-clamp-2">{p.name}</h4>
                                  <span className="text-[12px] font-bold text-[#d32f2f] mt-auto block font-mono">₹{p.price.toLocaleString()}</span>
                                  <button onClick={() => { addToCart({ id: p.id, size: "M", color: "", qty: 1 }); openCart(); }} className="mt-2 flex w-full items-center justify-center gap-1.5 py-1.5 bg-[#d32f2f] text-white text-[10px] uppercase tracking-wider rounded-full font-bold hover:bg-red-700 transition-colors">
                                    <ShoppingBag className="h-3 w-3" /> Add
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <div key={msg.id} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex max-w-[85%] gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                          {msg.role === "bot" && (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d32f2f] text-white shadow-xs mt-1">
                              <Sparkles className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div className={`rounded-2xl px-4 py-3 text-[13px] sm:text-[14px] leading-relaxed shadow-xs ${msg.role === "user" ? "bg-black text-white rounded-tr-xs font-medium" : "bg-white text-neutral-900 rounded-tl-xs border border-black/15 font-medium"}`}>
                            {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                              part.match(/(https?:\/\/[^\s]+)/g) ? (
                                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#d32f2f] hover:underline font-bold">
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
                      <div className="flex gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d32f2f] text-white shadow-xs mt-1">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-black/15 bg-white px-4 py-3 shadow-xs">
                          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d32f2f]" style={{ animationDelay: "0ms" }} />
                          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d32f2f]" style={{ animationDelay: "150ms" }} />
                          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d32f2f]" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 border-t border-black/10 shrink-0">
                  <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full rounded-full border border-black/20 bg-white py-3 pl-5 pr-12 text-[14px] text-black outline-none focus:border-[#d32f2f] transition-colors placeholder:text-neutral-500 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#d32f2f] text-white transition disabled:opacity-40 hover:bg-red-700 shadow-xs cursor-pointer"
                    >
                      <Send className="h-4 w-4 -ml-0.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TICKET VIEW */}
            {view === "ticket" && (
              <div className="absolute inset-0 overflow-y-auto px-6 py-6 bg-white animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-[20px] font-black tracking-tight text-black mb-1">Submit a Ticket</h2>
                <p className="text-[13px] text-neutral-600 mb-6 leading-relaxed font-medium">Please describe your issue in detail. Our support team will review it and get back to you within 24 hours.</p>

                <form onSubmit={(e) => { e.preventDefault(); setView("ticket_success"); }} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={ticketData.email}
                      onChange={e => setTicketData({...ticketData, email: e.target.value})}
                      placeholder="you@example.com" 
                      className="w-full border border-black/20 bg-white p-3.5 text-[14px] rounded-xl focus:border-[#d32f2f] outline-none transition-colors font-medium text-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">Description</label>
                    <textarea 
                      required
                      value={ticketData.desc}
                      onChange={e => setTicketData({...ticketData, desc: e.target.value})}
                      placeholder="Please provide order number and issue details..." 
                      className="w-full border border-black/20 bg-white p-3.5 text-[14px] rounded-xl focus:border-[#d32f2f] outline-none min-h-[120px] resize-none transition-colors font-medium text-black" 
                    />
                  </div>
                  <button type="submit" className="mt-2 w-full bg-[#d32f2f] text-white py-3.5 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md active:scale-95 cursor-pointer">
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}

            {/* TICKET SUCCESS VIEW */}
            {view === "ticket_success" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-[#d32f2f]/10 rounded-full flex items-center justify-center text-[#d32f2f] mb-6 shadow-xs">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-[22px] font-black tracking-tight text-black mb-2">Ticket Submitted</h2>
                <p className="text-[13px] text-neutral-700 mb-6 leading-relaxed font-medium">
                  Your ticket <span className="font-bold text-black font-mono">#VEL-{Math.floor(1000 + Math.random() * 9000)}</span> has been created successfully. Our team will reach out to you at <span className="font-bold text-black">{ticketData.email}</span> within 24 hours.
                </p>
                <button 
                  onClick={() => { setView("home"); setTicketData({email: "", desc: ""}); }} 
                  className="w-full bg-black text-white py-3.5 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => { setOpen(!open); if(!open) setView("home"); }}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 bg-white text-black rounded-full border border-black/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-black hover:scale-105 active:scale-95 cursor-pointer ${(open || cartOpen || hasOverlay) ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
      >
        <MessageSquare className="h-5 w-5 text-[#d32f2f] stroke-[2]" />
        <span className="text-xs font-bold uppercase tracking-wider text-black">Support</span>
      </button>
    </div>
  );
}
