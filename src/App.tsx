import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/AuthForms/Login"
import Register from "./pages/AuthForms/Register"
// import { GoogleMapsApiProvider } from "./context/MapsContext"
import LandingPage from "./pages/LandingPage/LandingPage"
import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/Admin/Dashboard"
import Profile from "./pages/Admin/Profile"
import Bookings from "./pages/Admin/Bookings"
import ParkingSpaceOverview from "./pages/Admin/ParkingSpaceOverview"

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />     
        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} />     
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />     
        <Route path="/admin/dashboard" element={<Dashboard />} />     
        <Route path="/admin/profile" element={<Profile />} />     
        <Route path="/admin/spaceoverview" element={<ParkingSpaceOverview />} />     
        <Route path="/admin/bookings" element={<Bookings />} />     
      </Route>
      </>
    )
  )

  return (
    <>
      {/* <GoogleMapsApiProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}> */}
        <RouterProvider router={router} />
      {/* </GoogleMapsApiProvider> */}
    </>
  )
}

export default App
