// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { useUserStore } from "../entities/user/model/useUserStore";

import api from "../shared/api/apiClient";
import { CartSkeleton } from "../shared/ui/skeltons/CartSkelton";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  ReceiptText
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
  const { currentUser, loadingAuth } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);

  useEffect(() => {
    if (currentUser) fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      await api.post(`/orders/${orderId}/cancel/`);
      toast.success("Transaction Voided");
      await fetchOrders();
    } catch (err) {
      toast.error("Process interrupted");
    } finally {
      setCancellingOrder(null);
    }
  };

  /* ================= STYLE HELPERS ================= */

  const getStatusConfig = (status) => {
    const configs = {
      DELIVERED: { icon: CheckCircle, class: "bg-green-50 text-green-700 border-green-100" },
      SHIPPED: { icon: Truck, class: "bg-blue-50 text-blue-700 border-blue-100" },
      PROCESSING: { icon: RefreshCw, class: "bg-amber-50 text-amber-700 border-amber-100" },
      CANCELLED: { icon: XCircle, class: "bg-red-50 text-red-700 border-red-100" },
      DEFAULT: { icon: Clock, class: "bg-gray-50 text-gray-700 border-gray-100" },
    };
    return configs[status] || configs.DEFAULT;
  };

  /* ================= UI STATES ================= */

  if (loadingAuth) return <CartSkeleton />;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-white border border-[#4a2c2a]/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Package className="w-8 h-8 text-[#4a2c2a]" />
          </div>
          <h2 className="text-xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-4">Identity Required</h2>
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-900/40 mb-8 leading-relaxed">
            Please authenticate to view your personal purchase ledger.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#4a2c2a] text-[#fffcf8] px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center mx-auto space-x-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shops</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
      <RefreshCw className="w-8 h-8 text-[#4a2c2a] animate-spin opacity-20" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#4a2c2a]/10 mb-6">
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#4a2c2a] tracking-tighter mb-4">Your Orders</h1>
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-900/40 italic">
          Managing {orders.length} unique chocolate experiences
        </p>
      </div>

      {!orders.length ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-12 h-12 text-[#4a2c2a]/10 mx-auto mb-6" />
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-900/30">No transaction history found</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-10">
          {orders.map((order) => {
            const status = getStatusConfig(order.order_status);
            const StatusIcon = status.icon;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-8 md:px-12 border-b border-amber-900/5 flex flex-wrap justify-between items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-900/30">Reference Number</p>
                    <p className="font-bold text-[#4a2c2a]">#{order.id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.class}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{order.order_status}</span>
                    </div>

                    {order.order_status !== "DELIVERED" && order.order_status !== "CANCELLED" && (
                      <button
                        onClick={() => setConfirmCancelOrderId(order.id)}
                        disabled={cancellingOrder === order.id}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#fffcf8] flex items-center justify-center border border-amber-900/5">
                        <Calendar className="w-4 h-4 text-[#4a2c2a]" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-900/30">Placement Date</p>
                        <p className="text-xs font-bold text-[#4a2c2a]">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#fffcf8] flex items-center justify-center border border-amber-900/5">
                        <ReceiptText className="w-4 h-4 text-[#4a2c2a]" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-900/30">Grand Total</p>
                        <p className="text-lg font-black text-[#4a2c2a]">₹{order.total_amount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-900/30 mb-4">Manifest</p>
                    {order.items.map((item) => (
                      <div key={item.id} className="group flex justify-between items-center bg-[#fffcf8] p-5 rounded-2xl border border-amber-900/5 transition-all hover:border-[#4a2c2a]/20">
                        <div className="flex items-center gap-4">
                          <div className="text-[10px] font-black text-[#4a2c2a] w-6 h-6 rounded-full bg-white flex items-center justify-center border border-amber-900/10">
                            {item.quantity}
                          </div>
                          <span className="text-xs font-bold text-[#4a2c2a]">{item.product_name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#4a2c2a]/50">₹{Number(item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Luxury Confirmation Modal */}
      <AnimatePresence>
        {confirmCancelOrderId && (
          <div className="fixed inset-0 bg-[#4a2c2a]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[40px] shadow-2xl max-w-sm w-full p-10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-3">Cancel Transaction?</h3>
              <p className="text-[11px] font-bold text-amber-900/50 uppercase tracking-widest leading-relaxed mb-8">
                Are you certain you wish to remove this selection from your history?
              </p>

              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await handleCancelOrder(confirmCancelOrderId);
                    setConfirmCancelOrderId(null);
                  }}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px]"
                >
                  Done
                </button>
                <button
                  onClick={() => setConfirmCancelOrderId(null)}
                  className="w-full bg-[#fffcf8] text-[#4a2c2a] py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] border border-amber-900/10"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}