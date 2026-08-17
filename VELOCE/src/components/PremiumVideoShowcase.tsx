import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function PremiumVideoShowcase() {
  const [videos, setVideos] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    async function fetchShowcase() {
      try {
        const [vidRes, setRes] = await Promise.all([
          supabase.from("mobile_showcase_videos").select("*").eq("active", true).order("display_order", { ascending: true }),
          supabase.from("mobile_showcase_settings").select("*").eq("id", 1).single()
        ]);
        if (vidRes.data) setVideos(vidRes.data);
        if (setRes.data) setSettings(setRes.data);
      } catch (e) {
        console.error("Failed to load mobile showcase", e);
      }
    }
    fetchShowcase();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.3 });
    
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex && isVisible) {
        video.play().catch(() => {});
      } else {
        video.pause();
        if (idx !== activeIndex) video.currentTime = 0;
      }
    });
  }, [activeIndex, videos, isVisible]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    
    if (diff > 0 && activeIndex === 0) {
      setDragOffset(diff * 0.2); // Resistance on first
    } else if (diff < 0 && activeIndex === videos.length - 1) {
      setDragOffset(diff * 0.2); // Resistance on last
    } else {
      setDragOffset(diff); // Follow finger
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchCurrentX.current === null) return;
    
    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 60; 
    
    if (diff < -threshold && activeIndex < videos.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else if (diff > threshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1); 
    }
    
    setDragOffset(0);
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  if (!settings || !settings.enable_on_mobile || videos.length === 0) return null;

  return (
    <section 
      ref={sectionRef}
      className="md:hidden py-10 bg-background overflow-hidden"
    >
      <div className="px-6 mb-10 text-center">
        <h2 className="text-3xl font-display font-bold tracking-tight text-foreground uppercase">
          {settings.heading}
        </h2>
        {settings.subtitle && (
          <p className="text-[11px] text-muted-foreground mt-3 font-semibold uppercase tracking-widest leading-relaxed">
            {settings.subtitle}
          </p>
        )}
      </div>

      <div 
        className="relative w-full aspect-[4/5] max-w-sm mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((vid, idx) => {
          const isActive = idx === activeIndex;
          const isPrev = idx < activeIndex;
          const isNext = idx > activeIndex;
          const offsetFromActive = idx - activeIndex;
          
          let translateX = "0px";
          let translateY = "0px";
          let scale = 1;
          let rotate = "0deg";
          let opacity = 1;
          let zIndex = 50 - Math.abs(offsetFromActive);
          let shadow = "0 30px 60px rgba(0,0,0,0.4)";
          
          if (isActive) {
            translateX = `${dragOffset}px`;
            rotate = `${dragOffset * 0.04}deg`; 
            scale = 1 - Math.abs(dragOffset) * 0.0006;
            // Shadow diminishes as it moves away
            const shadowOp = Math.max(0.1, 0.4 - Math.abs(dragOffset) * 0.001);
            shadow = `0 30px 60px rgba(0,0,0,${shadowOp})`;
          } else if (isPrev) {
            translateX = "-120%";
            rotate = "-15deg";
            scale = 0.9;
            opacity = 0; 
            shadow = "none";
          } else if (isNext) {
            const baseScale = 1 - (offsetFromActive * 0.07); // 0.93, 0.86
            const baseY = offsetFromActive * 22; // 22px, 44px
            const baseOpacity = Math.max(0, 1 - (offsetFromActive * 0.4)); // 0.6, 0.2
            
            scale = baseScale;
            translateY = `${baseY}px`;
            opacity = baseOpacity;
            shadow = `0 ${20 - offsetFromActive * 10}px ${30 - offsetFromActive * 10}px rgba(0,0,0,0.2)`;
            
            if (dragOffset < 0) {
              const progress = Math.min(Math.abs(dragOffset) / (window.innerWidth * 0.7 || 300), 1);
              const targetScale = 1 - ((offsetFromActive - 1) * 0.07);
              const targetY = (offsetFromActive - 1) * 22;
              const targetOpacity = Math.max(0, 1 - ((offsetFromActive - 1) * 0.4));
              
              scale = baseScale + (targetScale - baseScale) * progress;
              translateY = `${baseY + (targetY - baseY) * progress}px`;
              opacity = baseOpacity + (targetOpacity - baseOpacity) * progress;
              
              if (offsetFromActive === 1) {
                shadow = `0 ${10 + 20 * progress}px ${20 + 40 * progress}px rgba(0,0,0,${0.2 + 0.2 * progress})`;
              }
            }
          }

          return (
            <div 
              key={vid.id} 
              className="absolute inset-0 w-[90%] mx-auto origin-top"
              style={{
                transform: `translateX(${translateX}) translateY(${translateY}) scale(${scale}) rotate(${rotate})`,
                opacity,
                zIndex,
                boxShadow: shadow,
                borderRadius: "1.5rem",
                transition: dragOffset === 0 ? "transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.7s ease, box-shadow 0.7s ease" : "none",
              }}
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10">
                <video
                  ref={(el) => { videoRefs.current[idx] = el; }}
                  src={vid.video_url}
                  className="w-full h-full object-cover"
                  loop={vid.loop !== false}
                  muted
                  playsInline
                  preload="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/90 pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-row items-end justify-between z-10 gap-4">
                  <div className="flex-1">
                    {vid.show_product_name && vid.product_name && (
                      <h3 className="text-white font-display font-bold text-xl leading-tight drop-shadow-md">
                        {vid.product_name}
                      </h3>
                    )}
                  </div>
                  
                  {vid.show_shop_now && vid.product_link && (
                    <Link 
                      to={vid.product_link.startsWith("/") ? vid.product_link : `/product/${vid.product_link}`}
                      className="shrink-0 bg-white/95 backdrop-blur-md text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl pointer-events-auto transition-transform active:scale-95 border border-white"
                    >
                      Shop
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
