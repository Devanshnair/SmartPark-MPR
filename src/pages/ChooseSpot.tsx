"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { BASE_URL } from "@/App"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BookingDetails {
  parkingId: string | number
  date: string
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
}

interface Slot {
  id: number
  parking_area: number
  available: boolean
  reserved: boolean
  reserved_for_start: string | null
  reserved_for_end: string | null
}

interface ParkingAreaResponse {
  parking_area_id: number
  total_slots: number
  avaiilable_slots: number
  levels: number
  slots: Slot[]
}

interface LevelData {
  id: string
  name: string
  slots: Slot[]
}

// Fallback data in case API fails
const fallbackParkingData: ParkingAreaResponse = {
  parking_area_id: 6,
  total_slots: 120,
  avaiilable_slots: 120,
  levels: 3,
  slots: Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    parking_area: 6,
    available: Math.random() > 0.3,
    reserved: false,
    reserved_for_start: null,
    reserved_for_end: null,
  })),
}

export default function ChooseSpot() {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingDetails = location.state as BookingDetails
  const { id: userId } = useParams()

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [parkingData, setParkingData] = useState<ParkingAreaResponse | null>(null)
  const [levelData, setLevelData] = useState<LevelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch parking slots data
  useEffect(() => {
    const fetchParkingSlots = async () => {
      setLoading(true)
      try {
        // First, get the slots data
        const response = await fetch(`${BASE_URL}/reservation/parking-area/${bookingDetails.parkingId}/slots/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "ngrok-skip-browser-warning": "true",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch parking slots")
        }

        const data: ParkingAreaResponse = await response.json()
        console.log(data);
        
        setParkingData(data)

        // Organize slots into levels
        organizeSlotsByLevel(data)
      } catch (err) {
        console.error("Error fetching parking slots:", err)
        setError("Failed to load parking slots. Using fallback data.")

        // Use fallback data
        setParkingData(fallbackParkingData)
        organizeSlotsByLevel(fallbackParkingData)
      } finally {
        setLoading(false)
      }
    }

    fetchParkingSlots()
  }, [bookingDetails.parkingId])

  // Organize slots into levels
  const organizeSlotsByLevel = (data: ParkingAreaResponse) => {
    if (!data || !data.slots || !data.levels) return

    const totalLevels = data.levels 
    const totalSlots = data.slots.length
    const slotsPerLevel = Math.ceil(totalSlots / totalLevels)

    const levels: LevelData[] = []

    // Create level data with evenly distributed slots
    for (let i = 0; i < totalLevels; i++) {
      const startIndex = i * slotsPerLevel
      const endIndex = Math.min(startIndex + slotsPerLevel, totalSlots)

      levels.push({
        id: `L${i + 1}`,
        name: `Level ${i + 1}`,
        slots: data.slots.slice(startIndex, endIndex),
      })
    }

    setLevelData(levels)

    // Set default selected level
    if (levels.length > 0 && !selectedLevel) {
      setSelectedLevel(levels[0].id)
    }
  }

  // Reserve the slot
  const handleReservation = () => {
    if (!selectedSlot) {
      return
    } 

    // Instead of making API call here, just navigate to payment with all required data
    navigate("/payment", {
      state: {
        ...bookingDetails,
        slot: selectedSlot,
        level: selectedLevel?.replace("L", ""),
        spot: getSlotName(selectedLevel || "", getCurrentLevelSlots().findIndex(slot => slot.id === selectedSlot)),
        user: userId,
        req_time_start: `${bookingDetails.startTime}:00`,
        req_time_end: `${bookingDetails.endTime}:00`
      },
    })
  }

  // Get the slots for the currently selected level
  const getCurrentLevelSlots = () => {
    if (!selectedLevel) return []
    const level = levelData.find((l) => l.id === selectedLevel)
    return level ? level.slots : []
  }

  // Get slot name based on level and slot index
  const getSlotName = (levelId: string, slotIndex: number) => {
    return `${levelId}-${slotIndex + 1}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 pt-[5.5rem] flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-700 mb-2" />
          <p>Loading parking slots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-[5.5rem]">
      <ArrowLeft className="text-slate-500 h-5 w-5 mb-3 cursor-pointer" onClick={() => navigate(-1)} />

      <h1 className="text-2xl font-bold mb-6">Choose Your Parking Spot</h1>

      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Booking Details Summary */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">Booking Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{bookingDetails.date}</p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium">
                {bookingDetails.startTime} - {bookingDetails.endTime}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium">{bookingDetails.duration} hours</p>
            </div>
            <div>
              <p className="text-gray-500">Total Price</p>
              <p className="font-medium">₹{bookingDetails.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Selection */}
      <div className="mb-6">
        <Label htmlFor="parkingLevel" className="mb-2 block">
          Select Parking Level
        </Label>
        <Select value={selectedLevel || ""} onValueChange={setSelectedLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select a level" />
          </SelectTrigger>
          <SelectContent>
            {levelData.map((level) => {
              const availableCount = level.slots.filter((slot) => slot.available && !slot.reserved).length
              return (
                <SelectItem key={level.id} value={level.id}>
                  {level.name} ({availableCount}/{level.slots.length} available)
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Slot Selection */}
      {selectedLevel && (
        <div className="mb-6">
          <Label className="mb-2 block">Select a Spot</Label>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {getCurrentLevelSlots().map((slot, index) => {
              const isAvailable = slot.available && !slot.reserved
              const slotName = getSlotName(selectedLevel, index)

              return (
                <Button
                  key={slot.id}
                  variant={selectedSlot === slot.id ? "default" : "outline"}
                  className={`h-10 ${
                    !isAvailable
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : selectedSlot === slot.id
                        ? "bg-blue-50 text-black border border-blue-500 hover:bg-blue-50"
                        : ""
                  }`}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSlot(slot.id)}
                >
                  {slotName}
                </Button>
              )
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 border border-blue-500 mr-2"></div>
              <span className="text-xs">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 mr-2"></div>
              <span className="text-xs">Unavailable</span>
            </div>
          </div>
        </div>
      )}

      <Button className="w-full bg-blue-700 hover:bg-blue-800" disabled={!selectedSlot} onClick={handleReservation}>
        Reserve Spot
      </Button>
    </div>
  )
}
