import { useState, memo } from "react";

import api from "../shared/api/apiClient";
import { useUserStore } from "../entities/user/model/useUserStore";
import { useNavigate } from "react-router-dom";
import { CartSkeleton } from "../shared/ui/skeltons/CartSkelton";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Package,
  Truck,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { updateCartQty, removeFromCart, cart, loadingAuth, currentUser } = useUserStore();
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);

  const startLoading = (id) => setLoadingIds((prev) => [...prev, id]);
  const stopLoading = (id) => setLoadingIds((prev) => prev.filter((i) => i !== id));

  const increaseQty = async (item) => {
    if (item.quantity >= item.product.stock) {
      return toast.error(`Only ${item.product.stock} items in stock!`);
    }
    startLoading(item.product.id);
    try {
      await updateCartQty(item.product.id, item.quantity + 1);
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      stopLoading(item.product.id);
    }
  };

  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return removeCartItem(item.product.id);
    startLoading(item.product.id);
    try {
      await updateCartQty(item.product.id, item.quantity - 1);
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      stopLoading(item.product.id);
    }
  };

  const removeCartItem = async (id) => {
    startLoading(id);
    try {
      await removeFromCart(id);
      toast.info("Collection updated");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      stopLoading(id);
    }
  };

  const handleCheckout = async () => {
    navigate("/shipment");
  };

  const subtotal = cart?.total_price || 0;
  const totalItems = cart?.total_items || 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (loadingAuth) return <CartSkeleton />;

  if (!currentUser || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-[#4a2c2a]/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 rotate-12">
            <ShoppingBag className="w-10 h-10 text-[#4a2c2a]/20" />
          </div>
          <h2 className="text-3xl font-black text-[#4a2c2a] mb-4 uppercase tracking-tighter">Your cart is empty</h2>
          <p className="text-amber-900/50 mb-10 font-medium">Add some artisan treats to your collection to begin.</p>
          <button
            onClick={() => navigate("/shops")}
            className="w-full bg-[#4a2c2a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#4a2c2a]/20 hover:bg-[#36201f] transition-all flex items-center justify-center space-x-3"
          >
            <span>Browse Shops</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-[#4a2c2a] tracking-tight uppercase">My Selection</h1>
          <p className="text-amber-900/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            {totalItems} {totalItems === 1 ? "Delicacy" : "Delicacies"} Reserved
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart?.items.map((item) => (
                <motion.div
                  layout
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white rounded-[32px] p-5 flex flex-col sm:flex-row items-center gap-6 border border-amber-900/5 shadow-[0_8px_30px_rgb(74,44,42,0.04)] hover:shadow-[0_20px_40px_rgba(74,44,42,0.08)] transition-all"
                >
                  <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden rounded-2xl bg-[#fffcf8]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-black text-[#4a2c2a] uppercase tracking-tight">{item.product.name}</h3>
                    <p className="text-amber-700 font-serif italic text-lg mt-1">₹{item.product.price}</p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start space-x-4">
                      <div className="flex items-center bg-[#fffcf8] border border-amber-900/10 rounded-full p-1 shadow-inner">
                        <button
                          onClick={() => decreaseQty(item)}
                          disabled={loadingIds.includes(item.product.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a2c2a] hover:bg-white transition-all disabled:opacity-20"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-[#4a2c2a]">{item.quantity}</span>
                        <button
                          onClick={() => increaseQty(item)}
                          disabled={loadingIds.includes(item.product.id) || item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a2c2a] hover:bg-white transition-all disabled:opacity-20"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 pr-2">
                    <p className="text-xl font-black text-[#4a2c2a]">₹{item.total_price}</p>
                    <button
                      onClick={() => removeCartItem(item.product.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-[#4a2c2a] rounded-[40px] p-8 text-[#fffcf8] shadow-2xl shadow-[#4a2c2a]/30">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-8 flex items-center gap-2">
                <Sparkles size={14} /> Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium">
                  <span className="opacity-70">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="opacity-70">cart Shipping</span>
                  <span className={shipping === 0 ? "text-amber-300" : ""}>
                    {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-300/80 pt-2 border-t border-white/10 text-center">
                    Add ₹{500 - subtotal} for complimentary delivery
                  </p>
                )}

                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">Total Amount</span>
                  <span className="text-3xl font-black tracking-tighter">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#fffcf8] text-[#4a2c2a] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-50 transition-all flex items-center justify-center space-x-3 shadow-lg"
              >
                <span>Checkout Now</span>
                <Truck className="w-4 h-4" />
              </button>
            </div>

            {/* Quality Note */}
            <div className="mt-6 px-4 py-6 bg-white rounded-[24px] border border-amber-900/5 flex items-start gap-4">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-800">
                <Package size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#4a2c2a]">choconut Packaging</h4>
                <p className="text-[10px] text-amber-900/40 font-medium leading-relaxed mt-1">
                  Every order is climate-controlled and packed in sustainable signature boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Cart);