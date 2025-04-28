import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/AuthForms/Login"
import Register from "./pages/AuthForms/Register"
// import { GoogleMapsApiProvider } from "./context/MapsContext"
import LandingPage from "./pages/LandingPage/LandingPage"
import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/Admin/Dashboard/Dashboard"
import Profile from "./pages/Admin/Profile"
import Bookings from "./pages/Admin/Bookings"
import ParkingSpaceOverview from "./pages/Admin/ParkingSpaceOverview"
import MapComponent from "./components/Map"
import { APIProvider } from "@vis.gl/react-google-maps"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ParkingProfile from "./pages/ParkingProfile"
import ChooseSpot from "./pages/ChooseSpot"
import Payment from "./pages/Payment"
import Confirmation from "./pages/Confirmation"
import Kiosk from "./pages/Kiosk/Kiosk";
import ScanQR from "./pages/Kiosk/ScanQR";
import BookOffline from "./pages/Kiosk/BookOffline";
import BookingConfirmation from "./pages/Kiosk/BookingConfirmation";

export const BASE_URL =
  "https://plainly-modern-escargot.ngrok-free.app";
  // "https://live-merely-drum.ngrok-free.app";
  // "https://real-pleasantly-grizzly.ngrok-free.app"

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
        <Route path="/parkingprofile/:id" element={<ParkingProfile />} />     
        <Route path="/parkingprofile/:id/choosespot" element={<ChooseSpot />} />     
        <Route path="/payment" element={<Payment />} />     
        <Route path="/confirmation" element={<Confirmation />} />     
        <Route path="/parkingprofile/:id/bookoffline" element={<BookOffline />} />
        
      </Route>
      <Route path="/map" element={<APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}><MapComponent /></APIProvider>} />     
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />     
        <Route path="/admin/dashboard" element={<Dashboard />} />     
        <Route path="/admin/profile" element={<Profile />} />     
        <Route path="/admin/spaceoverview" element={<ParkingSpaceOverview />} />     
        <Route path="/admin/bookings" element={<Bookings />} />     
      </Route>
      <Route path="/kiosk" element={<Kiosk />} />
      <Route path="/scan-qr" element={<ScanQR />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
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
