// src/pages/ProductDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../entities/user/model/useUserStore";
import { useProductDetailsQuery } from "../features/products/api/useProductDetailsQuery";

import { toast } from "react-toastify";
import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Plus,
  Minus,
  Check,
  ShieldCheck,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, toggleWishlist, cart, wishlist } = useUserStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // TanStack Query Hook
  const { data, isLoading } = useProductDetailsQuery(id);

  const product = data?.product || null;
  const reviews = data?.reviews || [];
  const loading = isLoading;

  const cartProductIds = new Set(cart?.items?.map((i) => i.product.id) || []);
  const inCart = product ? cartProductIds.has(product.id) : false;
  const inWishlist = product ? wishlist?.some((item) => item.id === product.id) : false;
  const isOutOfStock = product?.stock === 0;

  const renderStars = (rating) => (
    <div className="flex space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-[#4a2c2a] fill-[#4a2c2a]" : "text-amber-900/20"}`}
        />
      ))}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf8]">
      <div className="w-12 h-12 border-4 border-[#4a2c2a]/10 border-t-[#4a2c2a] rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffcf8] px-4">
      <Package className="w-16 h-16 text-[#4a2c2a]/20 mb-6" />
      <h2 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter mb-6">Vintage Not Found</h2>
      <button onClick={() => navigate("/shops")} className="bg-[#4a2c2a] text-[#fffcf8] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Return to Collection</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8] pb-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Product Image Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-8 bg-white rounded-[40px] p-12 border border-amber-900/5 shadow-2xl shadow-[#4a2c2a]/5 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-contain transition-transform duration-700 group-hover:scale-105"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-[#4a2c2a]/80 backdrop-blur-sm rounded-[40px] flex items-center justify-center">
                  <span className="text-[#fffcf8] font-black uppercase tracking-[0.4em] text-xl">Vault Empty</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Narrative Section */}
          <div className="space-y-10">
            <header className="space-y-4">
              <div className="inline-block px-3 py-1 bg-amber-900/5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-900/60">
                {product.category_name}
              </div>
              <h1 className="text-5xl font-black text-[#4a2c2a] tracking-tighter leading-none uppercase">
                {product.name}
              </h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(Math.round(product.rating_avg))}</div>
                  <span className="text-xs font-bold text-[#4a2c2a]">{product.rating_avg}</span>
                </div>
                <span className="w-1 h-1 bg-amber-900/20 rounded-full"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-900/40">{product.rating_count} Reviews</span>
              </div>
            </header>

            <div className="flex items-baseline space-x-4">
              <span className="text-5xl font-black text-[#4a2c2a]">₹{product.price}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">VAT Included</span>
            </div>

            {/* Exclusive Offers */}
            <div className="bg-white rounded-[32px] p-8 border border-amber-900/5 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4a2c2a]/40 mb-2">Member Privileges</h3>
              {[
                "10% Premium Credit on SBI Elite Cards",
                "Complimentary Tasting on orders over ₹2000",
                "Priority Concierge Delivery"
              ].map((offer, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm font-bold text-[#4a2c2a]">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{offer}</span>
                </div>
              ))}
            </div>

            {/* Purchasing Mechanics */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-[#fffcf8] border border-amber-900/10 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4 text-[#4a2c2a]" />
                  </button>
                  <span className="w-12 text-center font-black text-[#4a2c2a]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#4a2c2a]" />
                  </button>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 5 ? 'text-red-600' : 'text-green-700'}`}>
                    {product.stock < 5 ? `Critical Stock: ${product.stock}` : 'In Reserve'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  disabled={isOutOfStock}
                  onClick={() => inCart ? removeFromCart(product.id) : addToCart(product)}
                  className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center space-x-3 shadow-xl ${inCart ? "bg-red-50 text-red-600 border border-red-100" : "bg-[#4a2c2a] text-[#fffcf8] hover:bg-[#3d2422] shadow-[#4a2c2a]/20"
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{inCart ? "Relinquish" : "Acquire Now"}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-5 rounded-2xl border transition-all ${inWishlist ? 'bg-pink-50 border-pink-100 text-pink-500' : 'border-amber-900/10 text-[#4a2c2a] hover:bg-amber-900/5'}`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Micro-Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-amber-900/5">
                <Truck className="w-5 h-5 text-amber-900/40" />
                <p className="text-[10px] font-bold text-[#4a2c2a] uppercase tracking-wider">Fast-Track Shipping</p>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-amber-900/5">
                <ShieldCheck className="w-5 h-5 text-amber-900/40" />
                <p className="text-[10px] font-bold text-[#4a2c2a] uppercase tracking-wider">Quality Certified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Tabs */}
        <div className="mt-32">
          <div className="flex space-x-12 border-b border-amber-900/10 mb-12 overflow-x-auto">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? "text-[#4a2c2a]" : "text-amber-900/30 hover:text-[#4a2c2a]/60"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#4a2c2a]" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-xl text-amber-900/70 leading-relaxed font-serif italic">"{product.description}"</p>
                </motion.div>
              )}

              {activeTab === "specifications" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {[
                    { label: "Origin", value: "Artisan Batch" },
                    { label: "Maturity", value: "24 Months" },
                    { label: "Category", value: product.category },
                    { label: "Premium Status", value: product.premium ? "Certified" : "Standard" }
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between py-4 border-b border-amber-900/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-900/40">{spec.label}</span>
                      <span className="font-bold text-[#4a2c2a]">{spec.value}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  {reviews.length > 0 ? (
                    <div className="space-y-12">
                      {reviews.map((review) => (
                        <div key={review.id} className="group">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-[#4a2c2a] text-[#fffcf8] rounded-full flex items-center justify-center font-black text-xs uppercase">
                                {review.userName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-[#4a2c2a] uppercase text-[10px] tracking-widest">{review.userName}</p>
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-900/30 uppercase tracking-widest">{review.date}</span>
                          </div>
                          <h4 className="text-lg font-black text-[#4a2c2a] mb-2 uppercase">{review.title}</h4>
                          <p className="text-amber-900/70 leading-relaxed text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-amber-900/20">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-900/40">No testimonies yet</p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/product/${id}/review`, { state: { product } })}
                    className="w-full py-6 border-2 border-[#4a2c2a] text-[#4a2c2a] rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all"
                  >
                    Post a Testimony
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}