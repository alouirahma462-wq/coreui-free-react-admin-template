import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const AppSidebarNav = ({ items }) => {
  const safeItems = Array.isArray(items) ? items : []

  return (
    <div style={{ padding: "10px" }}>
      {safeItems.map((item, i) => (
        <SidebarItem key={i} item={item || {}} />
      ))}
    </div>
  )
}

const SidebarItem = ({ item }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // 🔥 TITLE (CoreUI safe check)
  if (item.component && item.name && !item.items) {
    return (
      <div style={{
        color: "#9ca3af",
        margin: "10px 0",
        fontWeight: "bold",
        fontSize: "13px"
      }}>
        {item.name}
      </div>
    )
  }

  // 🔥 GROUP
  if (Array.isArray(item.items)) {
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
            {(item.items || []).map((sub, i) => (
              <div
                key={i}
                onClick={() => sub?.to && navigate(sub.to)}
                style={{
                  padding: "6px",
                  cursor: "pointer",
                  color: "#ccc"
                }}
              >
                • {sub?.name}
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




