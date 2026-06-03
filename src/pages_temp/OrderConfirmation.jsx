// src/pages/OrderConfirmation.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../shared/api/apiClient";
import { useUserStore } from "../entities/user/model/useUserStore";

import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ShoppingBag,
  Gift,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const getEstimatedDelivery = (createdAt) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { currentUser } = useUserStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}/`);
      setOrder(res.data);
    } catch (err) {
      console.error("Order retrieval error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#4a2c2a]/10 border-t-[#4a2c2a] rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center text-[#4a2c2a] font-bold uppercase tracking-widest text-xs">
      Manifest Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8] py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Success Branding */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 bg-white border border-amber-900/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#4a2c2a]/5"
          >
            <CheckCircle2 className="w-10 h-10 text-[#4a2c2a]" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-[#4a2c2a] tracking-tighter mb-4">
            Order Confirmed
          </h1>

          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900/40 max-w-sm mx-auto leading-relaxed">
            Gratitude, <span className="text-[#4a2c2a]">{currentUser?.name || 'Patron'}</span>. Your selection has been meticulously recorded.
          </p>
        </div>

        {/* The Receipt Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 overflow-hidden mb-10">
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Manifest Details */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a2c2a] flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" />
                  Transaction Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-amber-900/5 pb-2">
                    <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">Ref. Code</span>
                    <span className="text-[11px] font-black text-[#4a2c2a]">#{order.id}</span>
                  </div>

                  <div className="flex justify-between border-b border-amber-900/5 pb-2">
                    <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">Total Value</span>
                    <span className="text-lg font-black text-[#4a2c2a]">₹{order.total_amount}</span>
                  </div>
                </div>
              </div>

              {/* Logistic Details */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4a2c2a] flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5" />
                  Logistics
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between border-b border-amber-900/5 pb-2">
                    <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">Current Status</span>
                    <span className="text-[9px] font-black bg-[#4a2c2a] text-[#fffcf8] px-2 py-1 rounded-md uppercase">
                      {order.order_status}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-amber-900/5 pb-2">
                    <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">Arrival Date</span>
                    <span className="text-[11px] font-black text-[#4a2c2a]">{getEstimatedDelivery(order.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Badge */}
            <div className="mt-12 pt-8 border-t border-dashed border-amber-900/10 flex items-center justify-center gap-3">
              <Gift className="w-4 h-4 text-[#4a2c2a]/30" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-900/30 italic">
                Secured Payment Finalized
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="group bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex justify-center items-center gap-3 shadow-xl shadow-[#4a2c2a]/20 transition-all hover:bg-[#3d2422]"
          >
            <Package className="w-4 h-4" />
            Track Ledger
          </Link>

          <Link
            to="/shops"
            className="group bg-white border border-[#4a2c2a]/10 text-[#4a2c2a] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex justify-center items-center gap-3 transition-all hover:bg-[#fffcf8]"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse More
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-amber-900/40 hover:text-[#4a2c2a] transition-colors">
            <Home className="w-3 h-3" /> Return to Atelier
          </Link>
        </div>
      </motion.div>
    </div>
  );
}