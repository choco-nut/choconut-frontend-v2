import { motion } from "framer-motion";
import { memo } from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fffcf8]/90 backdrop-blur-md">
      
      {/* 1. Silk Loading Bar (Top) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#4a2c2a] origin-left shadow-[0_2px_10px_rgba(74,44,42,0.2)]"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: [0, 0.3, 0.5, 0.8, 0.95],
          transition: { 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          } 
        }}
      />

      {/* 2. Premium Branding Animation */}
      <div className="relative">
        {/* Outer Elegant Rings */}
        {[1, 1.5, 2].map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-[24px] border border-amber-200/40"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: s + 0.5, opacity: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "easeOut" 
            }}
          />
        ))}
        
        {/* Center Logo Container */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-20 w-20 rounded-[24px] bg-[#4a2c2a] shadow-2xl flex items-center justify-center relative z-10"
        >
          {/* Logo Text/Icon */}
          <span className="text-[#fffcf8] font-black text-2xl tracking-tighter">
            CN
          </span>
          
          {/* Liquid Fill Effect Overlay */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-amber-500/20 rounded-b-[24px]"
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>

      {/* 3. Luxurious Typography */}
      <div className="mt-12 text-center">
        <motion.p 
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="text-xs font-black text-[#4a2c2a] uppercase tracking-[0.5em] mb-2"
        >
          Preparing Indulgence
        </motion.p>
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((dot) => (
            <motion.div 
              key={dot}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Decorative Bottom Tag */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10"
      >
        <span className="text-[10px] text-amber-800/40 font-bold uppercase tracking-widest">
          Handcrafted Excellence • 2026
        </span>
      </motion.div>
    </div>
  );
};

export default memo(PageLoader);