"use client"

import type React from "react"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, MapPin, Calendar, Lock, User, Phone } from "lucide-react"
import { formatCreditCardNumber, formatExpiryDate } from "@/lib/utils"
import { BASE_URL } from "@/App"

interface PaymentDetails {
  parkingId: string
  date: string
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
  level: string
  spot: string
  slot?: number
  user?: string
  req_time_start?: string
  req_time_end?: string
  isOffline?: boolean
}

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingDetails = location.state as PaymentDetails

  // Function to format date and time to proper API format (YYYY-MM-DD HH:MM:SS)
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  

  const [reservationData] = useState({
    ...bookingDetails,
    slot: bookingDetails.slot || Number.parseInt(bookingDetails.spot.split("-")[1]) || 0,
    user: bookingDetails.user || "3",
    req_time_start: bookingDetails.req_time_start,
    req_time_end: bookingDetails.req_time_end,
  })

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    phoneNumber: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = formatCreditCardNumber(value)
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (name === "phoneNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log(reservationData)

    try {
      // Make the API call to book the slot
      const response = await fetch(`${BASE_URL}/reservation/booking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          slot: reservationData.slot,
          user: reservationData.user,
          req_time_start: reservationData.req_time_start,
          req_time_end: reservationData.req_time_end,
          phone_number: `+91${formData.phoneNumber}`,
        })
      });

      if (!response.ok) {
        throw new Error(`Booking failed with status: ${response.status}`);
      }

      const bookingData = await response.json();
      console.log("Booking confirmed:", bookingData);

      // Determine which confirmation page to navigate to based on isOffline flag
      if (bookingDetails.isOffline) {
        // For offline/kiosk bookings
        navigate("/confirmation", {
          state: {
            bookingData: {
              ...reservationData,
              booking_id : bookingData.booking_id,
              paymentStatus: "Paid",
              paymentDate: formatDate(new Date().toISOString().split('T')[0]),

            },
            isKiosk: true,
          },
        })
      } else {
        // For online bookings
        navigate("/confirmation", {
          state: {
            ...reservationData,
            booking_id : bookingData.booking_id,
            paymentStatus: "Paid",
            paymentDate: formatDate(new Date().toISOString().split('T')[0]),
          },
        })
      }
    } catch (error) {
      console.error("Payment failed:", error)
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-16 md:pt-24 max-w-3xl">
      <button
        className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back</span>
      </button>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Card className="shadow-md bg-white border-0">
            <CardHeader className="bg-blue-50 rounded-t-lg pb-2">
              <CardTitle className="text-xl text-blue-800">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">Parking Details</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{bookingDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{bookingDetails.duration} hours</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {bookingDetails.startTime} - {bookingDetails.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">Level {bookingDetails.level}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Spot {bookingDetails.spot}</p>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">Reserved</div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Total Amount</p>
                    <p className="font-bold text-xl text-blue-800">{formatPrice(bookingDetails.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="shadow-md border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="cardHolder" className="flex gap-1.5 items-center">
                    <User className="h-4 w-4 text-gray-500" />
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    placeholder="Name on card"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cardNumber" className="flex gap-1.5 items-center">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="expiryDate" className="flex gap-1.5 items-center">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cvv" className="flex gap-1.5 items-center">
                      <Lock className="h-4 w-4 text-gray-500" />
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phoneNumber" className="flex gap-1.5 items-center">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="flex gap-1.5 items-center">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Billing Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter your billing address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 mt-4 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ${formatPrice(bookingDetails.totalPrice)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
