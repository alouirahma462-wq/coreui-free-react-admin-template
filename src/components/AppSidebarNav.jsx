import React from "react"
import { NavLink } from "react-router-dom"
import {
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle
} from "@coreui/react"

const AppSidebarNav = ({ items }) => {
  const renderItem = (item, index) => {

    // 🔥 تحديد نوع العنصر
    const Component =
      item.component === "CNavTitle"
        ? CNavTitle
        : item.component === "CNavGroup"
        ? CNavGroup
        : CNavItem

    // 🔥 إذا Group
    if (item.component === "CNavGroup") {
      return (
        <CNavGroup key={index} toggler={item.name}>
          {item.items?.map((subItem, i) => renderItem(subItem, i))}
        </CNavGroup>
      )
    }

    // 🔥 إذا Item أو Title
    return (
      <Component
        key={index}
        as={item.to ? NavLink : "div"}
        to={item.to}
      >
        {item.name}
      </Component>
    )
  }

  return (
    <CSidebarNav>
      {items?.map((item, index) => renderItem(item, index))}
    </CSidebarNav>
  )
}

export default AppSidebarNav

