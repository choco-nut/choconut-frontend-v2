import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fffcf8] z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Cocoa Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#4a2c2a]/10 border-t-[#4a2c2a] rounded-full"
        />
        <p className="text-[#4a2c2a] font-black uppercase tracking-widest text-[10px] animate-pulse">
          Choconut is loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
