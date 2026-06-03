// src/components/admin/AdminSidebar.jsx
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  LogOut,
  X,
  UsersIcon,
  Gem,
  ArrowUpRight,
  Bell,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { id: "dashboard", name: "Dashboard Overview", icon: BarChart3, path: "/admin/dashboard" },
  { id: "products", name: "Products", icon: Package, path: "/admin/products" },
  { id: "orders", name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { id: "users", name: "Users", icon: UsersIcon, path: "/admin/users" },
  { id: "messages", name: "Communication", icon: MessageSquare, path: "/admin/messages" },
  { id: "notifications", name: "Notifications", icon: Bell, path: "/admin/notifications" }
];

export default function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  onSidebarToggle,
  onNavigateToStore 
}) {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    onTabChange(item.id);
    navigate(item.path);
    onSidebarToggle(false); // Close mobile sidebar
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#4a2c2a] transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 transition-transform duration-500 ease-[0.19, 1, 0.22, 1] shadow-2xl`}>
      
      {/* Branding Header */}
      <div className="flex items-center justify-between h-24 px-8 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#fffcf8] rounded-[12px] flex items-center justify-center shadow-inner">
            <Gem className="w-5 h-5 text-[#4a2c2a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#fffcf8] font-black text-lg tracking-tighter uppercase leading-none">Admin</span>
            <span className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase mt-1">Command</span>
          </div>
        </div>
        
        <button 
          onClick={() => onSidebarToggle(false)}
          className="lg:hidden p-2 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Body */}
      <nav className="mt-10 px-6 space-y-3">
        <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Main Navigation</p>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 relative ${
                isActive
                  ? "bg-[#fffcf8] text-[#4a2c2a] shadow-xl shadow-black/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center space-x-4">
                <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-[#4a2c2a]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Branding/Exit */}
      <div className="absolute bottom-8 left-6 right-6 space-y-3">
        
        <button
          onClick={onNavigateToStore}
          className="w-full flex items-center justify-between px-6 py-4 text-white/40 hover:text-[#fffcf8] hover:bg-white/5 rounded-2xl transition-all group"
        >
          <div className="flex items-center space-x-4">
            <LogOut className="w-4 h-4 rotate-180" />
            <span className="text-[10px] font-black uppercase tracking-widest">Public Store</span>
          </div>
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
        </button>
      </div>
    </div>
  );
}