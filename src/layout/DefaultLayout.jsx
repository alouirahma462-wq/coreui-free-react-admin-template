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

        {/* Content */}
        <main style={styles.content}>
          <AppContent />
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

/* =========================
   FIXED LAYOUT STYLES
========================= */
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden", // 🔥 يمنع أي scroll خارجي
  },

  /* ================= SIDEBAR ================= */
  sidebar: {
    width: "260px",
    height: "100vh",
    flexShrink: 0,
    background: "#111827",

    position: "relative",
    zIndex: 50, // فوق المحتوى

    overflowY: "auto",
  },

  /* ================= MAIN ================= */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",

    overflow: "hidden", // 🔥 scroll واحد فقط
    position: "relative",
  },

  /* ================= HEADER ================= */
  header: {
    height: "60px",
    flexShrink: 0,

    position: "relative",
    zIndex: 1000, // 🔥 مهم جداً لمنع الاختفاء

    background: "#1e3a8a",
    display: "flex",
    alignItems: "center",
  },

  /* ================= CONTENT ================= */
  content: {
    flex: 1,

    overflowY: "auto",   // 🔥 السكروول الوحيد هنا
    overflowX: "hidden", // 🔥 يمنع الخط الغريب

    background: "#f3f4f6",
    padding: "15px",
  },

  /* ================= FOOTER ================= */
  footer: {
    height: "40px",
    flexShrink: 0,
    background: "#111827",
  },
};





