import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppSidebarNav = ({ items = [] }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div style={{ padding: "10px" }}>
      {safeItems.map((item, i) => (
        <SidebarItem key={i} item={item} />
      ))}
    </div>
  );
};

const SidebarItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!item) return null;

  // TITLE
  if (item.component?.name === "CNavTitle") {
    return (
      <div
        style={{
          color: "#9ca3af",
          margin: "10px 0",
          fontWeight: "bold",
        }}
      >
        {item.name}
      </div>
    );
  }

  // GROUP
  if (Array.isArray(item.items) && item.items.length > 0) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            padding: "8px",
            background: "#1e293b",
            borderRadius: "6px",
            color: "#fff",
          }}
        >
          {item.name}
        </div>

        {open && (
          <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
            {item.items.map((sub, i) => (
              <div
                key={i}
                onClick={() => sub.to && navigate(sub.to)}
                style={{
                  padding: "6px",
                  cursor: "pointer",
                  color: "#ccc",
                }}
              >
                • {sub.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // SINGLE ITEM
  return (
    <div
      onClick={() => item.to && navigate(item.to)}
      style={{
        padding: "8px",
        cursor: "pointer",
        color: "#fff",
      }}
    >
      {item.name}
    </div>
  );
};

export default AppSidebarNav;





