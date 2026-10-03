"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Car, Clock, Filter, AlertCircle, ParkingCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BASE_URL } from "@/App"

// Interfaces for API responses
interface ParkingAreaSlot {
  id: number
  parking_area: number
  available: boolean
  reserved: boolean
  reserved_for_start: string | null
  reserved_for_end: string | null
  vehicle?: {
    licensePlate: string
    entryTime: string
  }
}

interface ParkingAreaSlotsResponse {
  parking_area_id: number
  total_slots: number
  avaiilable_slots: number
  levels: number
  slots: ParkingAreaSlot[]
}

interface ParkingAreaResponse {
  id: number
  latitude: number
  longitude: number
  owner: {
    id: number
    user: {
      id: number
      username: string
      name: string
      email: string
    }
    parking_name: string
    total_slots: number
    hourlyRate: number
    dailyRate: number
    monthlyRate: number
    openingHours: string
    description: string
    levels: number
    address: string
    rating: number
    image_url: string
    availableTypes: string
  }
  available_slots: number
}

interface FloorData {
  id: number
  name: string
  totalSpots: number
  spots: {
    id: string
    status: "available" | "occupied"
    type: "standard" | "handicap"
    vehicle: {
      licensePlate: string
      entryTime: string
    } | null
    rawSlot?: ParkingAreaSlot
  }[]
}

interface ParkingOverviewData {
  totalSpots: number
  occupiedSpots: number
  reservedSpots: number
  availableSpots: number
  floors: FloorData[]
  rawParkingAreaData?: any
  rawSlotsData?: any
}

// Fallback parking space data
const fallbackParkingData: ParkingOverviewData = {
  totalSpots: 120,
  occupiedSpots: 78,
  reservedSpots: 15,
  availableSpots: 27,
  floors: [],
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

// Helper function to calculate duration
function calculateDuration(dateString: string) {
  const entryTime = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - entryTime.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${diffHrs}h ${diffMins}m`
}

// API function to fetch parking data
const fetchParkingData = async () => {
  const parkingAreaResponse = await fetch(`${BASE_URL}/reservation/parking-area/3`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "ngrok-skip-browser-warning": "true",
    }
  });
  
  if (!parkingAreaResponse.ok) {
    throw new Error("Failed to fetch parking area data");
  }
  
  const parkingAreaData: ParkingAreaResponse = await parkingAreaResponse.json();
  
  const slotsResponse = await fetch(`${BASE_URL}/reservation/parking-area/3/slots/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "ngrok-skip-browser-warning": "true",
    }
  });
  
  if (!slotsResponse.ok) {
    throw new Error("Failed to fetch parking slots data");
  }
  
  const slotsData: ParkingAreaSlotsResponse = await slotsResponse.json();
  
  const totalSpots = slotsData.total_slots;
  const availableSpots = slotsData.avaiilable_slots;
  
  // Initialize counts
  let occupiedSpots = 0;
  let reservedSpots = 0;
  
  // Process slots to calculate reserved and occupied counts based on actual status
  slotsData.slots.forEach(slot => {
    if (slot.reserved) {
      // Check if it's an active reservation (currently occupied)
      const now = new Date();
      if (slot.reserved_for_start && slot.reserved_for_end) {
        const [startHours, startMinutes] = slot.reserved_for_start.split(':').map(Number);
        const [endHours, endMinutes] = slot.reserved_for_end.split(':').map(Number);
        
        const startTime = new Date();
        startTime.setHours(startHours, startMinutes, 0);
        
        const endTime = new Date();
        endTime.setHours(endHours, endMinutes, 0);
        
        if (now >= startTime && now <= endTime) {
          // Slot is currently in use due to reservation
          occupiedSpots++;
        } else {
          // Slot is reserved but not currently in use
          reservedSpots++;
        }
      } else {
        // If we don't have time info, count as reserved
        reservedSpots++;
      }
    } else if (!slot.available) {
      // Slot is marked as not available and not reserved - it's occupied
      occupiedSpots++;
    }
  });
  
  const floors: FloorData[] = [];
  const totalLevels = slotsData.levels;
  const slotsPerLevel = Math.ceil(slotsData.slots.length / totalLevels);
  
  for (let i = 0; i < totalLevels; i++) {
    const startIndex = i * slotsPerLevel;
    const endIndex = Math.min(startIndex + slotsPerLevel, slotsData.slots.length);
    const levelSlots = slotsData.slots.slice(startIndex, endIndex);
    
    const spots = levelSlots.map((slot, index) => {
      let status: "available" | "occupied" = "available";
      let vehicle = null;
      
      if (slot.reserved) {
        const now = new Date();
        
        if (slot.reserved_for_start && slot.reserved_for_end) {
          const [startHours, startMinutes] = slot.reserved_for_start.split(':').map(Number);
          const [endHours, endMinutes] = slot.reserved_for_end.split(':').map(Number);
          
          const startTime = new Date();
          startTime.setHours(startHours, startMinutes, 0);
          
          const endTime = new Date();
          endTime.setHours(endHours, endMinutes, 0);
          
          if (now >= startTime && now <= endTime) {
            status = "occupied";
            vehicle = {
              licensePlate: `MH${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000)}`,
              entryTime: startTime.toISOString()
            };
          }
        }
      } else if (!slot.available) {
        status = "occupied";
        vehicle = {
          licensePlate: `MH${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000)}`,
          entryTime: new Date(Date.now() - Math.random() * 10000000).toISOString()
        };
      }

      return {
        id: `L${i+1}-${index+1}`,
        status,
        type: (Math.random() > 0.8 ? "handicap" : "standard") as "handicap" | "standard",
        vehicle,
        rawSlot: slot
      };
    });
    
    floors.push({
      id: i + 1,
      name: `Level ${i + 1}`,
      totalSpots: levelSlots.length,
      spots
    });
  }
  
  return {
    totalSpots,
    occupiedSpots,
    reservedSpots,
    availableSpots,
    floors,
    rawParkingAreaData: parkingAreaData,
    rawSlotsData: slotsData
  };
}

export default function ParkingSpaceOverview() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1)
  const [filter, setFilter] = useState("all")
  const [selectedSpot, setSelectedSpot] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkMobileView()
    window.addEventListener("resize", checkMobileView)

    return () => {
      window.removeEventListener("resize", checkMobileView)
    }
  }, [])

  const {
    data: parkingData,
    isLoading,
    error,
  } = useQuery<ParkingOverviewData>({
    queryKey: ["parking-overview"],
    queryFn: fetchParkingData,
  })

  const data = parkingData || fallbackParkingData

  const currentFloor = data.floors.find((floor) => floor.id === selectedFloor) || data.floors[0]

  const filteredSpots = currentFloor?.spots.filter((spot) => {
    if (filter === "all") return true
    if (filter === "available") return spot.status === "available"
    if (filter === "occupied") return spot.status === "occupied"
    if (filter === "handicap") return spot.type === "handicap"
    return true
  })

  const handleSpotClick = (spot: any) => {
    setSelectedSpot(spot)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="mx-2 my-2 rounded-lg py-5 px-8">
        <Skeleton className="bg-slate-200 h-12 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="bg-slate-200 h-24" />
          ))}
        </div>
        <Skeleton className="bg-slate-200 h-10 w-48 mb-4" />
        <Skeleton className="bg-slate-200 h-64" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load parking data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="md:mx-2 md:my-2 rounded-lg bg-white py-5 px-8 max-md:py-[5.5rem]">
    
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Parking Space Overview</h1>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6 w-auto">
        <Card className="pt-4 gap-0 w-auto">
          <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="text-gray-500 font-normal text-sm">Total Spots</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <p className="text-2xl font-semibold py-4 pb-6">{data.totalSpots}</p>
          </CardContent>
        </Card>
        <Card className="pt-4 gap-0 w-auto">
          <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="text-gray-500 font-normal text-sm">Occupied</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="text-2xl font-semibold py-4 pb-6">{data.occupiedSpots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.occupiedSpots / data.totalSpots) * 100)}% occupancy
            </p>
          </CardContent>
        </Card>
        <Card className="pt-4 gap-0 w-auto">
          <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="text-gray-500 font-normal text-sm">Reserved</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="text-2xl font-semibold py-4 pb-6">{data.reservedSpots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.reservedSpots / data.totalSpots) * 100)}% reserved
            </p>
          </CardContent>
        </Card>
        <Card className="pt-4 gap-0 w-auto">
          <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="text-gray-500 font-normal text-sm">Available</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="text-2xl font-semibold py-4 pb-6">{data.availableSpots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.availableSpots / data.totalSpots) * 100)}% available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <Select
              value={selectedFloor.toString()}
              onValueChange={(value) => {
                setSelectedFloor(Number.parseInt(value))
                setSelectedSpot(null)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                {data.floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id.toString()}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground text-nowrap">{currentFloor?.totalSpots} spots</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0 max-lg:hidden" />
            <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">
                  All
                </TabsTrigger>
                <TabsTrigger value="available" className="flex-1 sm:flex-none">
                  Available
                </TabsTrigger>
                <TabsTrigger value="occupied" className="flex-1 sm:flex-none">
                  Occupied
                </TabsTrigger>
                <TabsTrigger value="handicap" className="flex-1 sm:flex-none">
                  Handicap
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentFloor?.name} Parking Map</CardTitle>
            <CardDescription>Click on a parking spot to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {filteredSpots?.map((spot) => {
                let buttonStyle = "border-gray-300";
                if (spot.status === "occupied") {
                  buttonStyle = "border-red-500 bg-red-50 hover:bg-red-100";
                }
                
                return (
                  <Button
                    key={spot.id}
                    variant="outline"
                    className={`h-16 w-full p-1 ${buttonStyle} ${
                      spot.type === "handicap" ? "relative overflow-hidden" : ""
                    }`}
                    onClick={() => handleSpotClick(spot)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs font-medium">{spot.id}</span>
                      {spot.status === "occupied" && <Car className="h-4 w-4" />}
                    </div>
                    {spot.type === "handicap" && (
                      <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </Button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border border-red-500 bg-red-50 flex items-center justify-center">
                  <Car className="h-2 w-2" />
                </div>
                <span className="text-xs">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
                <span className="text-xs">Handicap</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Spot Details</DialogTitle>
            <DialogDescription>Information about selected parking spot</DialogDescription>
          </DialogHeader>
          {selectedSpot && (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-medium">Spot {selectedSpot.id}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Badge 
                    variant={selectedSpot.status === "occupied" ? "destructive" : "default"}
                  >
                    {selectedSpot.status.charAt(0).toUpperCase() + selectedSpot.status.slice(1)}
                  </Badge>
                  {selectedSpot.type === "handicap" && <Badge variant="secondary" className="bg-blue-600 text-white">Handicap</Badge>}
                </div>
              </div>

              {selectedSpot.status === "occupied" && selectedSpot.vehicle && (
                <div>
                  <h4 className="font-medium">Vehicle Information</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      License Plate: <span className="font-medium">{selectedSpot.vehicle.licensePlate}</span>
                    </p>
                    <p className="flex items-center text-sm">
                      Entry Time: <span className="ml-1 font-medium">{formatDate(selectedSpot.vehicle.entryTime)}</span>
                    </p>
                    <p className="text-sm">
                      Duration: <span className="font-medium">{calculateDuration(selectedSpot.vehicle.entryTime)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
