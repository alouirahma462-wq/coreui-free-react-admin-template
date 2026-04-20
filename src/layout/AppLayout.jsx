const AppLayout = () => {
  const location = useLocation();

  const type = location.pathname.startsWith("/court")
    ? "court"
    : location.pathname.startsWith("/inspection-dashboard")
    ? "inspection"
    : "";

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <div className="sidebar">
        <AppSidebar type={type} />
      </div>

      {/* Main */}
      <div className="main-area">

        <div className="header">
          <AppHeader type={type} />
        </div>

        <div className="content">
          <Outlet />
        </div>

      </div>

    </div>
  );
};


