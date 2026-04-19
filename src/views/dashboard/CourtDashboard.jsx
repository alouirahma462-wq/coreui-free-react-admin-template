import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function CourtDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [openDoor, setOpenDoor] = useState(false);
  const [enterDashboard, setEnterDashboard] = useState(false);
  const [time, setTime] = useState("");

  const courtName = user?.court_name || "المحكمة";

  useEffect(() => {
    const fetchCourt = async () => {
      if (!user?.court_name && user?.court_id) {
        const { data } = await supabase
          .from("courts")
          .select("name")
          .eq("id", user.court_id)
          .single();

        const updatedUser = {
          ...user,
          court_name: data?.name || "المحكمة",
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    };

    fetchCourt();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleString("ar-TN", {
          timeZone: "Africa/Tunis",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setOpenDoor(true);
    setTimeout(() => setEnterDashboard(true), 1200);
  };

  return (
    <div style={{ width: "100%" }}>

      {/* 🔵 GATE (Full overlay only here) */}
      {!enterDashboard && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{ textAlign: "center", color: "white" }}>
            <h1>🏛️ {courtName}</h1>
            <h2>👋 {user?.fullName}</h2>
            <button onClick={handleEnter}>
              الدخول
            </button>
          </div>
        </div>
      )}

      {/* 🔵 DASHBOARD (inside layout طبيعي) */}
      {enterDashboard && (
        <div style={{ padding: "20px" }}>

          <div style={{
            background: "#b91c1c",
            color: "white",
            padding: "10px"
          }}>
            🇹🇳 وزارة العدل - {courtName}
          </div>

          <div style={{
            background: "#1e3a8a",
            color: "white",
            padding: "8px",
            textAlign: "center"
          }}>
            ⏰ {time}
          </div>

          <div style={{
            marginTop: "20px",
            background: "rgba(255,255,255,0.1)",
            padding: "20px",
            borderRadius: "12px"
          }}>
            <h1>🏛️ {courtName}</h1>
            <h2>👋 {user?.fullName}</h2>
          </div>

        </div>
      )}

    </div>
  );
}





