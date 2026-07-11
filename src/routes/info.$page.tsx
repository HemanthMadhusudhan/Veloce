import { createFileRoute } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { Mail, Phone, MapPin, Truck, RotateCcw, HelpCircle, Leaf, Users, BookOpen, Briefcase } from "lucide-react";

export const Route = createFileRoute("/info/$page")({
  component: InfoPage,
});

const PAGES: Record<string, { title: string; subtitle: string; icon: React.ElementType; content: () => React.ReactNode }> = {
  about: {
    title: "About Veloce",
    subtitle: "Our Story",
    icon: Users,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">Veloce was born from a simple belief — every jersey tells a story. Founded in 2024, we set out to bring premium, authentic football jerseys and Formula 1 merchandise to fans across India, at prices that don't break the bank.</p>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Our Mission</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">To make world-class sports merchandise accessible to every passionate fan. We believe you shouldn't have to choose between quality and affordability.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">What Sets Us Apart</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span><strong className="text-foreground">100% Authentic:</strong> Every jersey is sourced through verified channels and comes with an authenticity guarantee.</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span><strong className="text-foreground">Player-Version Quality:</strong> Premium fabrics, precision stitching, and attention to detail that matches what the pros wear.</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span><strong className="text-foreground">Custom Printing:</strong> Add your name and number to make every jersey truly yours.</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span><strong className="text-foreground">Fan-First Service:</strong> 4-day easy exchange, free shipping over ₹499, and a team that actually cares.</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Our Team</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">We're a small, passionate team of sports fans, designers, and logistics experts based in India. Every order is handled with the same excitement we feel when our favourite team scores a last-minute winner.</p>
        </div>
      </div>
    ),
  },
  journal: {
    title: "The Journal",
    subtitle: "Stories & Updates",
    icon: BookOpen,
    content: () => (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.24em] text-brand">July 2026</div>
          <h3 className="font-display text-lg font-semibold">FIFA World Cup 2026 Collection is Here!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">The biggest tournament in football history is upon us. We've curated jerseys from all 48 participating nations — from powerhouses like Brazil and Germany to dark horses making their World Cup debut. Shop the full collection now and wear your nation's colours with pride.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.24em] text-brand">June 2026</div>
          <h3 className="font-display text-lg font-semibold">New Retro Collection Drop</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Relive the golden moments of football with our retro collection. From the iconic 1998 France home shirt to the legendary 2006 Italy kit, these timeless designs are back in premium quality reproductions.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.24em] text-brand">May 2026</div>
          <h3 className="font-display text-lg font-semibold">F1 Season Update: New Team Merch</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">The 2026 F1 season is heating up! We've added the latest team merchandise from Scuderia Ferrari, McLaren, Red Bull Racing, Mercedes-AMG, and Aston Martin. Rep your constructor from the grandstand or your living room.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.24em] text-brand">April 2026</div>
          <h3 className="font-display text-lg font-semibold">Buy 2 Get 1 Free — Now Live!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Our most-requested deal is finally here. Add 3 jerseys to your cart and the cheapest one is automatically free. Use code B2G1 or just add 3 items — the discount applies automatically. No catch, no fine print.</p>
        </div>
      </div>
    ),
  },
  sustainability: {
    title: "Sustainability",
    subtitle: "Our Commitment",
    icon: Leaf,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">At Veloce, we believe that premium quality and environmental responsibility can go hand in hand. Here's how we're working to reduce our footprint while delivering the best jerseys to you.</p>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">🌿 Eco-Friendly Packaging</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">All our orders are shipped in 100% recyclable packaging. We've eliminated single-use plastics from our supply chain and use biodegradable mailers made from cornstarch.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">♻️ Responsible Sourcing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">We partner with manufacturers who prioritise ethical labour practices and sustainable materials. Our jerseys are made with recycled polyester where possible, reducing waste without compromising on quality.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">📦 Reduced Carbon Shipping</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">We consolidate shipments and work with logistics partners who offer carbon-neutral delivery options. Our goal is to offset 100% of our shipping emissions by 2027.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">🤝 Community Giveback</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">For every 100 jerseys sold, we donate a jersey to underprivileged young athletes through our partner NGOs. Because every kid deserves to feel like a champion.</p>
        </div>
      </div>
    ),
  },
  careers: {
    title: "Careers",
    subtitle: "Join the Team",
    icon: Briefcase,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">We're always looking for passionate people who love sports and want to build something extraordinary. At Veloce, you won't just work — you'll be part of a team that's changing how fans experience merchandise.</p>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Why Veloce?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span>Work with a young, energetic team that breathes sports</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span>Flexible, remote-first culture</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span>Free jerseys (obviously!)</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" /><span>Competitive pay + performance bonuses</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Current Openings</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">We don't have any specific openings right now, but we're always excited to hear from talented people. Send us your resume and a note about why you'd be a great fit!</p>
          <p className="text-sm text-muted-foreground">📧 Email: <a href="mailto:careers@velocejersey.com" className="text-brand hover:underline">careers@velocejersey.com</a></p>
        </div>
      </div>
    ),
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in Touch",
    icon: Mail,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">Got a question, concern, or just want to talk jerseys? We'd love to hear from you. Our support team typically responds within 4–6 hours.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center space-y-3">
            <Mail className="h-6 w-6 mx-auto text-brand" />
            <h3 className="font-display text-sm font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">support@velocejersey.com</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center space-y-3">
            <Phone className="h-6 w-6 mx-auto text-brand" />
            <h3 className="font-display text-sm font-semibold">Phone</h3>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            <p className="text-[11px] text-muted-foreground">Mon–Sat, 10am–7pm IST</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-center space-y-3">
            <MapPin className="h-6 w-6 mx-auto text-brand" />
            <h3 className="font-display text-sm font-semibold">Address</h3>
            <p className="text-sm text-muted-foreground">Veloce HQ, Mumbai, Maharashtra, India</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Quick Help</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>📦 <strong className="text-foreground">Order tracking:</strong> Reply to your order confirmation email, or DM us on Instagram.</li>
            <li>🔄 <strong className="text-foreground">Exchange/Return:</strong> Visit our Returns page for the step-by-step process.</li>
            <li>👕 <strong className="text-foreground">Size guide:</strong> Check the size chart on any product page before ordering.</li>
            <li>🎁 <strong className="text-foreground">Bulk orders:</strong> Planning for a club or group? Email us for special pricing.</li>
          </ul>
        </div>
      </div>
    ),
  },
  shipping: {
    title: "Shipping Policy",
    subtitle: "Delivery Information",
    icon: Truck,
    content: () => (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Shipping Rates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 text-left"><th className="pb-3 text-muted-foreground font-medium">Order Value</th><th className="pb-3 text-muted-foreground font-medium">Shipping Cost</th><th className="pb-3 text-muted-foreground font-medium">Delivery Time</th></tr></thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/30"><td className="py-3">Above ₹499</td><td className="py-3 text-brand font-semibold">FREE</td><td className="py-3">5–7 business days</td></tr>
                <tr className="border-b border-border/30"><td className="py-3">Below ₹499</td><td className="py-3">₹79</td><td className="py-3">5–7 business days</td></tr>
                <tr><td className="py-3">Express Delivery</td><td className="py-3">₹149</td><td className="py-3">2–3 business days</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Delivery Areas</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">We deliver across all of India including metros, tier-2, and tier-3 cities. Remote areas may take 1–2 extra business days.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">COD Available</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Pay a small ₹80 prepaid charge online at checkout to confirm your order, and pay the remaining balance in cash when your order is delivered.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Order Tracking</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Once your order ships, you'll receive an email and SMS with a tracking link. You can track your order in real-time through our logistics partner's website.</p>
        </div>
      </div>
    ),
  },
  returns: {
    title: "Returns & Exchange",
    subtitle: "Hassle-Free Returns",
    icon: RotateCcw,
    content: () => (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">4-Day Easy Exchange</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Not the right size? No worries! You can exchange your jersey within 4 days of delivery. The product must be unused, unwashed, and in its original packaging with all tags attached.</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">How to Exchange</h3>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
            <li>Email <a href="mailto:support@velocejersey.com" className="text-brand hover:underline">support@velocejersey.com</a> with your order number and reason for exchange.</li>
            <li>Our team will confirm and send a pickup link within 24 hours.</li>
            <li>Pack the item in the original packaging and hand it to the courier.</li>
            <li>Your replacement will be shipped within 2 business days of receiving the return.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Non-Exchangeable Items</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /><span>Custom printed jerseys (with name/number)</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /><span>Items that have been washed or worn</span></li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /><span>Items without original tags and packaging</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Refund Policy</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">We currently offer exchanges only (no direct refunds). If the same product isn't available in your preferred size, we'll issue store credit valid for 6 months.</p>
        </div>
      </div>
    ),
  },
  faq: {
    title: "FAQ",
    subtitle: "Frequently Asked Questions",
    icon: HelpCircle,
    content: () => (
      <div className="space-y-4">
        {[
          { q: "Are your jerseys authentic?", a: "Yes! All our jerseys are 100% authentic player-version quality. We source directly from verified manufacturers and each piece comes with an authenticity guarantee." },
          { q: "What does 'Player Version' mean?", a: "Player-version jerseys are made with the same premium fabric and fit used by professional athletes. They feature tighter fits, better moisture-wicking technology, and higher quality printing compared to fan versions." },
          { q: "How does 'Buy 2 Get 1 Free' work?", a: "Simply add 3 or more jerseys to your cart. The cheapest one will automatically be free — no coupon code needed (though B2G1 auto-applies). The discount shows at checkout." },
          { q: "Can I customise my jersey with a name and number?", a: "Absolutely! On any product page, you'll see fields to add a custom name and number. The printing is included in the price at no extra cost." },
          { q: "What sizes do you offer?", a: "We offer sizes from S to XXL. Each product page has a detailed size chart. If you're between sizes, we recommend going one size up for a comfortable fit." },
          { q: "How long does delivery take?", a: "Standard delivery takes 5–7 business days across India. Express delivery (₹149) gets your order to you in 2–3 business days. Free shipping on orders above ₹499." },
          { q: "How does COD work?", a: "Cash on Delivery is available for all orders with a small ₹80 prepaid charge to confirm the order. The remaining order total can be paid in cash when delivered." },
          { q: "Can I exchange my order?", a: "Yes, we offer 4-day easy exchange. The product must be unused, unwashed, and in its original packaging. Custom-printed jerseys cannot be exchanged." },
          { q: "Do you ship internationally?", a: "Currently, we only ship within India. We're working on expanding to international shipping — sign up for our newsletter to be the first to know!" },
          { q: "How can I track my order?", a: "Once your order ships, you'll receive an email and SMS with a tracking link. You can track it in real-time through our delivery partner's website." },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-card/40 p-6 space-y-2">
            <h3 className="font-display text-sm font-semibold">{item.q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
};

function InfoPage() {
  const { page } = Route.useParams();
  const data = PAGES[page];

  if (!data) {
    return (
      <SiteChrome>
        <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 text-center">
          <h1 className="font-display text-4xl font-bold">Page not found</h1>
          <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </SiteChrome>
    );
  }

  const Icon = data.icon;

  return (
    <SiteChrome>
      <div className="mx-auto max-w-3xl px-5 pt-32 pb-20 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-brand">
            <Icon className="h-3.5 w-3.5" /> {data.subtitle}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">{data.title}</h1>
        </div>
        {data.content()}
      </div>
    </SiteChrome>
  );
}
