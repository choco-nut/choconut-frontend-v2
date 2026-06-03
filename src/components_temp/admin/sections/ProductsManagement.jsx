// src/components/admin/sections/ProductsManagement.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Package, Star, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";
import DataTable from "../DataTable";

import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductsManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { products, deleteProduct, fetchProducts, productPagination, productStats } = useAdminStore();

  useEffect(() => {
    let stock = "";
    let premium = "";
    if (selectedCategory === "out") stock = "out";
    if (selectedCategory === "low") stock = "low";
    if (selectedCategory === "premium") premium = "true";
    if (selectedCategory === "standard") premium = "false";

    fetchProducts({
      page: 1,
      search: searchTerm,
      category: ["Nuts", "Chocolates"].includes(selectedCategory) ? selectedCategory : "all",
      stock,
      premium,
    });
  }, [searchTerm, selectedCategory]);

  const getStatusStyles = (stock) => {
    if (stock === 0) return "bg-red-50 text-red-700 border-red-100";
    if (stock < 10) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  const confirmToast = (message, onConfirm) => {
    toast(({ closeToast }) => (
      <div className="p-2">
        <p className="font-bold text-[#4a2c2a] mb-4 text-sm uppercase tracking-tight">{message}</p>
        <div className="flex space-x-3">
          <button onClick={() => { onConfirm(); closeToast(); }} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Delete</button>
          <button onClick={closeToast} className="flex-1 py-2 bg-[#fffcf8] text-[#4a2c2a] border border-amber-900/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
        </div>
      </div>
    ), { autoClose: false, closeOnClick: false, position: "top-center" });
  };

  // COLUMN WIDTH CONFIGURATION
  // These widths must sum to 100% or work within the table-fixed layout
  const tableHeaders = [
    { label: "Curation Item", className: "w-[20%]" },
    { label: "Collection", className: "w-[15%]" },
    { label: "Unit Price", className: "w-[12%]" },
    { label: "Quantity", className: "w-[13%]" },
    { label: "Availability", className: "w-[15%]" },
    { label: "Brand", className: "w-[10%]" },
    { label: "Actions", className: "w-[10%] text-right" }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter leading-none">Inventory</h1>
          <p className="text-amber-900/40 text-[11px] font-bold uppercase tracking-[0.4em] mt-2">Manage the Products</p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center space-x-3 bg-[#4a2c2a] text-[#fffcf8] px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-black/10 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add New Item</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total items", val: productStats.total, icon: Package, color: "text-[#4a2c2a]" },
          { label: "Low Stock", val: productStats.low_stock, icon: AlertCircle, color: "text-amber-600" },
          { label: "Out Of Stock", val: productStats.out_of_stock, icon: Trash2, color: "text-red-500" },
          { label: "Collections", val: productStats.categories, icon: Star, color: "text-amber-900/40" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-amber-900/5 shadow-xl shadow-[#4a2c2a]/5">
            <div className="flex justify-between items-start mb-4">
               <stat.icon size={16} className={stat.color} />
               <span className="text-[9px] font-black text-amber-900/20 uppercase tracking-[0.2em]">Live Data</span>
            </div>
            <p className="text-2xl font-black text-[#4a2c2a]">{stat.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-[24px] p-4 border border-amber-900/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-900/20 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search our curation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#fffcf8] border-none rounded-xl text-sm font-bold text-[#4a2c2a] placeholder:text-amber-900/20 focus:ring-2 focus:ring-[#4a2c2a]/5"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-6 py-3 bg-[#fffcf8] border-none rounded-xl text-[11px] font-black uppercase tracking-widest text-[#4a2c2a]"
        >
          <option value="all">Filter: All Collections</option>
          <option value="Nuts">Nuts</option>
          <option value="Chocolates">Chocolates</option>
          <option value="low">Low Stock Alert</option>
          <option value="premium">Premium Only</option>
        </select>
      </div>

      {/* Catalog Table */}
      <DataTable
        headers={tableHeaders}
        data={products}
        renderRow={(product) => (
          <>
            {/* Curation Item - 30% */}
            <td className="py-6 px-8 w-[30%]">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex-shrink-0 bg-[#fffcf8] rounded-xl overflow-hidden border border-amber-900/5 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-black text-[#4a2c2a] truncate">{product.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-amber-900/30">REF: {product.id}</p>
                </div>
              </div>
            </td>

            {/* Collection - 15% */}
            <td className="py-6 px-8 w-[15%] text-[10px] font-bold text-[#4a2c2a]/60 uppercase tracking-widest">
              {product.category_name}
            </td>

            {/* Unit Price - 12% */}
            <td className="py-6 px-8 w-[12%] font-black text-[#4a2c2a]">
              ${Number(product.price).toFixed(2)}
            </td>

            {/* Quantity - 13% */}
            <td className="py-6 px-8 w-[13%]">
              <p className={`text-sm font-black ${product.stock < 10 ? "text-amber-600" : "text-[#4a2c2a]"}`}>{product.stock}</p>
              <p className="text-[8px] uppercase tracking-tighter text-amber-900/20">Units In Store</p>
            </td>

            {/* Availability - 15% */}
            <td className="py-6 px-8 w-[15%]">
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(product.stock)}`}>
                {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'Active'}
              </span>
            </td>

            {/* Tier - 5% */}
            <td className="py-6 px-8 w-[5%]">
               {product.premium ? <Star size={14} className="text-amber-500 fill-amber-500" /> && <span>Premium</span> : <span className="text-[9px] font-black text-amber-900/10 uppercase">Standard</span>}
            </td>

            {/* Actions - 10% */}
            <td className="py-6 px-8 w-[10%] text-right">
              <div className="flex items-center justify-end space-x-2">
                <Link to={`/admin/products/${product.id}/edit`} className="p-2 text-amber-900/20 hover:text-[#4a2c2a] hover:bg-white rounded-xl transition-all">
                  <Edit size={16} />
                </Link>
                <button 
                  onClick={() => confirmToast("Delete this curation item?", () => deleteProduct(product.id))} 
                  className="p-2 text-amber-900/20 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4">
        <button 
          disabled={!productPagination.previous}
          onClick={() => fetchProducts({ page: productPagination.page - 1, search: searchTerm, category: selectedCategory })}
          className="p-3 bg-white border border-amber-900/5 rounded-2xl disabled:opacity-30 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="bg-[#4a2c2a] px-6 py-2 rounded-2xl shadow-lg shadow-[#4a2c2a]/20">
            <span className="text-[11px] font-black text-[#fffcf8] uppercase tracking-widest">Page {productPagination.page}</span>
        </div>
        <button 
          disabled={!productPagination.next}
          onClick={() => fetchProducts({ page: productPagination.page + 1, search: searchTerm, category: selectedCategory })}
          className="p-3 bg-white border border-amber-900/5 rounded-2xl disabled:opacity-30 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}