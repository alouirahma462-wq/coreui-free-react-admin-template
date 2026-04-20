import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";

const AppLayout = () => {
  const location = useLocation();

  // تحديد نوع الداشبورد
  const type = location.pathname.startsWith("/court")
    ? "court"
    : location.pathname.startsWith("/inspection-dashboard")
    ? "inspection"
    : "";

  return (
    <div className="app-layout">
      <AppSidebar type={type} />

      <div className="main-area">
        <AppHeader type={type} />

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
