"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Clock, Filter } from "lucide-react"

// Sample parking space data
const parkingData = {
  totalSpots: 120,
  occupiedSpots: 78,
  reservedSpots: 15,
  availableSpots: 27,
  floors: [
    {
      id: 1,
      name: "Ground Floor",
      totalSpots: 40,
      spots: Array(40)
        .fill(null)
        .map((_, i) => ({
          id: `G${i + 1}`,
          status: Math.random() > 0.3 ? "occupied" : "available",
          type: Math.random() > 0.8 ? "handicap" : "standard",
          vehicle:
            Math.random() > 0.3
              ? {
                  licensePlate: `ABC${Math.floor(Math.random() * 1000)}`,
                  entryTime: new Date(Date.now() - Math.random() * 10000000).toISOString(),
                }
              : null,
        })),
    },
    {
      id: 2,
      name: "Level 1",
      totalSpots: 40,
      spots: Array(40)
        .fill(null)
        .map((_, i) => ({
          id: `L1-${i + 1}`,
          status: Math.random() > 0.4 ? "occupied" : "available",
          type: Math.random() > 0.8 ? "handicap" : "standard",
          vehicle:
            Math.random() > 0.4
              ? {
                  licensePlate: `XYZ${Math.floor(Math.random() * 1000)}`,
                  entryTime: new Date(Date.now() - Math.random() * 10000000).toISOString(),
                }
              : null,
        })),
    },
    {
      id: 3,
      name: "Level 2",
      totalSpots: 40,
      spots: Array(40)
        .fill(null)
        .map((_, i) => ({
          id: `L2-${i + 1}`,
          status: Math.random() > 0.35 ? "occupied" : "available",
          type: Math.random() > 0.8 ? "handicap" : "standard",
          vehicle:
            Math.random() > 0.35
              ? {
                  licensePlate: `DEF${Math.floor(Math.random() * 1000)}`,
                  entryTime: new Date(Date.now() - Math.random() * 10000000).toISOString(),
                }
              : null,
        })),
    },
  ],
}

export default function ParkingSpaceOverview() {
  const [selectedFloor, setSelectedFloor] = useState(parkingData.floors[0].id)
  const [filter, setFilter] = useState("all")

  const currentFloor = parkingData.floors.find((floor) => floor.id === selectedFloor)

  const filteredSpots = currentFloor?.spots.filter((spot) => {
    if (filter === "all") return true
    if (filter === "available") return spot.status === "available"
    if (filter === "occupied") return spot.status === "occupied"
    if (filter === "handicap") return spot.type === "handicap"
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parking Space Overview</h1>
        <p className="text-muted-foreground">Real-time visualization of your parking space</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingData.totalSpots}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingData.occupiedSpots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((parkingData.occupiedSpots / parkingData.totalSpots) * 100)}% occupancy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingData.reservedSpots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((parkingData.reservedSpots / parkingData.totalSpots) * 100)}% reserved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingData.availableSpots}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((parkingData.availableSpots / parkingData.totalSpots) * 100)}% available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={selectedFloor.toString()}
              onValueChange={(value) => setSelectedFloor(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                {parkingData.floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id.toString()}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{currentFloor?.totalSpots} spots</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="occupied">Occupied</TabsTrigger>
                <TabsTrigger value="handicap">Handicap</TabsTrigger>
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
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-10">
              {filteredSpots?.map((spot) => (
                <Button
                  key={spot.id}
                  variant="outline"
                  className={`h-16 w-full p-1 ${
                    spot.status === "occupied"
                      ? "border-destructive bg-destructive/10 hover:bg-destructive/20"
                      : "border-primary bg-primary/10 hover:bg-primary/20"
                  } ${spot.type === "handicap" ? "relative overflow-hidden" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-medium">{spot.id}</span>
                    {spot.status === "occupied" && <Car className="h-4 w-4 text-destructive" />}
                  </div>
                  {spot.type === "handicap" && (
                    <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </Button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary/50"></div>
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/50"></div>
                <span className="text-xs">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Handicap</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spot Details</CardTitle>
            <CardDescription>Information about selected parking spot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium">Spot L1-12</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={Math.random() > 0.5 ? "destructive" : "default"}>
                      {Math.random() > 0.5 ? "Occupied" : "Available"}
                    </Badge>
                    {Math.random() > 0.7 && <Badge variant="outline">Handicap</Badge>}
                  </div>
                </div>

                {Math.random() > 0.5 && (
                  <div>
                    <h4 className="font-medium">Vehicle Information</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        License Plate: <span className="font-medium">ABC123</span>
                      </p>
                      <p className="flex items-center text-sm">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        Entry Time: <span className="ml-1 font-medium">Today, 10:30 AM</span>
                      </p>
                      <p className="text-sm">
                        Duration: <span className="font-medium">2h 15m</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

