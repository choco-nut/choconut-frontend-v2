import { Menu, LogOut, ShieldCheck, User as UserIcon, Bell } from "lucide-react";


// Import the hook
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../entities/user/model/useUserStore";
import { useNotificationStore } from "../../entities/notification/model/useNotificationStore";

export default function AdminHeader({
  sidebarOpen,
  onSidebarToggle,
  activeTab,
}) {
  const { currentUser, logout } = useUserStore();
  const { unreadCount } = useNotificationStore(); // Get the real-time count
  const navigate = useNavigate();

  const sectionTitles = {
    dashboard: "Dashboard Overview",
    products: "Products Managment",
    orders: "Orders Managment",
    users: "Users Managment",
    notifications: "Alerts & Dispatches", // Added for the new page
    notifications: "Messages Managment", // Added for the new page
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-amber-900/5 sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center justify-between h-20 px-6 sm:px-10">

        {/* Left Side: Mobile Menu & Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSidebarToggle(!sidebarOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-[#fffcf8] border border-amber-900/10 text-[#4a2c2a] hover:bg-[#4a2c2a] hover:text-[#fffcf8] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-900/40 leading-none mb-1">
              {['dashboard', 'notifications'].includes(activeTab) ? 'General' : 'Management'}
            </span>
            <h1 className="text-xl font-black text-[#4a2c2a] tracking-tight uppercase">
              {sectionTitles[activeTab] || "Management Console"}
            </h1>
          </div>
        </div>

        {/* Right Side: Profile & Actions */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Notification Bell */}
          <button
            onClick={() => navigate('/admin/notifications')}
            className="relative p-3 rounded-2xl bg-[#fffcf8] border border-amber-900/10 text-[#4a2c2a] hover:bg-amber-50 transition-all group"
          >
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4a2c2a] text-[#fffcf8] text-[9px] font-black shadow-lg border-2 border-white animate-bounce-short">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="h-8 w-[1px] bg-amber-900/5 mx-1 hidden sm:block"></div>

          <div className="hidden sm:flex flex-col text-right">
            <p className="text-[10px] font-black text-[#4a2c2a] uppercase tracking-wider leading-none mb-1">
              {currentUser?.name || "Administrator"}
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <ShieldCheck className="w-3 h-3 text-amber-900/40" />
              <span className="text-[9px] font-bold text-amber-900/40 uppercase tracking-widest">
                Admin Level
              </span>
            </div>
          </div>

          <div className="h-10 w-10 bg-[#4a2c2a] rounded-2xl shadow-lg shadow-[#4a2c2a]/20 flex items-center justify-center border-2 border-white">
            <UserIcon className="w-4 h-4 text-[#fffcf8]" strokeWidth={3} />
          </div>

          <div className="h-8 w-[1px] bg-amber-900/10 mx-1"></div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 p-3 rounded-2xl bg-red-500/5 text-red-500/40 hover:text-red-600 hover:bg-red-500/10 transition-all"
            title="Terminate Session"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}