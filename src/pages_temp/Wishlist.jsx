import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useUserStore } from "../entities/user/model/useUserStore";
import { Heart, ShoppingCart, Trash2, ArrowRight, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { currentUser, addToCart, toggleWishlist, wishlist } = useUserStore();
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);

  const startLoading = (id) => setLoadingIds((prev) => [...prev, id]);
  const stopLoading = (id) => setLoadingIds((prev) => prev.filter((i) => i !== id));

  const handleRemove = async (product) => {
    startLoading(product.id);
    try {
      await toggleWishlist(product);
    } catch (err) {
      toast.error("Failed to update collection.");
    } finally {
      stopLoading(product.id);
    }
  };

  const handleAddToCart = async (product) => {
    startLoading(product.id);
    try {
      await addToCart(product.id);
      await toggleWishlist(product);
    } catch (err) {
      toast.error("Failed to add to cart.");
    } finally {
      stopLoading(product.id);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-[#4a2c2a]/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 rotate-12">
            <Heart className="w-10 h-10 text-[#4a2c2a]/20" />
          </div>
          <h2 className="text-3xl font-black text-[#4a2c2a] mb-4 uppercase tracking-tighter">Empty Gallery</h2>
          <p className="text-amber-900/50 mb-10 font-medium">You haven't reserved any delicacies yet. Discover our signature blends.</p>
          <button
            onClick={() => navigate("/shops")}
            className="w-full bg-[#4a2c2a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#4a2c2a]/20 hover:bg-[#36201f] transition-all flex items-center justify-center space-x-3"
          >
            <Search className="w-4 h-4" />
            <span>Explore Shop</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-12 h-12 bg-[#4a2c2a] rounded-2xl shadow-lg mb-6"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-[#4a2c2a] tracking-tight uppercase">The Favorites List</h1>
          <p className="text-amber-900/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            {wishlist.length} {wishlist.length === 1 ? 'Delicacy' : 'Delicacies'} Curated
          </p>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[32px] overflow-hidden border border-amber-900/5 shadow-[0_8px_30px_rgb(74,44,42,0.04)] hover:shadow-[0_20px_40px_rgba(74,44,42,0.08)] transition-all flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-[#fffcf8]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleRemove(product)}
                      disabled={loadingIds.includes(product.id)}
                      className="bg-white/90 backdrop-blur-md hover:bg-red-50 text-red-400 p-3 rounded-2xl transition-all shadow-sm disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-sm font-black text-[#4a2c2a] uppercase tracking-tight mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-serif italic text-amber-700 mb-6">₹{product.price}</p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingIds.includes(product.id)}
                    className="mt-auto w-full bg-[#4a2c2a] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#36201f] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Selection</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <footer className="text-center mt-20">
          <button
            onClick={() => navigate("/shops")}
            className="inline-flex items-center space-x-3 text-[#4a2c2a]/60 hover:text-[#4a2c2a] font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-amber-900/10 px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-sm"
          >
            <Search className="w-4 h-4" />
            <span>Return to Boutique</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default memo(Wishlist);