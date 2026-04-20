import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";

export default function AppLayout() {
  return (
    <div className="wrapper d-flex flex-column min-vh-100">

      <AppSidebar />

      <div className="body flex-grow-1">

        <AppHeader />

        <div className="container-lg px-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
}


