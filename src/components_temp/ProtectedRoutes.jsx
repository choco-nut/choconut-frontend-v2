import { Navigate, useLocation, Outlet } from "react-router-dom"; // Added Outlet


import { motion } from "framer-motion";
import { useUserStore } from "../entities/user/model/useUserStore";

export default function ProtectedRoute() { // Removed {children}
  const { currentUser, loadingAuth } = useUserStore();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-200 border-t-[#4a2c2a] rounded-full"
        />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Use Outlet instead of children because it's a layout route in App.js
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#fffcf8] min-h-screen"
    >
      <Outlet /> 
    </motion.div>
  );
}