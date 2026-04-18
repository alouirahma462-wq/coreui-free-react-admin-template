import React from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CCloseButton
} from "@coreui/react"

import CIcon from "@coreui/icons-react"

// ✔️ أهم إصلاح: تأكد المسار صحيح 100%
import logo from "../assets/brand/logo"
import sygnet from "../assets/brand/sygnet"

// ✔️ navigation (لازم يكون موجود في src/_nav.js)
import navigation from "../_nav"

import AppSidebarNav from "./AppSidebarNav"

const AppSidebar = () => {
  const dispatch = useDispatch()

  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) =>
        dispatch({ type: "set", sidebarShow: visible })
      }
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() =>
            dispatch({ type: "set", sidebarShow: false })
          }
        />
      </CSidebarHeader>

      {/* NAVIGATION */}
      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({
              type: "set",
              sidebarUnfoldable: !unfoldable
            })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)






