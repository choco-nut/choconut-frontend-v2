import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { useState, memo } from "react";

import { requireLogin } from "../../shared/lib/userHelpers";
import { useUserStore } from "../../entities/user/model/useUserStore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const navigate = useNavigate();
  const {
    currentUser,
    cart,
    addToCart,
    removeFromCart,
    wishlist,
    toggleWishlist,
    notifyMeList,
    addToNotifyMe,
    removeFromNotifyMe,
  } = useUserStore();
  const [actionLoading, setActionLoading] = useState(false);

  const cartProductIds = new Set(cart?.items?.map((i) => i.product.id));
  const inCart = cartProductIds.has(product.id);
  const inWishlist = wishlist.some((item) => item.id === product.id);
  const isOutOfStock = product.stock === 0;
  const notifyMeAdded = notifyMeList.includes(product.id);

  const handleCart = async (e) => {
    e.stopPropagation();
    if (!requireLogin(currentUser, navigate)) return;
    if (isOutOfStock) return toast.error("Selection currently unavailable");

    // Optimistic Update: No loading state needed
    try {
      if (inCart) {
        removeFromCart(product.id);
      } else {
        addToCart(product);
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!requireLogin(currentUser, navigate)) return;

    // Optimistic Update: No loading state needed
    try {
      toggleWishlist(product);
    } catch {
      toast.error("An error occurred.");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-[#fffcf8] rounded-[32px] border border-amber-900/5 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(74,44,42,0.12)] cursor-pointer relative flex flex-col h-full"
    >
      {/* Image Container with Custom Mask */}
      <div className="relative w-full h-64 overflow-hidden isolate">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#4a2c2a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Premium Badge */}
        {product.premium && (
          <div className="absolute top-4 left-4 bg-[#4a2c2a] backdrop-blur-md border border-white/20 text-amber-200 px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
            <Sparkles size={12} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Premium
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#4a2c2a]/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[#fffcf8] font-black uppercase tracking-widest text-sm border-2 border-[#fffcf8] px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-amber-800/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              {product.category}
            </p>
            <h3 className="font-bold text-xl text-[#4a2c2a] leading-tight group-hover:text-amber-800 transition-colors">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-[#4a2c2a]">
            ₹{product.price}
          </span>

          <button
            onClick={handleWishlist}
            className={`p-3 rounded-2xl transition-all duration-300 ${inWishlist
              ? "bg-rose-50 text-rose-500"
              : "bg-amber-50 text-amber-800/40 hover:bg-amber-100"
              }`}
          >
            <Heart size={20} className={inWishlist ? "fill-current" : ""} />
          </button>
        </div>

        {/* Integrated Action Button */}
        {isOutOfStock ? (
          notifyMeAdded ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromNotifyMe(product.id);
              }}
              className="mt-4 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-rose-500 text-white hover:bg-rose-600 transition-all duration-300"
            >
              Cancel Notify Me
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToNotifyMe(product.id);
              }}
              className="mt-4 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#4a2c2a] text-[#fffcf8] hover:bg-[#36201f] transition-all duration-300"
            >
              Notify Me
            </button>
          )
        ) : (
          <button
            onClick={handleCart}
            className={`mt-4 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center space-x-2 shadow-sm ${inCart
              ? "bg-rose-500 text-white shadow-rose-200"
              : "bg-[#4a2c2a] text-[#fffcf8] hover:bg-[#36201f] shadow-black/10"
              }`}
          >
            <ShoppingCart size={16} />
            <span>{inCart ? "Remove" : "Add to Cart"}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
