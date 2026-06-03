// src/components/admin/sections/DashboardOverview.jsx
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import StatsCard from "../StatsCard";
import ChartContainer from "../ChartContainer";
import OrderStatusChart from "../PieChart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";



export default function DashboardOverview() {
  const { dashboard } = useAdminStore();
  const { stats, monthly_revenue, order_status, top_products } = dashboard;

  const cards = [
    { title: "Total Revenue", value: `$${stats.total_revenue.toLocaleString()}`, icon: DollarSign, trend: 12 },
    { title: "Orders", value: stats.total_orders, icon: ShoppingCart, trend: 8 },
    { title: "Products", value: stats.total_products, icon: Package },
    { title: "Users", value: stats.total_users, icon: Users, trend: 5 },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Header Intro */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter">
          Business Intelligence
        </h1>
        <p className="text-amber-900/40 text-[11px] font-bold uppercase tracking-[0.4em] mt-1">
          Real-time Choconut Performance
        </p>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* 3. Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ChartContainer title="Revenue Trajectory">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthly_revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4a2c2a10" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#4a2c2a', opacity: 0.4, fontSize: 10, fontWeight: 800}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#4a2c2a', opacity: 0.4, fontSize: 10, fontWeight: 800}}
              />
              <Tooltip 
                cursor={{fill: '#4a2c2a05'}}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(74 44 42 / 0.1)', background: '#fffcf8' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#4a2c2a" 
                radius={[12, 12, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <OrderStatusChart data={order_status} />
      </div>

      {/* 4. Secondary Full-Width Chart */}
      <ChartContainer title="Confectionery Demand (Top Products)">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={top_products}
            margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#4a2c2a10" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={120}
              tick={{fill: '#4a2c2a', fontSize: 11, fontWeight: 700}}
            />
            <Tooltip cursor={{fill: '#4a2c2a05'}} />
            <Bar
              dataKey="sales"
              fill="#8b5e34"
              radius={[0, 12, 12, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}