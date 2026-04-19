import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const AppSidebarNav = ({ items }) => {
  if (!items || !Array.isArray(items)) return null

  return (
    <div style={{ padding: "10px" }}>
      {items.map((item, i) => (
        <SidebarItem key={i} item={item} />
      ))}
    </div>
  )
}

const SidebarItem = ({ item }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // 🔹 TITLE
  if (item.component?.name === "CNavTitle") {
    return (
      <div style={{
        color: "#9ca3af",
        margin: "10px 0",
        fontWeight: "bold"
      }}>
        {item.name}
      </div>
    )
  }

  // 🔹 GROUP
  if (item.items && Array.isArray(item.items)) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            padding: "8px",
            background: "#1e293b",
            borderRadius: "6px",
            color: "#fff"
          }}
        >
          {item.name}
        </div>

        {open && (
          <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
            {item.items.map((sub, i) => (
              <div
                key={i}
                onClick={() => navigate(sub.to)}
                style={{
                  padding: "6px",
                  cursor: "pointer",
                  color: "#ccc"
                }}
              >
                • {sub.name}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

export default AppSidebarNav



