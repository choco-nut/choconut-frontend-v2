// src/pages/admin/UserDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";

import { useEffect, useState } from "react";
import api from "../../../shared/api/apiClient";
import {
  ArrowLeft,
  Mail,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
  User,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Package,
} from "lucide-react";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { userAction } = useAdminStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`admin/users/${id}/`);
        setUser(res.data.user);
        setStats(res.data.stats);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleUserAction = async (action) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await userAction(user.id, action);
      setUser((prev) => ({
        ...prev,
        is_blocked: action === "block" ? true : action === "unblock" ? false : prev.is_blocked,
        is_staff: action === "make_admin" ? true : action === "remove_admin" ? false : prev.is_staff,
      }));
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-[#4a2c2a]/10 rounded-full mb-4"></div>
        <p className="text-[#4a2c2a] font-bold tracking-widest text-xs uppercase">Retrieving User...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#fffcf8] py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <button onClick={() => navigate("/admin/users")} className="flex items-center gap-2 text-[#4a2c2a] font-bold mb-8 opacity-50 hover:opacity-100 transition-all uppercase text-[10px] tracking-[0.3em]">
          <ArrowLeft size={14} /> Back to Registry
        </button>
        <div className="bg-white p-12 rounded-[40px] shadow-xl shadow-[#4a2c2a]/5 border border-amber-900/5">
          <User className="w-16 h-16 text-amber-900/10 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-[#4a2c2a] uppercase">User Not Found</h2>
          <p className="text-amber-900/40 text-sm mt-2">This profile does not exist in our current registry.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8] py-12 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <button onClick={() => navigate("/admin/users")} className="flex items-center gap-2 text-[#4a2c2a] font-black mb-8 group uppercase text-[10px] tracking-[0.3em]">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-amber-700" />
          Back to Customer Registry
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5">
              <div className="bg-[#4a2c2a] p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-[#fffcf8] rounded-[24px] mx-auto flex items-center justify-center shadow-2xl rotate-3 mb-4">
                    <span className="text-3xl font-black text-[#4a2c2a]">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#fffcf8] tracking-tight">{user.name}</h2>
                  <p className="text-amber-200/50 text-[10px] font-bold uppercase tracking-widest mt-1 italic">{user.email}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest border-b border-amber-900/5 pb-4">
                  <span className="text-amber-900/40">Account Standing</span>
                  <span className={`flex items-center gap-1.5 ${user.is_blocked ? "text-red-600" : "text-emerald-600"}`}>
                    {user.is_blocked ? <XCircle size={12} /> : <CheckCircle size={12} />}
                    {user.is_blocked ? "Restricted" : "Active"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-amber-700" />
                    <div>
                      <p className="text-[9px] font-bold uppercase text-amber-900/30">Member Since</p>
                      <p className="text-xs font-black text-[#4a2c2a]">{new Date(user.date_joined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield size={14} className="text-amber-700" />
                    <div>
                      <p className="text-[9px] font-bold uppercase text-amber-900/30">Security Clearance</p>
                      <p className="text-xs font-black text-[#4a2c2a]">{user.is_staff ? "Administrator" : "Verified User"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                  <button
                    onClick={() => handleUserAction(user.is_blocked ? "unblock" : "block")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${user.is_blocked ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                      }`}
                  >
                    {user.is_blocked ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {user.is_blocked ? "Lift Restriction" : "Restrict Account"}
                  </button>
                  <button
                    onClick={() => handleUserAction(user.is_staff ? "remove_admin" : "make_admin")}
                    className="flex items-center justify-center gap-2 py-3 bg-[#4a2c2a] text-[#fffcf8] rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <Shield size={14} />
                    {user.is_staff ? "Revoke Admin" : "Promote to Admin"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats and Orders */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Acquisition Value", val: `₹${stats?.total_spent?.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600" },
                { label: "Purchase Frequency", val: `${stats?.total_orders} Orders`, icon: Package, color: "text-[#4a2c2a]" },
                { label: "Average", val: `₹${stats?.average_order?.toLocaleString()}`, icon: CreditCard, color: "text-amber-700" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[24px] border border-amber-900/5 shadow-sm">
                  <item.icon size={16} className={`${item.color} mb-3 opacity-60`} />
                  <p className="text-lg font-black text-[#4a2c2a]">{item.val}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-amber-900/30">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Order Ledger */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-[#4a2c2a]/5 border border-amber-900/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-[#4a2c2a] uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-1 h-4 bg-amber-700 rounded-full" />
                  Transactions
                </h3>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#fffcf8] rounded-2xl border border-amber-900/5 group hover:border-amber-700/20 transition-all">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-amber-900/5">
                          <ShoppingBag size={16} className="text-amber-700" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-tight">Ref: {order.id.slice(-8)}</p>
                          <p className="text-[10px] font-bold text-amber-900/30 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex-1 md:px-8">
                        <p className="text-[11px] font-bold text-[#4a2c2a]/60 line-clamp-1 italic">
                          {order.items.map(item => `${item.product_name} (${item.quantity})`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-amber-900/5">
                        <div className="text-right">
                          <p className="text-sm font-black text-[#4a2c2a]">₹{order.total_amount?.toLocaleString()}</p>
                          <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${order.order_status === "DELIVERED" ? "text-emerald-600" : "text-amber-700"
                            }`}>
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingBag size={48} className="mx-auto text-amber-900/5 mb-4" />
                  <p className="text-[11px] font-black text-[#4a2c2a] uppercase tracking-widest opacity-30">No transaction history found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}