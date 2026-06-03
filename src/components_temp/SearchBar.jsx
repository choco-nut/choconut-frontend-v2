// src/components/SearchBar.jsx
import { Search, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative flex-1 max-w-2xl group">
      <div className="relative">
        {/* Leading Icon */}
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4a2c2a]/30 group-focus-within:text-[#4a2c2a] transition-colors duration-300" />
        
        {/* Discovery Input */}
        <input
          type="text"
          placeholder="Discover artisanal blends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border border-amber-900/5 rounded-2xl shadow-sm text-[#4a2c2a] text-sm font-bold placeholder:text-amber-900/20 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a]/20 transition-all duration-300 hover:border-amber-900/10"
        />
        
        {/* Clear Button - Refined UI */}
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-xl bg-amber-900/5 text-[#4a2c2a]/40 hover:text-[#4a2c2a] hover:bg-amber-900/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}