import React, { useState, useContext } from 'react';
import { Send, Users, User, CheckCircle2, Circle } from 'lucide-react';

import api from "../../../shared/api/apiClient";
import { useAdminStore } from "../../../entities/admin/model/useAdminStore";
import { toast } from "react-toastify";

const AdminNotificationManager = () => {
  const { users } = useAdminStore();
  const [msg, setMsg] = useState({ title: '', message: '' });
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isBroadcast, setIsBroadcast] = useState(true);

  const toggleUserSelection = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!msg.title || !msg.message) return toast.error("Please fill all fields");

    try {
      // Send selectedUserIds as 'user_ids'. If isBroadcast is true, send empty array.
      await api.post('/notifications/admin/broadcast/', {
        ...msg,
        user_ids: isBroadcast ? [] : selectedUserIds
      });

      toast.success("Messages dispatched to the atelier.");
      setMsg({ title: '', message: '' });
      setSelectedUserIds([]);
    } catch (err) {
      toast.error("Dispatch failed.");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <section className="bg-white border border-amber-900/10 rounded-[40px] p-10 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-[#4a2c2a] rounded-2xl text-[#fffcf8] shadow-lg shadow-[#4a2c2a]/20">
            <Send size={24} />
          </div>
          <h2 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter">User Messaging</h2>
        </div>

        <form onSubmit={handleBroadcast} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Message Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40 ml-2">Subject Header</label>
              <input
                className="w-full bg-[#fffcf8] border border-amber-900/5 rounded-2xl p-5 text-[#4a2c2a] placeholder:text-amber-900/20 outline-none focus:ring-2 ring-[#4a2c2a]/5 transition-all"
                placeholder="Ex: Private Tasting Event..."
                value={msg.title}
                onChange={e => setMsg({ ...msg, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40 ml-2">The Message Content</label>
              <textarea
                className="w-full bg-[#fffcf8] border border-amber-900/5 rounded-2xl p-5 h-64 text-[#4a2c2a] outline-none focus:ring-2 ring-[#4a2c2a]/5 transition-all resize-none"
                placeholder="Write your refined update here..."
                value={msg.message}
                onChange={e => setMsg({ ...msg, message: e.target.value })}
              />
            </div>
          </div>

          {/* Right: Recipient Selection */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40 ml-2 mb-2">Recipient Selection</label>
            <div className="flex-1 bg-[#fffcf8] border border-amber-900/10 rounded-[32px] p-6 flex flex-col min-h-[400px]">

              {/* Toggle Buttons */}
              <div className="flex p-1 bg-white border border-amber-900/5 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setIsBroadcast(true)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isBroadcast ? 'bg-[#4a2c2a] text-white shadow-md' : 'text-amber-900/30'}`}
                >
                  All Users
                </button>
                <button
                  type="button"
                  onClick={() => setIsBroadcast(false)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isBroadcast ? 'bg-[#4a2c2a] text-white shadow-md' : 'text-amber-900/30'}`}
                >
                  Select Specific
                </button>
              </div>

              {/* User List Container */}
              {!isBroadcast && (
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[300px] custom-scrollbar">
                  {users?.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border transition-all ${selectedUserIds.includes(user.id) ? 'bg-white border-[#4a2c2a] shadow-sm' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-900/5 flex items-center justify-center text-[10px] font-bold text-[#4a2c2a]">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#4a2c2a]">{user.name || 'Valued Patron'}</span>
                          <span className="text-[10px] text-amber-900/40">{user.email}</span>
                        </div>
                      </div>
                      {selectedUserIds.includes(user.id) ?
                        <CheckCircle2 className="w-5 h-5 text-[#4a2c2a]" /> :
                        <Circle className="w-5 h-5 text-amber-900/10" />
                      }
                    </div>
                  ))}
                </div>
              )}

              {isBroadcast && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-[#4a2c2a]/5 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-[#4a2c2a]/20 w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-[#4a2c2a]">Global Dispatch Mode</p>
                  <p className="text-[10px] text-amber-900/40 mt-1">Every active user will receive this notification.</p>
                </div>
              )}

              <button className="w-full mt-6 bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-[#4a2c2a]/20 hover:opacity-90 active:scale-95 transition-all">
                {isBroadcast ? 'Dispatch to All' : `Send to ${selectedUserIds.length} Selected`}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminNotificationManager;