import { useEffect, useState, memo } from "react";
import ProductCard from "../components_temp/Products/ProductCard";
import SearchBar from "../components_temp/SearchBar";

import { useProductsQuery } from "../features/products/api/useProductsQuery";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Shops = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");

  // TanStack Query for optimal fetching & caching
  const { data, isLoading: loading } = useProductsQuery({
    page: currentPage,
    search,
    category__name: categoryFilter !== "all" ? categoryFilter : undefined,
    premium: premiumFilter !== "all" ? (premiumFilter === "premium") : undefined,
    ordering: sortOrder === "low" ? "price" : sortOrder === "high" ? "-price" : undefined,
  });

  const products = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 12) : 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, premiumFilter, sortOrder]);

  return (
    <section className="min-h-screen bg-[#fffcf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Boutique Header */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center space-x-2 mb-4"
          >
            <div className="h-[1px] w-8 bg-amber-900/20" />
            <Sparkles size={16} className="text-amber-700" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-900/40">The Collection</span>
            <div className="h-[1px] w-8 bg-amber-900/20" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-[#4a2c2a] mb-6 tracking-tight">
            ChocoNut <span className="italic font-serif text-amber-800"> Shop</span>
          </h1>
          <p className="text-amber-900/60 text-lg max-w-xl mx-auto font-medium">
            Hand-selected single-origin chocolates and slow-roasted nuts, crafted for the discerning palate.
          </p>
        </header>

        {/* Integrated Search & Filter Control */}
        <div className="mb-12 space-y-8">
          <div className="max-w-2xl mx-auto relative z-20">
            <SearchBar searchQuery={search} setSearchQuery={setSearch} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Elegant Category Toggles */}
            <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-amber-900/5 shadow-sm flex space-x-1">
              {["all", "Chocolates", "Nuts"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat
                    ? "bg-[#4a2c2a] text-white shadow-md"
                    : "text-amber-900/40 hover:text-[#4a2c2a]"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-amber-900/5 shadow-sm flex">
              <button
                onClick={() => setPremiumFilter(prev => prev === "premium" ? "all" : "premium")}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${premiumFilter === "premium"
                  ? "bg-amber-600 text-white shadow-md"
                  : "text-amber-900/40 hover:text-amber-600"
                  }`}
              >
                <Sparkles size={12} />
                {premiumFilter === "premium" ? "Show All" : "Show Premium"}
              </button>
            </div>

            {/* Sort Dropdown Refined */}
            <div className="relative group">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-white/50 border border-amber-900/5 text-[#4a2c2a] text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4a2c2a]/10 cursor-pointer shadow-sm"
              >
                <option value="">Sort: Recommended</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4a2c2a]/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid with Smooth Staggering */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40"
            >
              <div className="w-10 h-10 border-4 border-amber-200 border-t-[#4a2c2a] rounded-full animate-spin" />
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" className="text-center py-32 bg-white/30 rounded-[40px] border border-dashed border-amber-200">
              <h3 className="text-xl font-black text-[#4a2c2a] uppercase tracking-widest mb-2">No Matches Found</h3>
              <p className="text-amber-900/40 text-sm">Refine your filters to explore other delicacies.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-20">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="group flex items-center space-x-2 text-[#4a2c2a] disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Previous</span>
            </button>

            <span className="text-xs font-serif italic text-amber-900/40">
              {currentPage} <span className="mx-2 font-sans opacity-30">/</span> {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="group flex items-center space-x-2 text-[#4a2c2a] disabled:opacity-20 transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Next</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(Shops);