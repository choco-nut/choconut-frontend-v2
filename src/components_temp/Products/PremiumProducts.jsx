import { useEffect, useState, memo } from "react";
import ProductCard from "./ProductCard"; // Assuming this is also styled with the theme
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../shared/api/apiClient";

const PremiumProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("products/premium/");
        const productsArray = res.data.results || res.data;

        // Filter for premium status
        const premiumProducts = productsArray.filter(
          (product) => product.premium === true
        );
        setProducts(premiumProducts);
      } catch (err) {
        toast.error("Failed to load our premium selection");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-[#fffcf8] py-24 relative overflow-hidden">
      {/* Subtle Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#f3eae0]/50 to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4a2c2a] rounded-2xl shadow-xl mb-6 rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <Crown className="w-7 h-7 text-amber-200" />
            </div>

            <span className="text-amber-800/60 font-black text-xs uppercase tracking-[0.3em] mb-3">
              The Choice
            </span>

            <h2 className="text-4xl md:text-6xl font-black text-[#4a2c2a] mb-6 tracking-tight">
              Premium <span className="italic font-serif text-amber-700">Collection</span>
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent mb-6" />

            <p className="text-lg text-amber-900/70 max-w-2xl mx-auto leading-relaxed font-medium">
              A curated symphony of the world’s finest single-origin chocolates
              and hand-roasted nuts, exclusively gathered for you.
            </p>
          </motion.div>
        </div>

        {/* State Handling: Loading */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-24"
            >
              <div className="relative">
                <div className="w-20 h-20 border-2 border-amber-100 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 border-t-2 border-[#4a2c2a] rounded-full animate-spin" />
              </div>
              <p className="mt-6 text-[#4a2c2a] font-bold tracking-widest uppercase text-xs">
                Unveiling Luxury...
              </p>
            </motion.div>
          ) : products.length === 0 ? (
            /* State Handling: Empty */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[40px] border border-amber-50 shadow-sm"
            >
              <div className="mb-6 flex justify-center text-amber-200">
                <Sparkles size={48} />
              </div>
              <h3 className="text-2xl font-black text-[#4a2c2a] mb-4">
                Exclusive Selection Replenishing
              </h3>
              <p className="text-amber-800/60 mb-8 max-w-sm mx-auto">
                Our master chocolatiers are currently crafting new premium delights.
              </p>
              <button
                className="inline-flex items-center space-x-2 bg-[#4a2c2a] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#36201f] transition-all shadow-lg hover:shadow-[#4a2c2a]/20"
                onClick={() => navigate("/shops")}
              >
                <span>Discover All Products</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            /* State Handling: Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Link */}
        {!loading && products.length > 0 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => navigate("/shops")}
              className="text-[#4a2c2a] font-bold border-b-2 border-amber-200 hover:border-[#4a2c2a] transition-all pb-1 group"
            >
              View Full Items <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(PremiumProducts);