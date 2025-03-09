import Sidebar from "@/components/Sidebar"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

