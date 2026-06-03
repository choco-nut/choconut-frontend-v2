import { useState, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../shared/api/apiClient";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      await api.post("/signup/", payload);

      toast.success("Welcome to the family! Please verify your email.");
      navigate("/verify-otp", { state: { email: email.trim().toLowerCase() } });
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf8] py-12 px-4 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-[#4a2c2a]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4a2c2a] rounded-2xl shadow-xl mb-6 -rotate-3">
            <Sparkles className="w-7 h-7 text-amber-200" />
          </div>
          <h2 className="text-4xl font-black text-[#4a2c2a] tracking-tight">
            Start Your <span className="italic font-serif text-amber-700">Journey</span>
          </h2>
          <p className="mt-2 text-amber-900/60 font-medium">Join our community of chocolate connoisseurs.</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(74,44,42,0.12)] border border-amber-100/50 p-8 sm:p-10">
          <form onSubmit={handleSignup} className="space-y-6">

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4a2c2a] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800/30 group-focus-within:text-[#4a2c2a] transition-colors" />
                <input
                  type="text"
                  placeholder="Theodore Cocoa"
                  className="w-full pl-12 pr-4 py-4 bg-[#fffcf8] border border-amber-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4a2c2a] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800/30 group-focus-within:text-[#4a2c2a] transition-colors" />
                <input
                  type="email"
                  placeholder="connoisseur@choconut.com"
                  className="w-full pl-12 pr-4 py-4 bg-[#fffcf8] border border-amber-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4a2c2a] ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800/30 group-focus-within:text-[#4a2c2a] transition-colors" />
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full pl-12 pr-4 py-4 bg-[#fffcf8] border border-amber-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#36201f] shadow-lg shadow-[#4a2c2a]/10 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Redirection */}
          <div className="mt-10 pt-8 border-t border-amber-50 text-center">
            <p className="text-amber-900/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Already a member?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-[#4a2c2a] font-black text-xs uppercase tracking-[0.2em] hover:text-amber-800 transition-colors"
            >
              <span>Sign In Instead</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-amber-900/30">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Artisan Platform</span>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Signup);