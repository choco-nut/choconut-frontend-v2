import { useState, useEffect, memo } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Store,
  Home,
  Package,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Bell,
} from "lucide-react";
import { useUserStore } from "../entities/user/model/useUserStore";
import { useNotificationStore } from "../entities/notification/model/useNotificationStore";
import { useChatStore } from "../features/chat/model/useChatStore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// CONTEXT IMPORTS

// UPDATED: Pull from Context, not Hook

const Navbar = () => {
  const { toggleChat } = useChatStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { currentUser, cart, wishlist, logout } = useUserStore();

  // UPDATED: Destructure from the Provider
  const { unreadCount } = useNotificationStore();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNotificationClick = async () => {
    navigate("/notifications");
  };

  // Scroll logic for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    setShowUserDropdown(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
        : "bg-[#fffcf8] py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* LOGO AREA */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4a2c2a] to-[#2d1b1a] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-amber-50 font-bold text-lg tracking-tighter">
                  CN
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-[#2d1b1a] tracking-tight">
                Choco<span className="text-green-600">Nut</span>
              </span>
              <span className="text-[10px] font-bold text-amber-800 tracking-[0.2em] uppercase">
                Premium Treats
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-1 bg-[#f3eae0]/50 p-1 rounded-full border border-amber-100">
            <NavIconLink
              to="/"
              icon={<Home size={18} />}
              label="Home"
              active={location.pathname === "/"}
            />
            <NavIconLink
              to="/shops"
              icon={<Store size={18} />}
              label="Shops"
              active={location.pathname === "/shops"}
            />
            <NavIconLink
              to="/orders"
              icon={<Package size={18} />}
              label="Orders"
              active={location.pathname === "/orders"}
            />
          </div>

          {/* ACTIONS & USER PROFILE */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 pr-2 border-r border-amber-200">
              {/* NOTIFICATION BELL */}
              <ActionButton
                onClick={handleNotificationClick}
                icon={<Bell size={20} />}
                count={unreadCount}
                activeColor="text-[#4a2c2a]"
                isNotification={true}
              />

              <ActionButton
                onClick={() => navigate("/wishlist")}
                icon={<Heart size={20} />}
                count={wishlist?.length || 0}
                activeColor="text-rose-500"
              />
              <ActionButton
                onClick={() => navigate("/cart")}
                icon={<ShoppingCart size={20} />}
                count={cart?.total_items || 0}
                activeColor="text-amber-700"
              />
            </div>
            <ActionButton
              onClick={toggleChat}
              icon={<Sparkles size={20} />}
              activeColor="text-[#4a2c2a]"
              label="Support" // Optional: You can pass a label to ActionButton
            />

            {currentUser?.is_staff && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-amber-100 text-[#4a2c2a] rounded-full font-bold text-xs uppercase tracking-wider hover:bg-amber-200 transition-all ml-2"
              >
                <LayoutDashboard size={16} />
                <span>Admin</span>
              </button>
            )}

            {currentUser ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-full bg-white border border-amber-100 hover:border-amber-300 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[#4a2c2a] text-amber-50 flex items-center justify-center font-bold text-sm">
                    {currentUser.name?.[0].toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-[#2d1b1a] pr-1">
                    {currentUser.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-amber-800 transition-transform duration-300 ${showUserDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-amber-50 p-2 ring-1 ring-black/5"
                    >
                      <DropdownItem
                        onClick={() => navigate("/profile")}
                        icon={<User size={16} />}
                        label="My Profile"
                      />
                      {currentUser?.is_staff && (
                        <DropdownItem
                          onClick={() => navigate("/admin")}
                          icon={<LayoutDashboard size={16} />}
                          label="Admin Dashboard"
                          highlight
                        />
                      )}
                      <div className="my-1 border-t border-amber-50" />
                      <DropdownItem
                        onClick={handleLogout}
                        icon={<LogOut size={16} />}
                        label="Logout"
                        danger
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="ml-2 px-6 py-2 bg-[#4a2c2a] text-white rounded-full font-bold text-sm hover:bg-[#36201f] transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl bg-amber-50 text-amber-900"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-amber-100 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <MobileLink
                to="/"
                icon={<Home size={20} />}
                label="Home"
                onClick={() => setMenuOpen(false)}
              />
              <MobileLink
                to="/shops"
                icon={<Store size={20} />}
                label="Shops"
                onClick={() => setMenuOpen(false)}
              />
              <MobileLink
                to="/orders"
                icon={<Package size={20} />}
                label="Orders"
                onClick={() => setMenuOpen(false)}
              />

              {currentUser?.is_staff && (
                <MobileLink
                  to="/admin/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label="Admin Dashboard"
                  onClick={() => setMenuOpen(false)}
                  highlight
                />
              )}

              <MobileLink
                to="/cart"
                icon={<ShoppingCart size={20} />}
                label={`Cart ${cart?.total_items > 0 ? `(${cart.total_items})` : ""}`}
                onClick={() => setMenuOpen(false)}
              />
              <MobileLink
                to="/wishlist"
                icon={<Heart size={20} />}
                label="Wishlist"
                onClick={() => setMenuOpen(false)}
              />

              <MobileLink
                to="/notifications"
                icon={<Bell size={20} />}
                label={`Alerts ${unreadCount > 0 ? `(${unreadCount})` : ""}`}
                onClick={handleNotificationClick}
                highlight={unreadCount > 0}
              />

              {/* Login Logic for Mobile */}
              {!currentUser && (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full p-4 bg-[#4a2c2a] text-white rounded-xl font-bold"
                >
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* --- HELPER SUB-COMPONENTS (Keep these same as your original) --- */

const NavIconLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${active
      ? "bg-white text-amber-900 shadow-sm ring-1 ring-amber-100"
      : "text-amber-800/60 hover:text-amber-900 hover:bg-white/50"
      }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const ActionButton = ({ icon, count, onClick, isNotification }) => (
  <button
    onClick={onClick}
    className="relative p-2.5 rounded-full text-amber-900/70 hover:bg-amber-50 hover:text-amber-900 transition-all group"
  >
    <motion.div
      animate={
        isNotification && count > 0 ? { rotate: [0, 15, -15, 15, 0] } : {}
      }
      transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
    >
      {icon}
    </motion.div>

    {count > 0 && (
      <span
        className={`absolute top-1 right-1 ${isNotification ? "bg-[#4a2c2a]" : "bg-green-600"} text-white text-[10px] font-black min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full ring-2 ring-white`}
      >
        {count}
      </span>
    )}
  </button>
);

const DropdownItem = ({ icon, label, onClick, danger, highlight }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-sm font-semibold transition-colors ${danger
      ? "text-red-600 hover:bg-red-50"
      : highlight
        ? "text-green-700 hover:bg-green-50"
        : "text-slate-700 hover:bg-amber-50"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileLink = ({ to, icon, label, onClick, highlight }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-4 p-4 rounded-xl transition-all font-bold ${highlight
      ? "bg-amber-50 text-[#4a2c2a]"
      : "hover:bg-amber-50 text-[#2d1b1a]"
      }`}
  >
    <span className="text-amber-700">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default memo(Navbar);
