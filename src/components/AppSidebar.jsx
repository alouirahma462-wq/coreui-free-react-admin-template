import React from "react"
import { useSelector } from "react-redux"
import courtNav from "../navigation/courtNav"
import inspectionNav from "../navigation/inspectionNav"
import AppSidebarNav from "./AppSidebarNav"

const AppSidebar = ({ type }) => {
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const navigation = type === "court" ? courtNav : inspectionNav

  if (!sidebarShow) return null

  return (
    <div className="sidebar-custom">
      <AppSidebarNav items={navigation} />
    </div>
  )
}

export default AppSidebar









