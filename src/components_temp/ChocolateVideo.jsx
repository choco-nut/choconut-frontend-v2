import { memo } from "react";
import { motion } from "framer-motion";

const ChocolateVideo = () => {
  return (
    <section className="bg-[#4a2c2a] w-full h-[90vh] relative overflow-hidden my-20 rounded-[50px] max-w-[95%] mx-auto shadow-2xl isolate z-0" style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
      {/* Background Video */}
      <video
        className="w-full h-full object-cover scale-105"
        src="/videos/chocolate.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>
    
      {/* Sophisticated Cocoa Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a2c2a]/60 via-transparent to-[#4a2c2a]/80" />

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-[2px] p-8 md:p-12 rounded-[40px] border border-white/10"
        >
          {/* Brand Tagline */}
          <span className="text-amber-200 font-black text-xs uppercase tracking-[0.4em] mb-4 block">
            Our Story & Heritage
          </span>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-black text-[#fffcf8] mb-8 tracking-tighter">
            About <span className="italic font-serif text-amber-200">ChocoNut</span>
          </h2>

          {/* Body Text */}
          <p className="text-amber-50/90 max-w-2xl text-lg md:text-xl leading-relaxed font-medium mx-auto">
            At ChocoNut, we don't just make sweets; we craft sensory experiences. 
            By marrying single-origin <span className="text-amber-200 font-bold">Criollo cocoa</span> with 
            slow-roasted premium nuts, we ensure every bite is a journey through 
            the world's finest flavors.
          </p>

          {/* Decorative Signature or Element */}
          <div className="mt-10 flex justify-center">
             <div className="w-12 h-[1px] bg-amber-200/50" />
             <div className="mx-4 w-2 h-2 rounded-full bg-amber-200 rotate-45" />
             <div className="w-12 h-[1px] bg-amber-200/50" />
          </div>
        </motion.div>
      </div>

      {/* Floating Badge (Visual Polish) */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <div className="w-24 h-24 rounded-full border border-amber-200/30 flex items-center justify-center backdrop-blur-md">
          <p className="text-[10px] text-amber-200 font-bold text-center leading-tight uppercase tracking-widest">
            100% <br /> Natural <br /> Ingredients
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(ChocolateVideo);