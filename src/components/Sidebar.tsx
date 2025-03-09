import { Link, useLocation } from "react-router-dom"
import { BarChart3, User, Car, CalendarCheck, ParkingCircle } from "lucide-react"

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

  return (
    <aside className="w-full md:w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 font-semibold text-xl">
          <Car className="h-6 w-6" />
          <span>ParkEasy Admin</span>
        </div>
      </div>
      <nav className="space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

