import React, { useState, useEffect } from "react";
import "./dashboard.css";

export default function Dashboard({ user }) {
  const [time, setTime] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [modal, setModal] = useState(null);

  // 🔥 Live clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Fake live stats (later connect Supabase)
  const [stats, setStats] = useState({
    total: 142,
    active: 87,
    closed: 55,
    unassigned: 7,
    monthlyChange: +12,
  });

  const courts = [
    { id: 1, name: "Tunis", active: 87, status: "high" },
    { id: 2, name: "Sfax", active: 55, status: "medium" },
    { id: 3, name: "Sousse", active: 32, status: "low" },
  ];

  const isAdmin =
    user?.role === "admin" || user?.role === "inspector";

  return (
    <div className="dashboard">

      {/* 🟦 HEADER */}
      <header className="header">
        <div>
          🏛 منظومة النيابة العمومية - تونس
        </div>

        <div>
          📅 {time.toLocaleDateString()} | ⏰ {time.toLocaleTimeString()}
        </div>

        <div className="status">
          🟢 System Stable
        </div>
      </header>

      <div className="layout">

        {/* 🟪 SIDEBAR */}
        <aside className="sidebar">
          <h3>🏛 المحاكم</h3>

          {courts.map((court) => (
            <div
              key={court.id}
              className="courtCard"
              onClick={() => setSelectedCourt(court)}
            >
              <strong>{court.name}</strong>
              <p>Active: {court.active}</p>
              <span className={court.status}>
                {court.status.toUpperCase()}
              </span>
            </div>
          ))}
        </aside>

        {/* 🟩 MAIN CONTENT */}
        <main className="main">

          {/* 📊 CARDS */}
          <div className="cards">
            <div className="card">Total: {stats.total}</div>
            <div className="card">Active: {stats.active}</div>
            <div className="card">Closed: {stats.closed}</div>
            <div className="card">Unassigned: {stats.unassigned}</div>
          </div>

          {/* 📈 ANALYTICS */}
          <div className="analytics">
            <h3>📈 Monthly Comparison</h3>
            <p>+{stats.monthlyChange}% more cases than last month</p>
          </div>

          {/* ⚠ ALERTS */}
          <div className="alerts">
            <p>⚠ Sfax Court increasing load</p>
            <p>⚠ Tunis Court delay detected</p>
          </div>

        </main>

        {/* 🟥 RIGHT PANEL */}
        <aside className="rightPanel">

          {/* 👤 USER */}
          <div className="userBox">
            <h3>👤 {user?.username}</h3>
            <p>{user?.role}</p>
            <button onClick={() => setModal("profile")}>
              Profile
            </button>
          </div>

          {/* 🧑‍⚖️ ADMIN PANEL */}
          {isAdmin && (
            <div className="adminPanel">
              <h3>🧑‍⚖️ التفقدية</h3>

              <button onClick={() => setModal("addUser")}>
                ➕ Add User
              </button>

              <button onClick={() => setModal("deleteUser")}>
                ❌ Delete User
              </button>

              <button onClick={() => setModal("logs")}>
                📜 Audit Logs
              </button>

              <button onClick={() => setModal("stats")}>
                📊 Statistics
              </button>

              <button onClick={() => setModal("reports")}>
                📈 Reports
              </button>

              <button onClick={() => setModal("settings")}>
                ⚙ Settings
              </button>
            </div>
          )}

        </aside>
      </div>

      {/* 🟣 MODAL SYSTEM */}
      {modal && (
        <div className="modalOverlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>📌 {modal}</h2>
            <p>Content for {modal} will be connected to Supabase later.</p>
            <button onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}

      {/* 🟡 COURT MODAL */}
      {selectedCourt && (
        <div
          className="modalOverlay"
          onClick={() => setSelectedCourt(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🏛 {selectedCourt.name}</h2>
            <p>Active Cases: {selectedCourt.active}</p>
            <p>Status: {selectedCourt.status}</p>

            <button
              onClick={() =>
                (window.location.href = `/court/${selectedCourt.id}`)
              }
            >
              Open Court Dashboard
            </button>

            <button onClick={() => setSelectedCourt(null)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


