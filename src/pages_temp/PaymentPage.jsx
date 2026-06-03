// src/pages/Payment.jsx
import { useState, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../shared/api/apiClient";
import loadRazorpay from "../shared/lib/loadRazorpay";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { useUserStore } from "../entities/user/model/useUserStore";

import { motion } from "framer-motion";

const Payment = () => {
  const { fetchCart, cart, currentUser } = useUserStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  // Fallback if user tries to access payment without choosing an address
  if (!state?.address_id && !state?.new_address) {
    navigate("/shipment");
    return null;
  }

  const subtotal = cart?.total_price || 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const totalDue = subtotal + shipping;

  const startPayment = async () => {
    setLoading(true);

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      toast.error("Security module failed to load");
      setLoading(false);
      return;
    }

    try {
      // 1. Create a Razorpay Order based on the current Cart
      const res = await api.post("/payments/create/");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "Choconut Premium",
        description: "Artisan Collection Purchase",
        order_id: res.data.razorpay_order_id,
        handler: async function (response) {
          try {
            // 2. Verify and finalize (This creates the Django Order record)
            const verifyRes = await api.post("/payments/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address_id: state?.address_id,
              new_address: state?.new_address,
            });

            // Cart is cleared on backend after successful payment
            // Fetch updated (empty) cart from backend
            await fetchCart();

            // Navigate immediately if order ID exists
            if (verifyRes.data?.order_id) {
              toast.success("Payment verified successfully!");
              navigate(`/confirmation/${verifyRes.data.order_id}`, { replace: true });
            } else {
              console.error("Verification response:", verifyRes.data);
              toast.error("Verification failed. Please contact support.");
            }
          } catch (err) {
            // Only show error if verification actually fails
            console.error("Payment verification error:", err);
            const errorMessage = err.response?.data?.detail || err.response?.data?.error || "Verification failed. Please contact support.";
            toast.error(errorMessage);
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment session terminated"),
        },
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#4a2c2a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Initiation error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-amber-900/10 mb-4 shadow-sm">
            <Lock className="w-6 h-6 text-[#4a2c2a]" />
          </div>
          <h1 className="text-sm font-black uppercase tracking-[0.3em] text-[#4a2c2a]">
            Secure Checkout
          </h1>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 p-8 md:p-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-amber-900/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 flex items-center gap-2">
                  <ShoppingBag size={12} /> Cart Subtotal
                </span>
                <span className="text-xs font-bold text-[#4a2c2a]">₹{subtotal}</span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-1">Total Due (incl. Shipping)</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-[#4a2c2a]">₹{totalDue}</span>
                  <span className="text-xs font-bold text-[#4a2c2a]/40">INR</span>
                </div>
              </div>
            </div>

            <div className="bg-[#fffcf8] rounded-2xl p-5 border border-amber-900/10">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-green-700 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-900">Encrypted Terminal</p>
                  <p className="text-[11px] font-medium text-amber-900/60 leading-relaxed mt-1">
                    Your transaction is processed through a 256-bit encrypted gateway.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={startPayment}
              disabled={loading || totalDue <= 0}
              className="group relative w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#3d2422] disabled:opacity-50 shadow-xl shadow-[#4a2c2a]/20"
            >
              <span className="flex items-center justify-center gap-3">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin"></span>
                ) : (
                  <>
                    Authorize Payment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center space-x-6 grayscale opacity-40">
          <span className="text-[9px] font-bold uppercase tracking-tighter text-[#4a2c2a]">Powered by Razorpay</span>
          <div className="h-4 w-px bg-amber-900/20"></div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-tighter text-[#4a2c2a]">PCI DSS Compliant</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(Payment);