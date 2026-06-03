// src/pages/AdminDashboard.jsx
import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardOverview from "../components/admin/sections/DashboardOverview";
import ProductsManagement from "../components/admin/sections/ProductsManagement";
import OrdersManagement from "../components/admin/sections/OrdersManagement";
import AnalyticsSection from "../components/admin/sections/AnalyticsSection";
import SettingsSection from "../components/admin/sections/SettingsSection";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderSection = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "products":
        return <ProductsManagement />;
      case "orders":
        return <OrdersManagement />;
      case "analytics":
        return <AnalyticsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderSection()}
    </AdminLayout>
  );
}