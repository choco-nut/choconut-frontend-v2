
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Calendar,
  Package,
  LogOut,
  Shield,
  Heart,
  Crown,
  ChevronRight
} from "lucide-react";
import { useUserStore } from "../entities/user/model/useUserStore";
import { motion } from "framer-motion";

export default function Profile() {
  const { currentUser, logout, orders, wishlist } = useUserStore();
  const navigate = useNavigate();

  // Redirect if no user
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 p-12 border border-amber-900/5"
        >
          <div className="w-20 h-20 bg-[#4a2c2a] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#4a2c2a]/20">
            <User className="w-10 h-10 text-[#fffcf8]" />
          </div>
          <h2 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-4">
            Private Access
          </h2>
          <p className="text-amber-900/60 font-medium mb-10 leading-relaxed">
            This user dashboard is reserved for our registered users.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#4a2c2a] text-[#fffcf8] py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#3d2422] transition-all flex items-center justify-center space-x-3"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            <span>Sign In to choconut</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const firstLetter = currentUser.name ? currentUser.name[0].toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-[#4a2c2a] tracking-tighter uppercase">Profile</h1>
            <p className="text-amber-900/50 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Account Management</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center space-x-2 text-[#4a2c2a]/40 hover:text-red-600 transition-colors font-black uppercase tracking-widest text-[10px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Identity Section */}
          <div className="lg:col-span-2 space-y-10">
            {/* Membership Card */}
            <div className="relative bg-[#4a2c2a] rounded-[40px] p-10 text-[#fffcf8] overflow-hidden shadow-2xl shadow-[#4a2c2a]/30">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Crown className="w-32 h-32 rotate-12" />
              </div>

              <div className="relative z-10 flex items-center space-x-8">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <span className="text-4xl font-black text-white">{firstLetter}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{currentUser.name}</h2>
                  <div className="flex items-center space-x-2 mt-1 opacity-60">
                    <Shield className="w-4 h-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Elite Member</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-8 relative z-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Member Since</p>
                  <p className="font-bold">{new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Registry ID</p>
                  <p className="font-mono text-xs opacity-80">{currentUser.userId}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-[32px] p-8 border border-amber-900/5 shadow-sm">
              <h3 className="text-xs font-black text-[#4a2c2a]/40 uppercase tracking-[0.3em] mb-8">Personal Information</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#fffcf8] rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-[#4a2c2a]/40" />
                    <span className="text-sm font-bold text-[#4a2c2a]">{currentUser.email}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-900/30">Primary</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#fffcf8] rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-[#4a2c2a]/40" />
                    <span className="text-sm font-bold text-[#4a2c2a]">System Last Sync: Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity & Quick Navigation */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="bg-white rounded-[32px] p-8 border border-amber-900/5 shadow-sm">
              <h3 className="text-[10px] font-black text-[#4a2c2a]/40 uppercase tracking-[0.3em] mb-6">Activity Ledger</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-amber-900/5 rounded-2xl text-center">
                  <p className="text-2xl font-black text-[#4a2c2a]">{orders?.length || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#4a2c2a]/40">Orders</p>
                </div>
                <div className="p-4 bg-amber-900/5 rounded-2xl text-center">
                  <p className="text-2xl font-black text-[#4a2c2a]">{wishlist?.length || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#4a2c2a]/40">Saved</p>
                </div>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="bg-white rounded-[32px] p-4 border border-amber-900/5 shadow-sm space-y-2">
              {[
                { label: "Purchase History", icon: Package, path: "/orders" },
                { label: "Artisan Wishlist", icon: Heart, path: "/wishlist" },
                { label: "Security Settings", icon: Shield, path: "/change-password" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 hover:bg-amber-900/5 rounded-2xl transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className="w-5 h-5 text-[#4a2c2a] opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-bold text-[#4a2c2a]">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-900/20 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}