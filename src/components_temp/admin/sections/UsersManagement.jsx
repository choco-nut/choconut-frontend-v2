// src/components/admin/sections/UsersManagement.jsx
import { useState, useEffect } from "react";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";

import { useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  Mail,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DataTable from "../DataTable";
import { motion } from "framer-motion";

export default function UsersManagement() {
  const navigate = useNavigate();
  const { users, userAction, userStats, fetchUsers, userPagination } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers({ search: searchTerm, status: statusFilter, page: 1 });
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter]);

  const getStatusStyles = (user) => {
    if (user.is_blocked) return "bg-red-50 text-red-700 border-red-100";
    if (!user.is_active) return "bg-amber-50 text-amber-800 border-amber-100";
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  const statConfig = [
    { label: "Total Users", val: userStats.total, color: "bg-[#4a2c2a]", icon: UserCheck },
    { label: "Verified", val: userStats.active, color: "bg-[#8b5e34]", icon: CheckCircle },
    { label: "Pending", val: userStats.notVerified, color: "bg-[#bc8a5f]", icon: Calendar },
    { label: "Blacklisted", val: userStats.blocked, color: "bg-red-400", icon: UserX },
    { label: "New Growth", val: userStats.newThisMonth, color: "bg-emerald-400", icon: UserPlus },
  ];

  // FIXED COLUMN WIDTHS
  const tableHeaders = [
    { label: "User Profile", className: "w-[25%]" },
    { label: "Contact Information", className: "w-[20%]" },
    { label: "Standing", className: "w-[15%]" },
    { label: "Member Since", className: "w-[15%]" },
    { label: "Activity", className: "w-[15%]" },
    { label: "Actions", className: "w-[10%] text-right" },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter">Users Registry</h1>
        <p className="text-amber-900/40 text-[11px] font-bold uppercase tracking-[0.4em] mt-1">Manage Elite Customer Relations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statConfig.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[28px] border border-amber-900/5 shadow-xl shadow-[#4a2c2a]/5">
            <div className="flex justify-between items-start mb-3">
              <stat.icon size={16} className="text-amber-900/20" />
            </div>
            <p className="text-2xl font-black text-[#4a2c2a]">{stat.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">{stat.label}</p>
            <div className="w-full h-1 bg-[#fffcf8] rounded-full mt-4 overflow-hidden">
              <div className={`h-full ${stat.color} w-2/3 opacity-40`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[24px] p-4 border border-amber-900/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-900/20 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#fffcf8] border-none rounded-xl text-sm font-bold text-[#4a2c2a] placeholder:text-amber-900/20 focus:ring-2 focus:ring-[#4a2c2a]/5 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-3 bg-[#fffcf8] border-none rounded-xl text-[11px] font-black uppercase tracking-widest text-[#4a2c2a] focus:ring-2 focus:ring-[#4a2c2a]/5 cursor-pointer"
        >
          <option value="all">Status: All Profiles</option>
          <option value="active">Verified Users</option>
          <option value="inactive">Pending Approval</option>
          <option value="blocked">Blacklisted</option>
        </select>
      </div>

      {/* Users Table */}
      <DataTable
        headers={tableHeaders}
        data={users}
        renderRow={(user) => (
          <>
            {/* Profile - 25% */}
            <td className="py-6 px-8 w-[25%]">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 shrink-0 bg-[#4a2c2a] text-[#fffcf8] rounded-full flex items-center justify-center text-xs font-black ring-4 ring-amber-900/5 shadow-lg shadow-[#4a2c2a]/20">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#4a2c2a] truncate">{user.name}</p>
                  <p className="text-[9px] font-bold text-amber-900/30 tracking-widest">ID: {user.id}</p>
                </div>
              </div>
            </td>

            {/* Contact - 20% */}
            <td className="py-6 px-8 w-[20%]">
              <div className="flex items-center space-x-2 text-[11px] font-bold text-[#4a2c2a]/70 italic truncate">
                <Mail className="w-3 h-3 shrink-0 opacity-30" />
                <span className="truncate">{user.email}</span>
              </div>
            </td>

            {/* Standing - 15% */}
            <td className="py-6 px-8 w-[15%]">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center w-fit gap-1.5 ${getStatusStyles(user)}`}>
                {user.is_blocked ? <XCircle size={10} /> : <CheckCircle size={10} />}
                {user.is_blocked ? "Blocked" : !user.is_active ? "Inactive" : "Active"}
              </span>
            </td>

            {/* Date - 15% */}
            <td className="py-6 px-8 w-[15%] text-[11px] font-bold text-amber-900/40">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="opacity-40" />
                {user.date_joined ? new Date(user.date_joined).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "N/A"}
              </div>
            </td>

            {/* Activity - 15% */}
            <td className="py-6 px-8 w-[15%]">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-3 h-3 text-amber-900/20" />
                <span className="text-sm font-black text-[#4a2c2a]">{user.orders_count || 0}</span>
                <span className="text-[10px] uppercase font-bold text-amber-900/30 tracking-tighter">Orders</span>
              </div>
            </td>

            {/* Actions - 10% */}
            <td className="py-6 px-8 w-[10%] text-right">
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  className="p-2 text-amber-900/20 hover:text-[#4a2c2a] hover:bg-white rounded-xl transition-all"
                  title="View Dossier"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => userAction(user.id, user.is_blocked ? "unblock" : "block")}
                  className={`p-2 rounded-xl transition-all ${
                    user.is_blocked ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" : "text-red-600 bg-red-50 hover:bg-red-100"
                  }`}
                  title={user.is_blocked ? "Unblock Patron" : "Restrict Patron"}
                >
                  {user.is_blocked ? <UserCheck size={16} /> : <UserX size={16} />}
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4">
        <button 
          disabled={!userPagination.previous}
          onClick={() => fetchUsers({ page: userPagination.page - 1, search: searchTerm, status: statusFilter })}
          className="p-3 bg-white border border-amber-900/5 rounded-2xl disabled:opacity-30 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="bg-[#4a2c2a] px-8 py-2 rounded-2xl shadow-lg shadow-[#4a2c2a]/20">
            <span className="text-[11px] font-black text-[#fffcf8] uppercase tracking-widest">Entry {userPagination.page}</span>
        </div>
        <button 
          disabled={!userPagination.next}
          onClick={() => fetchUsers({ page: userPagination.page + 1, search: searchTerm, status: statusFilter })}
          className="p-3 bg-white border border-amber-900/5 rounded-2xl disabled:opacity-30 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}