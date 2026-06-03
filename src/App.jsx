import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { getAccessToken } from './shared/api/apiClient';

// Stores
import { useUserStore } from './entities/user/model/useUserStore';
import { useNotificationStore } from './entities/notification/model/useNotificationStore';

// Components
import ScrollToTop from './components_temp/ScrolToTop';
import ProtectedRoute from './components_temp/ProtectedRoutes';
import AdminRoutes from './components_temp/routes/AdminRoutes';
import AdminLayout from './components_temp/admin/AdminLayout';
import UserLayout from './components_temp/routes/UserLayout';
import PageLoader from './shared/ui/PageLoader';
import ChatSidebar from './components_temp/ChatBoat';

// Direct imports - NO LAZY LOADING
import Home from './pages_temp/Home';
import Login from './pages_temp/Login';
import SignUp from './pages_temp/SignUp';
import ProductDetails from './pages_temp/ProductDetails';
import Shops from './pages_temp/Shops';
import Cart from './pages_temp/Cart';
import Wishlist from './pages_temp/Wishlist';
import Profile from './pages_temp/Profile';
import OrderConfirmation from './pages_temp/OrderConfirmation';
import ShipmentPage from './pages_temp/ShipmentPage';
import PaymentPage from './pages_temp/PaymentPage';
import OrdersPage from './pages_temp/OrdersPage';
import AddFeedback from './pages_temp/AddFeedback';
import ChangePassword from './pages_temp/ChangePassword';
import VerifyOTP from './pages_temp/OTPVerify';
import NotFound from './pages_temp/NotFound';
import TermsAndConditions from './pages_temp/TermsAndConditions';
import NotificationPage from './pages_temp/NotificationPage';

// Admin Sections
import DashboardOverview from './components_temp/admin/sections/DashboardOverview';
import ProductsManagement from './components_temp/admin/sections/ProductsManagement';
import OrdersManagement from './components_temp/admin/sections/OrdersManagement';
import UsersManagement from './components_temp/admin/sections/UsersManagement';
import AddProduct from './components_temp/admin/pages/AddProduct';
import EditProduct from './components_temp/admin/pages/EditProduct';
import UserDetails from './components_temp/admin/pages/UserDetails';
import AdminNotificationManager from './components_temp/admin/pages/AdminNotificationManagerPage';
import AdminNotificationPage from './components_temp/admin/pages/AdminNotificationPage';

function App() {
  const { currentUser, loadingAuth } = useUserStore();
  const { connectWebSocket, disconnectWebSocket } = useNotificationStore();
  const navigate = useNavigate();

  // Initialize Authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch user data if token exists (token refresh handled by interceptor)
        const token = getAccessToken();
        if (token) {
          const res = await api.get("/me/");
          useUserStore.getState().setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        useUserStore.getState().logout();
      } finally {
        useUserStore.getState().setLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  // Initialize WebSocket for notifications
  useEffect(() => {
    if (currentUser) {
      const token = getAccessToken(); // Use helper function
      if (token) {
        connectWebSocket(token, navigate, currentUser.is_staff || currentUser.isAdmin);
      }
    }
    return () => disconnectWebSocket();
  }, [currentUser, connectWebSocket, disconnectWebSocket, navigate]);

  if (loadingAuth) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <ChatSidebar />
      <Routes>
        {/* 1. ADMIN ROUTES GROUP */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="messages" element={<AdminNotificationManager />} />
            <Route path="notifications" element={<AdminNotificationPage />} />
          </Route>
        </Route>

        {/* 2. PUBLIC & USER ROUTES GROUP */}
        <Route element={<UserLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />

          {/* Private User Routes (Authenticated Only) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/shipment" element={<ShipmentPage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/product/:id/review" element={<AddFeedback />} />
            <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        hideProgressBar
      />
    </>
  );
}

export default App;