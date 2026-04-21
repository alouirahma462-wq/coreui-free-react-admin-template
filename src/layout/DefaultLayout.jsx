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

/* 🔥 CSS FIX ROOT */
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },

  sidebar: {
    width: "260px",
    height: "100vh",
    flexShrink: 0,
    background: "#111827",
    overflowY: "auto",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },

  header: {
    height: "60px",
    flexShrink: 0,
    background: "#1e3a8a",
    zIndex: 10,
  },

  content: {
    flex: 1,
    overflowY: "auto",
    background: "#f3f4f6",
    padding: "15px",
  },

  footer: {
    height: "40px",
    flexShrink: 0,
    background: "#111827",
  },
};


