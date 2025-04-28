import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {

  return (
    <div className={`md:grid grid-cols-[256px_1fr] min-h-screen  overflow-clip rounded-md bg-slate-100`}>
        <Sidebar/>
        <div className="md:ml-2">
          <Outlet />
        </div>
    </div>
  )
}

