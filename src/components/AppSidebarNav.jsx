import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const AppSidebarNav = ({ items }) => {
  return (
    <div style={{ padding: "10px" }}>
      {items.map((group, i) => (
        <SidebarGroup key={i} group={group} />
      ))}
    </div>
  )
}

const SidebarGroup = ({ group }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{
        fontWeight: "bold",
        color: "#fff",
        marginBottom: "10px"
      }}>
        {group.title}
      </div>

      {group.sections.map((section, i) => (
        <SidebarSection key={i} section={section} />
      ))}
    </div>
  )
}

const SidebarSection = ({ section }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div style={{ marginBottom: "10px" }}>

      {/* عنوان القسم */}
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
        {section.number} - {section.title}
      </div>

      {/* العناصر */}
      {open && (
        <div style={{ marginTop: "5px", paddingLeft: "10px" }}>
          {section.items.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.to)}
              style={{
                padding: "6px",
                cursor: "pointer",
                color: "#ccc"
              }}
            >
              • {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppSidebarNav


