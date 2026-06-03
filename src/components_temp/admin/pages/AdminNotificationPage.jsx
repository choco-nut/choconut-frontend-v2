import React from 'react';

import { ShoppingBag, Bell, CheckCircle, Clock } from 'lucide-react';
import { useNotificationStore } from "../../../entities/notification/model/useNotificationStore";

const AdminNotificationsPage = () => {
  const { notifications, markOneAsRead } = useNotificationStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#4a2c2a] uppercase tracking-tighter">Admin Alerts</h1>
          <p className="text-[10px] font-bold text-amber-900/40 uppercase tracking-[0.3em]">System & Order Updates</p>
        </div>
      </header>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white border border-dashed border-amber-900/10 rounded-[32px] p-20 text-center">
            <Bell className="mx-auto text-amber-900/10 mb-4" size={48} strokeWidth={1} />
            <p className="text-sm font-bold text-amber-900/20 uppercase tracking-widest">The Admin is quiet...</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => !notif.is_read && markOneAsRead(notif.id)}
              className={`group relative bg-white border rounded-[28px] p-6 transition-all cursor-pointer ${
                notif.is_read ? 'border-amber-900/5 opacity-60' : 'border-[#4a2c2a]/10 shadow-md ring-1 ring-[#4a2c2a]/5'
              }`}
            >
              <div className="flex items-start gap-5">
                {/* Dynamic Icon based on content */}
                <div className={`p-4 rounded-2xl ${notif.title.toLowerCase().includes('order') ? 'bg-[#4a2c2a] text-white' : 'bg-amber-50 text-amber-900/40'}`}>
                  {notif.title.toLowerCase().includes('order') ? <ShoppingBag size={20} /> : <Bell size={20} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-[#4a2c2a] uppercase text-sm tracking-tight">{notif.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-900/30 uppercase">
                      <Clock size={12} />
                      {new Date(notif.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-amber-900/70 leading-relaxed">{notif.message}</p>
                </div>

                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#4a2c2a] mt-2 animate-pulse" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;