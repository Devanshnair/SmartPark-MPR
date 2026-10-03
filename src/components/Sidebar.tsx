"use client"

import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { BarChart3, User, CalendarCheck, ParkingCircle, Menu, X } from "lucide-react"
import Logo from "/parkingicon.png"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    title: "Parking Space",
    href: "/admin/spaceoverview",
    icon: ParkingCircle,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
]

export default function Sidebar() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname])

  // Control body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  
    return () => {
      document.body.style.overflow = ""
    }
  }, [isSidebarOpen])

  return (
    <>
      {/* Mobile/Tablet Top Navbar - Only visible on smaller screens */}
      <nav className="md:hidden shadow-sm absolute z-20 py-4 px-8 w-full max-w-screen bg-transparent backdrop-blur-lg h-[4.5rem] flex items-center">
        <div className="flex justify-between items-center w-full">
          {/* Hamburger menu button */}
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo and name */}
          <Link to="/">
            <div className="flex-shrink-0 flex justify-center items-center gap-2.5 font-bold text-xl cursor-pointer">
              <div className="size-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-200/70 overflow-hidden">
                <img src={Logo || "/placeholder.svg"} alt="logo" className="size-8 object-contain" />
              </div>
              <p>Parko</p>
            </div>
          </Link>

          {/* Empty div to balance the flex layout */}
          <div className="w-6"></div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-3/4 md:w-64 bg-slate-100 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header - Only visible on desktop */}
        <div className="p-6 pt-10 hidden md:block">
          <Link to={'/'} className="flex-shrink-0 flex justify-start items-center gap-2.5 font-bold text-xl cursor-pointer">
            <div className="size-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-200/70 overflow-hidden">
              <img src={Logo || "/placeholder.svg"} alt="logo" className="size-8 object-contain" />
            </div>
            <p>Parko</p>
          </Link>
        </div>

        {/* Mobile Sidebar Header with close button */}
        <div className="p-6 flex justify-between items-center md:hidden">
          <div className="flex-shrink-0 flex justify-start items-center gap-2.5 font-bold text-xl cursor-pointer">
            <div className="size-9 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-200/70 overflow-hidden">
              <img src={Logo || "/placeholder.svg"} alt="logo" className="size-8 object-contain" />
            </div>
            <p>Parko</p>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 px-4 mt-4">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href || (location.pathname === "/admin" && item.href === "/admin/dashboard")

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                  isActive ? "bg-blue-100 text-black font-medium" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-slate-700"}`} />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  )
}