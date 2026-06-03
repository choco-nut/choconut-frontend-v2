// src/components/admin/OrderStatusChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function OrderStatusChart({ data }) {
  const chartData = data.map((item) => ({
    name: item.order_status,
    value: item.count,
  }));

  // Premium Roasted Palette
  const COLORS = {
    DELIVERED: "#4a2c2a",    // Deep Cocoa
    SHIPPED: "#8b5e34",      // Roasted Almond
    PROCESSING: "#bc8a5f",   // Soft Caramel
    CANCELLED: "#e2d1c3",    // Milk Froth (Light Neutral)
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#4a2c2a] text-[#fffcf8] p-3 rounded-xl shadow-2xl border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-widest">{payload[0].name}</p>
          <p className="text-lg font-bold">{payload[0].value} <span className="text-[10px] opacity-60">Orders</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[500px] bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8 flex flex-col"
    >
      <div className="mb-8">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-900/40">Fulfillment Metrics</span>
        <h2 className="text-xl font-black text-[#4a2c2a] tracking-tight uppercase">
          Order Status Distribution
        </h2>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80} // Made it a Donut chart for a more modern look
              outerRadius={140}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#d6ccc2"}
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Premium Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {Object.entries(COLORS).map(([label, color]) => (
          <div key={label} className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a2c2a]/60">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}