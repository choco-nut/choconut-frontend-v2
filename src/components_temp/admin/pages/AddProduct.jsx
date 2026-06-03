// src/pages/admin/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";

import {
  ArrowLeft,
  Package,
  DollarSign,
  Tag,
  Box,
  FileText,
  Check,
  Image as ImageIcon,
  Star,
  Sparkles,
  Zap
} from "lucide-react";
import { toast } from "react-toastify";

function AddProduct() {
  const { addProduct } = useAdminStore();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    premium: false,
    stock: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "image") {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure numeric values are correctly typed
      const submissionData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      
      await addProduct(submissionData);
      toast.success("New masterpiece added to the collection!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to curate new product");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Chocolates", "Nuts", "Truffles", "Limited Edition"];

  return (
    <div className="min-h-screen bg-[#fffcf8] py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/admin/products")}
              className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all text-[#4a2c2a] border border-amber-900/5 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-[#4a2c2a] tracking-tight italic">
                Add New Creation
              </h1>
              <p className="text-amber-900/40 text-[11px] font-bold uppercase tracking-[0.4em] mt-1">
                Curating excellence for the choconut
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#4a2c2a] via-amber-700 to-[#4a2c2a]"></div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-10">
                {/* Product Name */}
                <div className="relative">
                  <label className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-widest mb-2 block opacity-60">
                    Product Name
                  </label>
                  <div className="flex items-center border-b-2 border-amber-900/10 focus-within:border-[#4a2c2a] transition-colors pb-2">
                    <Package className="text-amber-700 mr-4" size={20} />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Himalayan Salted Dark Truffle"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent text-xl font-medium text-[#4a2c2a] outline-none placeholder:text-amber-900/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <label className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-widest mb-2 block opacity-60">
                      Market Valuation (₹)
                    </label>
                    <div className="flex items-center border-b-2 border-amber-900/10 focus-within:border-[#4a2c2a] transition-colors pb-2">
                      <DollarSign className="text-amber-700 mr-4" size={20} />
                      <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-transparent text-lg font-medium text-[#4a2c2a] outline-none"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-widest mb-2 block opacity-60">
                      Reserve Inventory
                    </label>
                    <div className="flex items-center border-b-2 border-amber-900/10 focus-within:border-[#4a2c2a] transition-colors pb-2">
                      <Box className="text-amber-700 mr-4" size={20} />
                      <input
                        type="number"
                        name="stock"
                        placeholder="Quantity"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full bg-transparent text-lg font-medium text-[#4a2c2a] outline-none"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Premium Toggle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-widest block opacity-60">
                      Collection
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#fffcf8] px-5 py-4 rounded-2xl border border-amber-900/10 text-[#4a2c2a] font-bold outline-none focus:ring-2 focus:ring-[#4a2c2a]/5 appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-[#fffcf8] p-5 rounded-2xl border border-amber-900/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#4a2c2a] rounded-lg text-amber-200">
                        <Star size={16} fill="currentColor" />
                      </div>
                      <span className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-wider">Premium Selection</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="premium"
                        checked={formData.premium}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-amber-900/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4a2c2a]"></div>
                    </label>
                  </div>
                </div>

                {/* Image URL */}
                <div className="relative">
                  <label className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-widest mb-2 block opacity-60">
                    Visual Asset Link
                  </label>
                  <div className="flex items-center border-b-2 border-amber-900/10 focus-within:border-[#4a2c2a] transition-colors pb-2">
                    <ImageIcon className="text-amber-700 mr-4" size={20} />
                    <input
                      type="url"
                      name="image"
                      placeholder="https://images.boutique.com/product.jpg"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full bg-transparent text-lg font-medium text-[#4a2c2a] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-widest block opacity-60">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the tasting notes, origin, and craftsmanship..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#fffcf8] p-6 rounded-[24px] border border-amber-900/10 text-[#4a2c2a] outline-none focus:ring-2 focus:ring-[#4a2c2a]/5 resize-none italic"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4a2c2a] text-[#fffcf8] py-6 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-amber-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <Zap className="animate-pulse" size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {loading ? "Authenticating Creation..." : "Finalize Product"}
                </button>
              </form>
            </div>
          </div>

          {/* Preview & Curation Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-amber-900/5 border border-amber-900/5">
              <h3 className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-[0.2em] mb-6">Visual Preview</h3>
              <div className="aspect-square bg-[#fffcf8] rounded-[32px] overflow-hidden border border-amber-900/5 flex items-center justify-center relative group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://placehold.co/600x600/4a2c2a/fffcf8?text=Waiting+for+Visual"; }}
                  />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-amber-900/10" strokeWidth={1} />
                    <p className="text-[9px] font-bold uppercase text-amber-900/30 tracking-widest leading-relaxed">
                      Your product visual will appear here
                    </p>
                  </div>
                )}
                {formData.premium && (
                    <div className="absolute top-5 left-5 bg-[#4a2c2a] text-amber-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                        Premium
                    </div>
                )}
              </div>
            </div>

            {/* Curation Guide */}
            <div className="bg-[#4a2c2a] p-8 rounded-[40px] text-[#fffcf8] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-amber-200/40 flex items-center gap-2">
                <Check size={14} /> Creating Guide
              </h3>
              <ul className="space-y-4">
                {[
                  "High-resolution lifestyle photography",
                  "Evocative and sensory nomenclature",
                  "Accurate stock for exclusivity",
                  "Detailed aromatic descriptions"
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-[11px] leading-relaxed font-medium text-amber-50/70">
                    <span className="text-amber-200/30 font-black italic">0{i+1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">
                 Standard v2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;