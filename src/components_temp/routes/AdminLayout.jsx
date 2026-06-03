import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Outlet /> {/* nested admin routes */}
    </div>
  );
}
