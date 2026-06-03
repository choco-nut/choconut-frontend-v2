// src/components/admin/sections/OrdersManagement.jsx
import { useState, useEffect } from "react";
import { Search, Edit, Check, X, ChevronLeft, ChevronRight, Hash, CreditCard } from "lucide-react";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";
import DataTable from "../DataTable";

import { motion } from "framer-motion";

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    orders,
    fetchOrders,
    handleSaveStatus,
    setEditingOrderId,
    setUpdatedStatus,
    editingOrderId,
    updatedStatus,
    orderStats,
    orderPagination,
  } = useAdminStore();

  // Status Style Palette
  const getStatusStyles = (status) => {
    const styles = {
      DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
      CANCELLED: "bg-red-50 text-red-700 border-red-100",
      SHIPPED: "bg-amber-50 text-amber-700 border-amber-100",
      PROCESSING: "bg-[#4a2c2a]/5 text-[#4a2c2a] border-amber-900/10",
      PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
      PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    };
    return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  const stats = [
    { label: "Pending", value: orderStats.PROCESSING || 0, color: "bg-[#bc8a5f]" },
    { label: "Transit", value: orderStats.SHIPPED || 0, color: "bg-[#8b5e34]" },
    { label: "Completed", value: orderStats.DELIVERED || 0, color: "bg-[#4a2c2a]" },
    { label: "Cancelled", value: orderStats.CANCELLED || 0, color: "bg-red-200" },
  ];

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrders({ page: 1, search: searchTerm, status: statusFilter });
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter]);

  // DEFINE FIXED COLUMN WIDTHS (Updated to accommodate Payment Status)
  const tableHeaders = [
    { label: "Reference", className: "w-[10%]" },
    { label: "User", className: "w-[18%]" },
    { label: "Amount", className: "w-[12%]" },
    { label: "Payment", className: "w-[12%]" }, // New Column
    { label: "Status", className: "w-[15%]" },
    { label: "Items", className: "w-[12%]" },
    { label: "Date", className: "w-[12%]" },
    { label: "Actions", className: "w-[9%] text-right" },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter">Orders Management</h1>
        <p className="text-amber-900/40 text-[11px] font-bold uppercase tracking-[0.4em] mt-1">Manage Curated Shipments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[32px] border border-amber-900/5 shadow-xl shadow-[#4a2c2a]/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-[#4a2c2a]">{stat.value}</p>
            <div className="w-full h-1.5 bg-[#fffcf8] rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                className={`h-full ${stat.color}`} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-[24px] p-4 border border-amber-900/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-900/20 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Locate by Patron or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#fffcf8] border-none rounded-xl text-sm font-bold text-[#4a2c2a] placeholder:text-amber-900/20 focus:ring-2 focus:ring-[#4a2c2a]/5 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-3 bg-[#fffcf8] border-none rounded-xl text-[11px] font-black uppercase tracking-widest text-[#4a2c2a] cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Voided</option>
        </select>
      </div>

      {/* Orders Table */}
      <DataTable
        headers={tableHeaders}
        data={orders}
        renderRow={(order) => (
          <>
            {/* Reference - 10% */}
            <td className="py-6 px-6 w-[10%]">
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-amber-900/20" />
                <span className="text-sm font-black text-[#4a2c2a] tracking-tighter">{order.id}</span>
              </div>
            </td>

            {/* Patron - 18% */}
            <td className="py-6 px-6 w-[18%]">
              <p className="text-[13px] font-black text-[#4a2c2a] truncate">{order.user_name}</p>
              <p className="text-[9px] text-amber-900/40 uppercase font-bold tracking-widest">Verified Patron</p>
            </td>

            {/* Total - 12% */}
            <td className="py-6 px-6 w-[12%] font-black text-[#4a2c2a]">
              ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>

            {/* Payment Status - 12% */}
            <td className="py-6 px-6 w-[12%]">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'PAID' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === 'PAID' ? 'text-emerald-700' : 'text-orange-700'}`}>
                  {order.payment_status}
                </span>
              </div>
            </td>

            {/* Order Status - 15% */}
            <td className="py-6 px-6 w-[15%]">
              {editingOrderId === order.id ? (
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="bg-white border border-amber-900/10 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#4a2c2a] w-full"
                >
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Voided</option>
                </select>
              ) : (
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(order.order_status)}`}>
                  {order.order_status}
                </span>
              )}
            </td>

            {/* Curation - 12% */}
            <td className="py-6 px-6 w-[12%]">
              <span className="text-[10px] font-bold text-[#4a2c2a]/60 uppercase tracking-tight italic">
                {order.items?.length || 0} Items
              </span>
            </td>

            {/* Date - 12% */}
            <td className="py-6 px-6 w-[12%] text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">
              {new Date(order.created_at).toLocaleDateString()}
            </td>

            {/* Actions - 9% */}
            <td className="py-6 px-6 w-[9%] text-right">
              {editingOrderId === order.id ? (
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => handleSaveStatus({ orderId: order.id, page: orderPagination.page, search: searchTerm, status: statusFilter })} className="p-2 bg-[#4a2c2a] text-[#fffcf8] rounded-lg hover:bg-black transition-colors"><Check size={14} /></button>
                  <button onClick={() => setEditingOrderId(null)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><X size={14} /></button>
                </div>
              ) : (
                <button onClick={() => {setEditingOrderId(order.id); setUpdatedStatus(order.order_status);}} className="p-2 text-amber-900/20 hover:text-[#4a2c2a] hover:bg-[#fffcf8] rounded-xl transition-all">
                  <Edit size={16} />
                </button>
              )}
            </td>
          </>
        )}
      />

      {/* Pagination (Same as before) */}
      <div className="flex justify-center items-center gap-4 pt-6">
        <button 
            disabled={!orderPagination.previous}
            onClick={() => fetchOrders({ page: orderPagination.page - 1, search: searchTerm, status: statusFilter })}
            className="p-3 bg-white border border-amber-900/5 rounded-2xl disabled:opacity-30 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="bg-[#4a2c2a] px-6 py-2 rounded-2xl shadow-lg shadow-[#4a2c2a]/20">
            <span className="text-[11px] font-black text-[#fffcf8] uppercase tracking-widest">Page {orderPagination.page}</span>
        </div>
        <button 
            disabled={!orderPagination.next}
            onClick={() => fetchOrders({ page: orderPagination.page + 1, search: searchTerm, status: statusFilter })}
            className="p-3 bg-white border border-amber-900/5 rounded-2xl disabled:opacity-30 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}