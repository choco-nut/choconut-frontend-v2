import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  // We use a simplified variant to reduce CPU load during the initial paint
  const listContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Faster stagger for a snappier feel
        delayChildren: 0.1,
      },
    },
  };

  const listItem = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-1 bg-amber-200/20 mb-6 rounded-full" />
        <p className="text-[#4a2c2a]/40 font-bold uppercase tracking-[0.4em] text-xs">
          Collection Empty
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fffcf8]">
      <motion.div
        layout // This helps animate the grid when items are filtered
        variants={listContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              layout
              key={product.id}
              variants={listItem}
              // Helps with performance by telling the browser this is a separate layer
              className="will-change-transform"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default memo(ProductList);