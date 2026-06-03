// src/pages/ResetPasswordConfirm.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../shared/api/apiClient";
import { Lock, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Credential mismatch: Passwords do not align");
    }

    setLoading(true);
    try {
      await api.post("/password-reset-confirm/", {
        uid,
        token,
        new_password: newPassword
      });
      toast.success("Security Credentials Updated.");
      navigate("/login");
    } catch (err) {
      toast.error("Session Expired: Please initiate a new request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf8] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Branding/Safety Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-white border border-amber-900/10 mb-6 shadow-sm">
            <KeyRound className="w-7 h-7 text-[#4a2c2a]" />
          </div>
          <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-2">
            Secure Access
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/30">
            Define your new entry credentials
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 p-8 md:p-10">
          <form onSubmit={handleReset} className="space-y-6">

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">
                New Secret Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a2c2a]/30" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-5 bg-[#fffcf8] border border-amber-900/10 rounded-2xl focus:ring-2 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] outline-none transition-all text-[#4a2c2a] placeholder:text-amber-900/10 text-sm font-bold"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">
                Verify Secret Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a2c2a]/30" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-5 bg-[#fffcf8] border border-amber-900/10 rounded-2xl focus:ring-2 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] outline-none transition-all text-[#4a2c2a] placeholder:text-amber-900/10 text-sm font-bold"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#3d2422] disabled:opacity-30 shadow-xl shadow-[#4a2c2a]/20 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin" />
              ) : (
                <>
                  Update Credentials
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer */}
        <div className="mt-10 flex items-center justify-center space-x-4 opacity-30">
          <div className="h-px w-8 bg-amber-900/50"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-[#4a2c2a]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4a2c2a]">End-to-End Encrypted</span>
          </div>
          <div className="h-px w-8 bg-amber-900/50"></div>
        </div>
      </motion.div>
    </div>
  );
}