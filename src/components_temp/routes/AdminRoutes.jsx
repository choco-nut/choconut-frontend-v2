import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../entities/user/model/useUserStore";

const AdminRoutes = () => {
  const { currentUser } = useUserStore();

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
