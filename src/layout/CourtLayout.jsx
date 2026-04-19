const CourtLayout = ({ children }) => {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      
      <AppSidebar type="court" />

      <div
        className="wrapper"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <AppHeader type="court" />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            color: "white",
          }}
        >
          {children}
        </main>

        <AppFooter />
      </div>
    </div>
  );
};

export default CourtLayout;



