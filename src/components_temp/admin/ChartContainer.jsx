// src/components/admin/ChartContainer.jsx
import { Filter, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ChartContainer({ title, children, onFilter }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8 relative overflow-hidden group"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        <BarChart2 size={120} className="text-[#4a2c2a]" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-900/40 mb-1">
            Data Visualization
          </span>
          <h3 className="text-xl font-black text-[#4a2c2a] tracking-tight uppercase">
            {title}
          </h3>
        </div>

        {onFilter && (
          <button 
            onClick={onFilter}
            className="flex items-center self-start sm:self-center space-x-3 px-5 py-2.5 rounded-2xl bg-[#fffcf8] border border-amber-900/10 text-[#4a2c2a]/60 hover:text-[#4a2c2a] hover:border-[#4a2c2a]/30 transition-all duration-300"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Adjust Scope</span>
          </button>
        )}
      </div>

      <div className="relative z-10 min-h-[300px] w-full flex items-center justify-center">
        {/* The chart children will render here */}
        {children}
      </div>
    </motion.div>
  );
}