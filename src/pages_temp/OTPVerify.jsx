// src/pages/VerifyOTP.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, RotateCcw, Mail } from "lucide-react";
import { toast } from "react-toastify";
import api from "../shared/api/apiClient";
import { useUserStore } from "../entities/user/model/useUserStore";

import { setAccessToken } from "../shared/api/apiClient";
import { motion } from "framer-motion";

export default function VerifyOTP() {
  const { setCurrentUser } = useUserStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      toast.error("Session expired. Please restart the registration.");
      navigate("/signup");
      return;
    }
    setEmail(emailFromState);
  }, [location.state, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOTP = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      await api.post(`/otp/resend/`, { email, purpose: "signup" });
      toast.success("A fresh code has been dispatched.");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Dispatched failed");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const res = await api.post(`/otp/verify/`, { email, otp, purpose: "signup" });
      setAccessToken(res.data.access);
      setCurrentUser(res.data.user);
      toast.success("Identity Confirmed. Welcome.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired code");
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white border border-amber-900/10 mb-6 shadow-sm">
            <ShieldCheck className="text-[#4a2c2a] w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-3">
            Identity Access
          </h1>
          <div className="flex items-center justify-center space-x-2 text-amber-900/50">
            <Mail size={14} />
            <p className="text-[11px] font-bold uppercase tracking-widest leading-none">
              Sent to <span className="text-[#4a2c2a] lowercase italic">{email}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 p-8 md:p-10">
          <form onSubmit={handleVerifyOTP} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40 ml-1">
                Security Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                maxLength="6"
                placeholder="0 0 0 0 0 0"
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-5 bg-[#fffcf8] border border-amber-900/10 rounded-2xl focus:ring-2 focus:ring-[#4a2c2a]/10 focus:border-[#4a2c2a] outline-none transition-all text-[#4a2c2a] placeholder:text-amber-900/10"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#3d2422] disabled:opacity-30 shadow-xl shadow-[#4a2c2a]/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-amber-900/5">
            <button
              onClick={handleResendOTP}
              disabled={resendLoading || timer > 0}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a2c2a] disabled:text-amber-900/20 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw
                size={12}
                className={`${resendLoading ? "animate-spin" : ""} ${timer > 0 ? "opacity-20" : ""}`}
              />
              {resendLoading
                ? "Dispatched..."
                : timer > 0
                  ? `Resend available in ${timer}s`
                  : "Request new code"}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-[9px] font-bold text-amber-900/30 uppercase tracking-[0.2em]">
          Protected by Choconut Vault Protocol
        </p>
      </motion.div>
    </div>
  );
}
