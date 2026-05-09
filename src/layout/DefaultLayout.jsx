import React from "react";
import { AppContent, AppSidebar, AppFooter, AppHeader } from "../components/index";

const DefaultLayout = () => {
  return (
    <div style={styles.wrapper}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <AppSidebar />
      </aside>

      {/* Main */}
      <div style={styles.main}>

        {/* Header */}
        <header style={styles.header}>
          <AppHeader />
        </header>

       <main style={styles.content}>
         <Outlet />
         </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <AppFooter />
        </footer>

      </div>
    </div>
  );
};

export default DefaultLayout;

const styles = {
  wrapper: {
    display: "flex",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },

  /* ================= SIDEBAR ================= */
  sidebar: {
    position: "fixed",      // 🔥 أهم تعديل
    left: 0,
    top: 0,
    width: "260px",
    height: "100vh",
    background: "#111827",
    zIndex: 2000,           // فوق كل شيء
    overflowY: "auto",
  },

  /* ================= MAIN ================= */
  main: {
    marginLeft: "260px",    // 🔥 تعويض السايدبار
    width: "calc(100% - 260px)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },

  /* ================= HEADER ================= */
  header: {
    position: "fixed",      // 🔥 ثابت فوق
    top: 0,
    left: "260px",
    right: 0,
    height: "60px",
    background: "#1e3a8a",
    zIndex: 3000,           // أعلى من كل شيء
  },

  /* ================= CONTENT ================= */
  content: {
    marginTop: "60px",      // 🔥 تحت الهيدر
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    background: "#f3f4f6",
    padding: "15px",
  },

  /* ================= FOOTER ================= */
  footer: {
    height: "40px",
    background: "#111827",
  },
};






