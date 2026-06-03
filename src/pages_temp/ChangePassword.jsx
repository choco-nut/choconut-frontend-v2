// src/pages/ChangePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, KeySquare } from "lucide-react";
import { motion } from "framer-motion";
import api from "../shared/api/apiClient";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/profile/change-password/", {
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });

      toast.success("Security credentials updated");
      navigate("/profile");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {})[0] ||
        "Update failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 text-[#4a2c2a]/40 hover:text-[#4a2c2a] transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profile Overview</span>
        </motion.button>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#fffcf8] border border-amber-900/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
              <KeySquare className="w-7 h-7 text-[#4a2c2a]" />
            </div>
            <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-2">
              Security Update
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900/40">
              Modify your account access keys
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { id: "old", label: "Current Password", name: "oldPassword" },
              { id: "new", label: "New Selection", name: "newPassword" },
              { id: "confirm", label: "Confirm Selection", name: "confirmPassword" }
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 ml-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={visibility[field.id] ? "text" : "password"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder="••••••••••••"
                    className="w-full px-5 py-4 bg-[#fffcf8] border border-amber-900/10 rounded-2xl focus:ring-2 focus:ring-[#4a2c2a]/5 focus:border-[#4a2c2a] outline-none transition-all text-[#4a2c2a] placeholder:text-amber-900/10 text-sm font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a2c2a]/30 hover:text-[#4a2c2a] transition-colors"
                  >
                    {visibility[field.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#3d2422] shadow-xl shadow-[#4a2c2a]/20 flex items-center justify-center gap-3 disabled:opacity-30 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin" />
              ) : (
                "Commit Changes"
              )}
            </button>
          </form>
        </motion.div>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center gap-4 opacity-20">
          <div className="h-px w-8 bg-[#4a2c2a]"></div>
          <ShieldCheck className="w-4 h-4 text-[#4a2c2a]" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4a2c2a]">Protected Session</span>
          <div className="h-px w-8 bg-[#4a2c2a]"></div>
        </div>
      </div>
    </div>
  );
}