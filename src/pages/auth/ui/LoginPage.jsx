import { useState, useEffect, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../../shared/api/apiClient"; // Using your existing api export
import { useUserStore } from "../../../entities/user/model/useUserStore";
import { useUser } from "../../../entities/user/api/useUser";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

const LoginPage = () => {
  const { user, setAuth } = useUserStore();
  const { isLoading: loadingAuth } = useUser();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user && !loadingAuth) {
      navigate(user.isAdmin ? "/admin/dashboard" : "/");
    }
  }, [user, loadingAuth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      // Points to your backend /login/ endpoint
      const res = await api.post("/login/", { email: cleanEmail, password });
      
      // Update our global Zustand state
      setAuth(res.data.user, res.data.access);
      
      toast.success("Welcome back to the collection!");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      toast.error(status === 401 ? "Invalid credentials" : "Service temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf8] py-12 px-4 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#4a2c2a]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4a2c2a] rounded-2xl shadow-xl mb-6 rotate-3">
            <Sparkles className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-4xl font-black text-[#4a2c2a] tracking-tight">
            Welcome <span className="italic font-serif text-amber-700">Back</span>
          </h2>
          <p className="mt-2 text-amber-900/60 font-medium">Step back into your world of indulgence.</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(74,44,42,0.15)] border border-amber-100/50 p-10 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-[#4a2c2a] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800/30 group-focus-within:text-[#4a2c2a] transition-colors" />
                <input
                  type="email"
                  placeholder="name@luxury.com"
                  className="w-full pl-12 pr-4 py-4 bg-[#fffcf8] border border-amber-100 rounded-2xl focus:outline-none focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-[#4a2c2a] ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800/30 group-focus-within:text-[#4a2c2a] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-[#fffcf8] border border-amber-100 rounded-2xl focus:outline-none focus:border-[#4a2c2a] transition-all text-[#4a2c2a] font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-800/30 hover:text-[#4a2c2a] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a2c2a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#36201f] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Login Section */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
              <span className="px-4 bg-white text-amber-800/40">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await api.post("/google/", { token: credentialResponse.credential });
                  setAuth(res.data.user, res.data.access);
                  toast.success("Welcome back!");
                  navigate("/");
                } catch (error) {
                  toast.error("Google authentication failed");
                }
              }}
              theme="outline"
              shape="pill"
            />
          </div>

          <div className="mt-10 pt-8 border-t border-amber-50 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center text-[#4a2c2a] font-black text-xs uppercase tracking-[0.2em] border-b-2 border-amber-200 hover:border-[#4a2c2a] transition-all pb-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(LoginPage);