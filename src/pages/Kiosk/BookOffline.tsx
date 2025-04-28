"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Clock, Calendar, MapPin, Car, AlertCircle, Hourglass } from "lucide-react"
import { BASE_URL } from "@/App"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LiaRupeeSignSolid } from "react-icons/lia";

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

interface BookingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedSpot: string | null
  duration: string
  totalPrice: number
  currentTime: string
  endTime: string
  level: string | null
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

// Booking Details Modal Component
const BookingDetailsModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedSpot,
  duration,
  totalPrice,
  currentTime,
  endTime,
  level,
}: BookingDetailsModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      onConfirm()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Spot</p>
              <p className="font-medium">{selectedSpot || "Random Assignment"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium">{level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-medium">{currentTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Time</p>
              <p className="font-medium">{endTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{duration} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="font-medium">₹{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {!selectedSpot && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                A spot will be automatically assigned to you.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function BookOffline() {
  const navigate = useNavigate()
  const { id: parkingId } = useParams()

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string>("1")
  const [parkingData, setParkingData] = useState<ParkingAreaResponse | null>(null)
  const [levelData, setLevelData] = useState<LevelData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Current date and time
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  // Calculate end time based on duration
  const endTime = new Date(currentDate.getTime() + Number.parseInt(selectedDuration) * 60 * 60 * 1000)
  const formattedEndTime = endTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  // Calculate price based on duration (mock rate of ₹60 per hour)
  const hourlyRate = 60
  const totalPrice = hourlyRate * Number.parseInt(selectedDuration)

  // Fetch parking slots data
  useEffect(() => {
    const fetchParkingSlots = async () => {
      setLoading(true)
      try {
        // First, get the slots data
        const response = await fetch(`${BASE_URL}/reservation/parking-area/${parkingId}/slots/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "ngrok-skip-browser-warning": "true",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch parking slots")
        }

        const data: ParkingAreaResponse = await response.json()
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
  }, [parkingId])

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

  // Handle booking confirmation
  const handleBookNow = () => {
    if (!selectedSlot) {
      setError("Please select a parking spot first")
      setTimeout(() => setError(null), 3000) // Clear error after 3 seconds
      return
    }
    setIsBookingModalOpen(true)
  }

  // Handle proceeding to payment
  const handleProceedToPayment = () => {
    // Create booking details object
    const bookingDetails = {
      parkingId: parkingId || "",
      date: formattedDate,
      startTime: formattedTime,
      endTime: formattedEndTime,
      duration: Number.parseInt(selectedDuration),
      totalPrice: totalPrice,
      level: selectedLevel?.replace("L", "") || "1",
      spot: selectedSlot ? getSlotName(selectedLevel || "", selectedSlot) : "Auto-Assign",
      isOffline: true,
      req_time_start: currentDate.toISOString(),
      req_time_end: endTime.toISOString(),
    }

    // Navigate to payment page with booking details
    navigate("/payment", {
      state: bookingDetails,
    })
  }

  // Get the slots for the currently selected level
  const getCurrentLevelSlots = () => {
    if (!selectedLevel) return []
    const level = levelData.find((l) => l.id === selectedLevel)
    return level ? level.slots : []
  }

  // Get slot name based on level and slot ID (not index)
  const getSlotName = (levelId: string, slotId: number) => {
    return `${levelId}-${slotId}`
  }

  // Get current level name
  const getCurrentLevelName = () => {
    if (!selectedLevel) return ""
    const level = levelData.find((l) => l.id === selectedLevel)
    return level ? level.name : ""
  }

  // Handle random spot assignment
  const handleRandomSpot = () => {
    const availableSlots = getCurrentLevelSlots().filter(slot => slot.available && !slot.reserved)
    
    if (availableSlots.length === 0) {
      setError("No available spots on this level")
      setTimeout(() => setError(null), 3000)
      return
    }
    
    // Randomly select an available spot
    const randomIndex = Math.floor(Math.random() * availableSlots.length)
    const randomSlot = availableSlots[randomIndex]
    
    // Set the selected slot to the random one
    setSelectedSlot(randomSlot.id)
    
    // Open booking modal
    setIsBookingModalOpen(true)
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

      <h1 className="text-2xl font-bold mb-6">Book Parking Spot (Offline)</h1>

      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Booking Details Card */}
        <Card className="md:col-span-1 shadow-sm">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Booking Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 translate-y-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Current Time</p>
                  <p className="font-medium">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hourglass className="h-5 w-5 text-blue-600 mt-0.5 translate-y-1" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Hour</SelectItem>
                      <SelectItem value="2">2 Hours</SelectItem>
                      <SelectItem value="3">3 Hours</SelectItem>
                      <SelectItem value="4">4 Hours</SelectItem>
                      <SelectItem value="6">6 Hours</SelectItem>
                      <SelectItem value="8">8 Hours</SelectItem>
                      <SelectItem value="12">12 Hours</SelectItem>
                      <SelectItem value="24">24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 translate-y-1" />
                <div>
                  <p className="text-sm text-gray-500">Selected Spot</p>
                  <p className="font-medium">
                    {selectedSlot ? getSlotName(selectedLevel || "", selectedSlot) : "No spot selected"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LiaRupeeSignSolid className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">₹{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-6">
              <Button
                className="w-full bg-black hover:bg-black/90"
                onClick={handleBookNow}
                disabled={!selectedLevel}
              >
                Book Spot
              </Button>

              <Button variant="outline" className="w-full" onClick={handleRandomSpot} disabled={!selectedLevel}>
                Assign Random Spot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Spot Selection */}
        <Card className="md:col-span-2 shadow-sm">
          <CardContent className="p-4">
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

            {selectedLevel && (
              <div className="mb-6">
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grid">
                    <Label className="mb-2 block">Select a Spot</Label>
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                      {getCurrentLevelSlots().map((slot) => {
                        const isAvailable = slot.available && !slot.reserved
                        const slotName = getSlotName(selectedLevel, slot.id)

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
                  </TabsContent>

                  <TabsContent value="list">
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {getCurrentLevelSlots()
                        .filter((slot) => slot.available && !slot.reserved)
                        .map((slot) => {
                          const slotName = getSlotName(selectedLevel, slot.id)

                          return (
                            <div
                              key={slot.id}
                              className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${
                                selectedSlot === slot.id ? "border-blue-500 bg-blue-50" : ""
                              }`}
                              onClick={() => setSelectedSlot(slot.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-blue-600" />
                                <span>{slotName}</span>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Available
                              </Badge>
                            </div>
                          )
                        })}

                      {getCurrentLevelSlots().filter((slot) => slot.available && !slot.reserved).length === 0 && (
                        <div className="text-center py-8 text-gray-500">No available spots on this level</div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 mt-3 flex-wrap">
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
          </CardContent>
        </Card>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleProceedToPayment}
        selectedSpot={selectedSlot ? getSlotName(selectedLevel || "", selectedSlot) : null}
        duration={selectedDuration}
        totalPrice={totalPrice}
        currentTime={formattedTime}
        endTime={formattedEndTime}
        level={getCurrentLevelName()}
      />
    </div>
  )
}
