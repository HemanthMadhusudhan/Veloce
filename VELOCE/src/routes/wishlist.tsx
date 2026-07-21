import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ChevronLeft, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { useCatalog } from "@/lib/catalog-store";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Veloce Wear" }] }),
  component: () => (
    <SiteChrome>
      <WishlistPage />
    </SiteChrome>
  ),
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const { products } = useCatalog();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-white min-h-screen text-black font-sans pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Header Section */}
        <Link to="/profile" className="inline-flex items-center text-[12px] font-bold text-black hover:opacity-70">
          <ChevronLeft className="h-4 w-4 mr-1 stroke-[2.5]" /> My Account
        </Link>
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight mt-3 mb-8">My account</h1>
        
        <div className="flex justify-between items-end border-b border-gray-200 pb-3 mb-10">
          <h2 className="text-[18px] uppercase font-normal tracking-wide text-gray-800">My Wishlist</h2>
          <span className="text-[13px] text-gray-600">{items.length} items</span>
        </div>

        {/* Content Section */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="h-40 w-40 text-gray-300 stroke-[1.5]" />
            <h3 className="text-[24px] font-bold mt-4 mb-20">Your Wishlist is Empty</h3>
            <Link
              to="/profile"
              className="text-[14px] font-bold uppercase tracking-wide border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600"
            >
              RETURN TO MY ACCOUNT
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {items.map((p) => (
              <div key={p.id} className="flex flex-col">
                <div className="flex gap-4 sm:gap-6">
                  {/* Image */}
                  <div className="relative w-[130px] sm:w-[160px] shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-auto object-cover bg-gray-100" />
                    <div className="absolute bottom-2 left-2 bg-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-[9px] font-bold text-green-700 tracking-wider">IN STOCK</span>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col flex-1 text-[13px] sm:text-[14px]">
                    <div className="font-bold leading-tight mb-1">{p.name}</div>
                    <div className="text-gray-500 mb-3">Color: PUMA Black-Faster Yellow</div>
                    
                    <div className="flex gap-2 font-bold mb-1">
                      <span>SIZE:</span> <span className="font-normal text-gray-700">S</span>
                    </div>
                    <div className="flex gap-2 font-bold mb-1">
                      <span>PRICE:</span> <span className="font-normal text-gray-700 font-sans">₹{p.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex gap-2 font-bold mb-5">
                      <span>STYLE NUMBER:</span> <span className="font-normal text-gray-700">660601_03</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-4">
                        <button className="text-black hover:opacity-60">
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button onClick={() => toggleWishlist(p.id)} className="text-black hover:opacity-60">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="font-bold text-[13px]">
                        Item added 19/07
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart({ id: p.id, size: "S", color: "PUMA Black-Faster Yellow", qty: 1 })}
                  className="w-full bg-[#181818] text-white py-4 mt-6 text-[14px] font-bold uppercase tracking-wider hover:bg-black"
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
