import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Login from "./pages/AuthForms/Login"
import Register from "./pages/AuthForms/Register"
import { GoogleMapsApiProvider } from "./context/MapsContext"
import LandingPage from "./pages/LandingPage/LandingPage"

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />     
        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} />     
      </Route>
    )
  )

  return (
    <>
      <GoogleMapsApiProvider apiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <RouterProvider router={router} />
      </GoogleMapsApiProvider>
    </>
  )
}

export default App
