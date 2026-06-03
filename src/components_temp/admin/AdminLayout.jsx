// src/components/admin/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/products')) setActiveTab('products');
    else if (path.includes('/admin/orders')) setActiveTab('orders');
    else if (path.includes('/admin/users')) setActiveTab('users');
    else if (path.includes('/admin/messages')) setActiveTab('messages');
    else if (path.includes('/admin/notifications')) setActiveTab('notifications');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#fffcf8] selection:bg-[#4a2c2a]/10">
      {/* Premium Sidebar Component */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={setSidebarOpen}
        onNavigateToStore={() => navigate("/")}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-500 lg:ml-72`}>
        {/* The Atelier Header */}
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onSidebarToggle={setSidebarOpen}
          activeTab={activeTab}
        />

        <main className="p-4 sm:p-8 lg:p-12">
          {/* Transition wrapper for smooth page changes */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay - Cocoa-tinted glass effect */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#4a2c2a]/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Fine-line decoration for a luxury feel */}
      <div className="fixed top-0 right-0 w-[1px] h-screen bg-amber-900/5 pointer-events-none" />
    </div>
  );
}