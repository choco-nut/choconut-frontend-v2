// src/components/admin/StatsCard.jsx
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[32px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8 relative overflow-hidden group"
    >
      {/* Subtle Background Flourish */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
        <Icon size={120} strokeWidth={1} className="text-[#4a2c2a]" />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-900/40 mb-1">
              Metric Detail
            </span>
            <h3 className="text-sm font-bold text-amber-900/60 uppercase tracking-widest leading-none">
              {title}
            </h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-[#4a2c2a] tracking-tighter">
              {value}
            </p>
            {trend && (
              <div className="flex items-center text-emerald-600 font-black text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp size={10} className="mr-1" />
                {trend}%
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#fffcf8] border border-amber-900/5 text-[#4a2c2a] shadow-inner group-hover:bg-[#4a2c2a] group-hover:text-[#fffcf8] transition-all duration-300">
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Bottom Indicator Line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#4a2c2a] group-hover:w-full transition-all duration-700" />
    </motion.div>
  );
}