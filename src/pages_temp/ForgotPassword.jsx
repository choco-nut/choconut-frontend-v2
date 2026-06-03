// src/pages/ForgotPassword.jsx
import { useState } from "react";
import api from "../shared/api/apiClient";
import { Mail, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/password-reset/", { email: email.trim().toLowerCase() });
      setSubmitted(true);
      toast.success("Recovery instructions dispatched.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Credential not recognized");
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
        {/* Branding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-white border border-amber-900/10 mb-6 shadow-sm">
            <Mail className="text-[#4a2c2a] w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-2">
            Recover Access
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40">
            Securely restore your account credentials
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 p-8 md:p-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleResetRequest}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">
                    Registered Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a2c2a]/30 group-focus-within:text-[#4a2c2a] transition-colors" />
                    <input
                      type="email"
                      placeholder="patron@choconut.com"
                      className="w-full pl-12 pr-4 py-5 bg-[#fffcf8] border border-amber-900/10 rounded-2xl focus:ring-2 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] outline-none transition-all text-[#4a2c2a] placeholder:text-amber-900/10 text-sm font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#3d2422] disabled:opacity-30 shadow-xl shadow-[#4a2c2a]/20 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Recovery Link
                      <Send size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100 mb-6">
                  <Sparkles className="w-3 h-3 text-green-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-green-700">Instructions Dispatched</span>
                </div>

                <p className="text-[11px] font-bold text-amber-900/60 uppercase tracking-widest leading-relaxed mb-8">
                  Check your inbox. We've sent a unique recovery link to <br />
                  <span className="text-[#4a2c2a] lowercase italic">{email}</span>
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a2c2a] hover:opacity-60 transition-opacity"
                >
                  Request a new link
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 text-center">
          <Link to="/login" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#4a2c2a]/40 hover:text-[#4a2c2a] transition-colors">
            <ArrowLeft className="w-3 h-3 mr-3" />
            Back to Entrance
          </Link>
        </div>
      </motion.div>
    </div>
  );
}