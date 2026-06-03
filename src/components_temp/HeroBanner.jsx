import { useState, useEffect, memo } from "react";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://media.istockphoto.com/id/2186322524/photo/dubai-chocolate-pistachio-paste-and-kunefe-filled-milk-chocolate.webp?a=1&b=1&s=612x612&w=0&k=20&c=a0w9gDhofmoT-f1adwJKeOVEVRWJy4Qm10-Eg4qdr94=",
  "https://images.unsplash.com/photo-1553452118-621e1f860f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
];

const features = [
  { icon: Star, text: "Premium Quality" },
  { icon: Truck, text: "Free Shipping" },
  { icon: Shield, text: "Quality Guarantee" },
  { icon: Heart, text: "Made with Love" }
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section className="relative w-full h-[85vh] min-h-[650px] overflow-hidden rounded-b-[40px] shadow-2xl bg-[#4a2c2a]">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt="ChocoNut Premium"
            className="w-full h-full object-cover"
          />
          {/* Premium Overlay: 
            Transitioning from Deep Cocoa (#4a2c2a) to a transparent center 
          */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a2c2a]/90 via-[#4a2c2a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a2c2a]/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-amber-200/20 border border-amber-200/30 text-amber-200 text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                Est. 2026 • ChocoNut
              </span>
              
              <h1 className="text-6xl md:text-8xl font-black text-[#fffcf8] mb-6 leading-tight">
                Indulge in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                  Sweet Luxury
                </span>
              </h1>

              <p className="text-lg md:text-xl text-amber-50/80 mb-10 leading-relaxed max-w-xl">
                Experience the harmony of single-origin cocoa and hand-picked premium nuts. 
                Handcrafted for the most discerning palates.
              </p>

              <div className="flex flex-wrap gap-5 mb-12">
                <Link
                  to="/shops"
                  className="group relative bg-[#fffcf8] text-[#4a2c2a] px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Collection <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-amber-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>

              {/* Features - Clean & Minimal */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-amber-50/70 hover:text-amber-200 transition-colors cursor-default">
                    <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm">
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-12 bottom-12 flex items-center space-x-6 z-20">
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                index === currentIndex ? "w-12 bg-amber-400" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
        
        <div className="flex space-x-3">
          <NavButton onClick={prevSlide} icon={<ChevronLeft />} />
          <NavButton onClick={nextSlide} icon={<ChevronRight />} />
        </div>
      </div>
    </section>
  );
};

const NavButton = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-[#4a2c2a] transition-all duration-300 active:scale-90"
  >
    {icon}
  </button>
);

export default memo(HeroBanner);