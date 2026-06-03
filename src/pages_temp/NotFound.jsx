// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Home, ShoppingBag, Search, Compass, Map } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        
        {/* Abstract 404 Illustration */}
        <div className="relative mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-56 h-56 bg-white rounded-[3rem] flex flex-col items-center justify-center mx-auto shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5"
          >
            <span className="text-7xl font-black text-[#4a2c2a] tracking-tighter">404</span>
            <div className="h-1 w-12 bg-amber-900/20 rounded-full mt-2"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/30 mt-4">Lost in Transit</p>
          </motion.div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#4a2c2a]/5 rounded-full blur-2xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-900/5 rounded-full blur-2xl -z-10"></div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-4">
          A Rare Deviation
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-900/40 mb-10 leading-relaxed px-6">
          It seems this selection has melted away from our records. 
          Allow us to guide you back to our curated collections.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            to="/"
            className="bg-[#4a2c2a] text-[#fffcf8] py-5 px-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#3d2422] transition-all shadow-xl shadow-[#4a2c2a]/20 flex items-center justify-center space-x-3"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/shops"
            className="bg-white border border-amber-900/10 text-[#4a2c2a] py-5 px-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-amber-50/30 transition-all flex items-center justify-center space-x-3"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Boutique</span>
          </Link>
        </div>

        {/* Navigation Concierge */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-amber-900/5 shadow-inner"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Compass className="w-4 h-4 text-[#4a2c2a]" />
            <h3 className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-[0.3em]">Directives</h3>
          </div>
          
          <ul className="text-[10px] font-bold text-amber-900/50 uppercase tracking-[0.15em] space-y-4">
            <li className="flex items-center justify-center gap-2">
              <span className="w-1 h-1 bg-amber-900/20 rounded-full"></span>
              Verify the URL syntax
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-1 h-1 bg-amber-900/20 rounded-full"></span>
              Utilize the primary menu
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-1 h-1 bg-amber-900/20 rounded-full"></span>
              Inquire via support desk
            </li>
          </ul>
        </motion.div>

        {/* Brand Footer */}
        <div className="mt-12 flex items-center justify-center space-x-2 text-[9px] font-black text-amber-900/20 uppercase tracking-[0.5em]">
          <Map className="w-3 h-3" />
          <span>Choconut Global Registry</span>
        </div>

      </div>
    </div>
  );
}