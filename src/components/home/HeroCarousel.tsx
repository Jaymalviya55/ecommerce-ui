import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BANNERS = [
  {
    id: 1,
    title: "Summer Tech Sale",
    subtitle: "Up to 50% Off on Premium Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2400&auto=format&fit=crop",
    link: "/category/Electronics",
    align: "left"
  },
  {
    id: 2,
    title: "Premium Apparel",
    subtitle: "Elevate your style with our new collection",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop",
    link: "/category/clothes",
    align: "center"
  },
  {
    id: 3,
    title: "Level Up Your Game",
    subtitle: "Pro-grade gear for serious gamers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2400&auto=format&fit=crop",
    link: "/category/Electronics",
    align: "right"
  }
];

export const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full mx-auto mb-12 rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {BANNERS.map((banner) => (
            <Link 
              to={banner.link}
              className="flex-[0_0_100%] min-w-0 relative h-[220px] sm:h-[350px] md:h-[450px] block cursor-pointer" 
              key={banner.id}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {/* Gradient Overlay for text readability */}
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  banner.align === 'left' ? 'from-black/90 via-black/50 to-transparent' : 
                  banner.align === 'right' ? 'from-transparent via-black/50 to-black/90' : 
                  'from-black/70 via-black/50 to-black/70'
                }`}></div>
              </div>

              {/* Content */}
              <div className={`absolute inset-0 flex flex-col justify-center px-6 md:px-24 ${
                banner.align === 'left' ? 'items-start text-left' : 
                banner.align === 'right' ? 'items-end text-right' : 
                'items-center text-center'
              }`}>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-2 sm:mb-4 drop-shadow-2xl tracking-tight translate-y-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-lg md:text-2xl text-slate-200 mb-8 max-w-2xl drop-shadow-md translate-y-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]">
                  {banner.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 hover:scale-110"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 hover:scale-110"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-500 rounded-full ${
              index === selectedIndex 
                ? 'w-10 h-2.5 bg-primary shadow-[0_0_15px_rgba(99,102,241,0.9)]' 
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
