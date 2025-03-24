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
import MapComponent from "./components/Map"
import { APIProvider } from "@vis.gl/react-google-maps"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const BASE_URL =
  // "https://toucan-driven-admittedly.ngrok-free.app/api/products";
  "https://live-merely-drum.ngrok-free.app";

export const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNTczODI4LCJpYXQiOjE3NDE0MDEwMjgsImp0aSI6Ijc2NTFmMWQzZTIzOTRhMWE5NTc0ZDNmYjBiMjcwODFmIiwidXNlcl9pZCI6MX0.ewHpDzOk_3xSnmjJ59iABGVcXYRg-flmzlZaGAvGYTI";

const queryClient = new QueryClient();

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />     
        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} />     
        
      </Route>
      <Route path="/map" element={<APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}><MapComponent /></APIProvider>} />     
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App
