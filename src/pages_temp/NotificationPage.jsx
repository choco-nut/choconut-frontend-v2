import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 // Ensure correct path
import { Bell, BellOff, X, ArrowRight, Clock } from "lucide-react";
import { useNotificationStore } from "../entities/notification/model/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { notifications, loading, markOneAsRead } = useNotificationStore();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4a2c2a]/10 border-t-[#4a2c2a] rounded-full animate-spin" />
      </div>
    );
  }

  // Empty State
  if (notifications.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-[#4a2c2a]/5 rounded-[30px] flex items-center justify-center mx-auto mb-8 -rotate-6">
            <BellOff className="w-10 h-10 text-[#4a2c2a]/20" />
          </div>
          <h2 className="text-3xl font-black text-[#4a2c2a] mb-4 uppercase tracking-tighter">
            Quiet Moment
          </h2>
          <p className="text-amber-900/50 mb-10 font-medium">
            No new updates currently. We will notify you when your next delicacy
            is ready.
          </p>
          <button
            onClick={() => navigate(-1)} // Go back
            className="w-full bg-[#4a2c2a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#4a2c2a]/20 hover:bg-[#36201f] transition-all flex items-center justify-center space-x-3"
          >
            <span>Go Back</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf8] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center justify-center w-10 h-10 bg-[#4a2c2a] rounded-xl shadow-lg mb-4"
            >
              <Bell className="w-5 h-5 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-[#4a2c2a] tracking-tight uppercase">
              Alerts Gallery
            </h1>
            <p className="text-amber-900/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
              Review your updates before they clear
            </p>
          </div>

          {/* UPDATED: Close Button replaces Clear All */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-12 h-12 bg-white border border-amber-900/10 rounded-2xl text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-white transition-all duration-500 shadow-sm"
            title="Close and mark as read"
          >
            <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
        </header>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, index) => (
              <motion.div
                layout
                key={notif.id || index}
                onClick={() => {
                  if (!notif.is_read) {
                    markOneAsRead(notif.id);
                  }
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative p-6 rounded-[24px] border transition-all duration-500 ${
                  notif.is_read
                    ? "bg-white/40 border-amber-900/5 opacity-70"
                    : "bg-white border-amber-900/10 shadow-[0_10px_30px_rgba(74,44,42,0.06)] ring-1 ring-[#4a2c2a]/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Indicator */}
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.is_read ? "bg-amber-200" : "bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.4)]"}`}
                  />

                  <div className="flex-grow">
                    <p
                      className={`text-sm leading-relaxed mb-3 ${notif.is_read ? "text-amber-900/60" : "text-[#4a2c2a] font-bold"}`}
                    >
                      {notif.message}
                    </p>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-900/30">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {new Date(notif.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {!notif.is_read && (
                        <span className="text-[9px] bg-[#4a2c2a]/5 text-[#4a2c2a] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Trash button removed per request */}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-900/10 to-transparent mb-8" />
          <p className="text-[10px] font-bold text-amber-900/20 uppercase tracking-[0.4em]">
            End of updates
          </p>
        </footer>
      </div>
    </div>
  );
};

export default memo(NotificationCenter);
