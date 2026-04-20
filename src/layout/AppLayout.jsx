import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";

export default function AppLayout() {
  return (
    <div className="wrapper d-flex flex-column min-vh-100">

      <div className="body d-flex flex-grow-1">

        {/* SIDEBAR */}
        <AppSidebar />

        {/* MAIN */}
        <div className="main d-flex flex-column flex-grow-1">

          {/* HEADER */}
          <AppHeader />

          {/* CONTENT */}
          <main className="content px-3 py-2">
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  );
}



