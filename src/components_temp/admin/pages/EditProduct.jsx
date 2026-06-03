// src/pages/admin/EditProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";

import { 
  ArrowLeft, 
  Check, 
  Package, 
  DollarSign, 
  Tag, 
  Box, 
  FileText,
  Image as ImageIcon,
  Star,
  Eye,
  RefreshCw,
  Layers
} from "lucide-react";
import { toast } from "react-toastify";

function EditProduct() {
  const { updateProduct, getProductById } = useAdminStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    premium: false,
    stock: "",
    description: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getProductById(id);
        const data = {
          name: product.name || "",
          price: product.price || "",
          image: product.image || "",
          category: product.category_name || "",
          premium: product.premium || false,
          stock: product.stock || "",
          description: product.description || "",
        };
        setFormData(data);
        setInitialData(data);
        setImagePreview(product.image || "");
      } catch (err) {
        toast.error("Failed to load artisanal product data");
      }
    };
    loadProduct();
  }, [id, getProductById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "image") setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      toast.success("Product collection updated.");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Error refining product details");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Chocolates", "Nuts", "Truffles", "Gift Sets"];

  return (
    <div className="min-h-screen bg-[#fffcf8] py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-[#4a2c2a] border border-amber-900/5"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#4a2c2a] tracking-tight uppercase italic">Edit Product</h1>
              <p className="text-amber-900/40 text-[10px] font-bold uppercase tracking-[0.3em]">Refining your product inventory</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {formData.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 overflow-hidden">
              <div className="bg-[#4a2c2a] p-4 text-center">
                <span className="text-[10px] font-bold text-amber-200/50 uppercase tracking-[0.4em]">Product Details</span>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} className="text-amber-700" /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#fffcf8] px-5 py-4 border-b-2 border-transparent focus:border-amber-700 outline-none transition-all text-[#4a2c2a] font-medium rounded-2xl"
                    placeholder="e.g., Venezuelan Dark 70%"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={14} className="text-amber-700" /> Valuation (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-[#fffcf8] px-5 py-4 border-b-2 border-transparent focus:border-amber-700 outline-none transition-all text-[#4a2c2a] font-medium rounded-2xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                      <Box size={14} className="text-amber-700" /> Inventory Count
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full bg-[#fffcf8] px-5 py-4 border-b-2 border-transparent focus:border-amber-700 outline-none transition-all text-[#4a2c2a] font-medium rounded-2xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                      <Layers size={14} className="text-amber-700" /> Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#fffcf8] px-5 py-4 border-b-2 border-transparent focus:border-amber-700 outline-none transition-all text-[#4a2c2a] font-medium rounded-2xl appearance-none"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                      <Star size={14} className="text-amber-700" /> Premium Status
                    </label>
                    <div className="flex items-center h-full">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="premium" checked={formData.premium} onChange={handleChange} className="sr-only peer" />
                            <div className="w-14 h-7 bg-amber-900/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a2c2a]"></div>
                            <span className="ml-3 text-[10px] font-black uppercase text-amber-900/40 tracking-widest">Mark as Artisanal</span>
                        </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-amber-700" /> Visual Identity (URL)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-[#fffcf8] px-5 py-4 border-b-2 border-transparent focus:border-amber-700 outline-none transition-all text-[#4a2c2a] font-medium rounded-2xl"
                    placeholder="https://images.luxury.com/product.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-amber-700" /> Tasting Notes / Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#fffcf8] px-5 py-4 border-b-2 border-transparent focus:border-amber-700 outline-none transition-all text-[#4a2c2a] font-medium rounded-2xl resize-none"
                    placeholder="Describe the aromatic profile..."
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-[20px] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-amber-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <RefreshCw className="animate-spin" size={16} /> : <Check size={18} />}
                    {submitting ? "Preserving..." : "Commit Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="flex-1 bg-white border border-amber-900/10 text-amber-900/40 py-5 rounded-[20px] font-black uppercase text-xs tracking-[0.2em] hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar: Visual & Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Visual Preview */}
            <div className="bg-white p-6 rounded-[32px] border border-amber-900/5 shadow-xl shadow-[#4a2c2a]/5">
              <h3 className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-[0.2em] mb-4">Visual Preview</h3>
              <div className="aspect-square bg-[#fffcf8] rounded-[24px] overflow-hidden border border-amber-900/5 group relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://placehold.co/600x600/4a2c2a/fffcf8?text=Image+Not+Found"; }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-900/10">
                    <ImageIcon size={48} strokeWidth={1} />
                    <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">Waiting for assets</p>
                  </div>
                )}
                {formData.premium && (
                  <div className="absolute top-4 right-4 bg-[#4a2c2a] text-amber-200 p-2 rounded-full shadow-lg">
                    <Star size={14} fill="currentColor" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-[#4a2c2a] p-8 rounded-[32px] text-[#fffcf8] relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-amber-200/50">Summary</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                        <span className="text-[9px] font-bold uppercase text-white/40 tracking-tighter">Valuation</span>
                        <span className="font-black text-lg">₹{Number(formData.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/10 pb-2">
                        <span className="text-[9px] font-bold uppercase text-white/40 tracking-tighter">Availability</span>
                        <span className="font-black text-lg">{formData.stock} Units</span>
                    </div>
                </div>
                
                <div className="mt-8 space-y-3">
                    <button onClick={() => window.open(`/product/${id}`, '_blank')} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                        <span className="text-[10px] font-black uppercase tracking-widest">Preview Store</span>
                        <Eye size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={() => {
                            if(confirm("Revert all refinements to the original state?")) {
                                setFormData(initialData);
                                setImagePreview(initialData.image);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all group"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest">Reset Change</span>
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;