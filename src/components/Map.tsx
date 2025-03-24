"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api"
import { Map, useApiIsLoaded, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ChevronUp, Navigation, MapPin, MapPinIcon as MapPinCheck, ArrowLeft, Car, Star, Clock, ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { PARKING_SPOTS, type ParkingSpot } from "@/data/parking-spots"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { useMediaQuery } from "@/hooks/use-media-query"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useCustomDirectionsService,
  CustomDirectionsRenderer,
  type DirectionsResult,
  DirectionsPanel,
} from "@/components/custom-directions"

const libraries = ["places"] as const

interface Viewport {
  latitude: number
  longitude: number
  zoom: number
}

// Enhanced parking spots with coordinates
const ENHANCED_PARKING_SPOTS = PARKING_SPOTS.map((spot, index) => {
  // Generate coordinates around Mumbai (19.0760° N, 72.8777° E)
  // This is just for demo purposes - in a real app, you'd have actual coordinates
  const baseLatitude = 19.076
  const baseLongitude = 72.8777

  // Create a small offset based on the index to spread markers around
  const latOffset = (Math.random() - 0.5) * 0.05
  const lngOffset = (Math.random() - 0.5) * 0.05

  return {
    ...spot,
    latitude: baseLatitude + latOffset,
    longitude: baseLongitude + lngOffset,
  }
})

// Custom marker component for parking spots
const ParkingMarker = ({
  spot,
  isSelected,
  onClick,
}: {
  spot: ParkingSpot
  isSelected: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center cursor-pointer transform transition-transform duration-200",
        isSelected ? "scale-125" : "hover:scale-110",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shadow-md",
          isSelected ? "bg-blue-600" : "bg-white",
        )}
      >
        <MapPin className={cn("w-5 h-5", isSelected ? "text-white" : "text-blue-600")} />
      </div>
      {isSelected && <div className="w-2 h-2 bg-blue-600 rotate-45 -mt-1"></div>}
    </div>
  )
}

// Custom info window content
const MarkerInfoWindow = ({ spot }: { spot: ParkingSpot }) => {
  return (
    <div className="p-2 min-w-[200px]">
      <h3 className="font-semibold text-sm">{spot.name}</h3>
      <div className="flex items-center text-xs text-gray-600 mt-1">
        <MapPin className="w-3 h-3 mr-1" />
        <span>{spot.distance}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="font-bold text-sm">₹{spot.price}/hr</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{spot.availableSlots} spots</span>
      </div>
    </div>
  )
}

const MapComponent: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [newLocation, setNewLocation] = useState<Viewport | null>(null)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null)
  const [openInfoWindow, setOpenInfoWindow] = useState<string | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [directionsResult, setDirectionsResult] = useState<DirectionsResult | null>(null)
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false)
  const [mapMode, setMapMode] = useState<"search" | "directions">("search")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [alternativeRoutes, setAlternativeRoutes] = useState<DirectionsResult[]>([])

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const initialLocationState = location.state ? location.state : ""
  const isDesktop = window.innerWidth >= 1024 ? true : false
  const map = useMap()

  // Load the Google Maps API with the Places library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  })

  // Check if the vis.gl map API is ready
  const apiIsLoaded = useApiIsLoaded()

  // Get custom directions service
  const { getDirections, isLoaded: isDirectionsServiceLoaded } = useCustomDirectionsService()

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    }
  }, [])

  // Fetch parking spots data using TanStack Query
  const { data: parkingSpots, isLoading: isLoadingSpots } = useQuery({
    queryKey: ["parkingSpots", selectedPlace?.place_id],
    queryFn: async () => {
      // In a real app, we would fetch data from an API based on the selected place
      // For now, we'll use the dummy data and sort by distance
      if (!selectedPlace) return []

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Sort spots by distance (assuming distance is in format "X.X km")
      return [...ENHANCED_PARKING_SPOTS].sort((a, b) => {
        const distA = Number.parseFloat(a.distance?.replace(" km", "") || "0")
        const distB = Number.parseFloat(b.distance?.replace(" km", "") || "0")
        return distA - distB
      })
    },
    enabled: !!selectedPlace,
  })

  // Function to center map on a specific parking spot
  const centerOnSpot = useCallback(
    (spot: ParkingSpot) => {
      if (map && spot.latitude && spot.longitude) {
        map.panTo({ lat: spot.latitude, lng: spot.longitude })
        map.setZoom(16)
        setSelectedSpot(spot)
        setOpenInfoWindow(spot.id)

        // Close the drawer on mobile after centering
        if (!isDesktop) {
          setDrawerOpen(false)
        }
      }
    },
    [map, isDesktop],
  )

  // Function to get directions to a parking spot with alternative routes
  const handleGetDirections = useCallback(
    async (spot: ParkingSpot) => {
      if (!isDirectionsServiceLoaded || !spot.latitude || !spot.longitude) return

      // Start transition to directions mode
      setIsTransitioning(true)

      // Use search location or user location as origin
      const origin = selectedPlace?.geometry?.location
        ? {
            lat: selectedPlace.geometry.location.lat(),
            lng: selectedPlace.geometry.location.lng(),
          }
        : userLocation

      if (!origin) {
        setIsTransitioning(false)
        alert("Please enter a starting location or allow location access")
        return
      }

      const destination = { lat: spot.latitude, lng: spot.longitude }

      try {
        // Request directions with alternatives
        const result = await getDirections({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        })

        if (result) {
          // Wait for transition effect
          setTimeout(() => {
            setDirectionsResult(result)

            // Store alternative routes if available
            if (result.routes && result.routes.length > 1) {
              const alternatives: DirectionsResult[] = []

              // Create separate DirectionsResult objects for each route
              result.routes.forEach((route, index) => {
                const altResult = { ...result, routes: [route] }
                alternatives.push(altResult)
              })

              setAlternativeRoutes(alternatives)
            } else {
              setAlternativeRoutes([result])
            }

            setSelectedRouteIndex(0)
            setShowDirections(true)
            setSelectedSpot(spot)
            setShowDirectionsPanel(true)
            setMapMode("directions")
            setIsTransitioning(false)

            // Close the drawer on mobile after showing directions
            if (!isDesktop) {
              setDrawerOpen(false)
            }
          }, 1000) // 1 second transition delay
        } else {
          setIsTransitioning(false)
        }
      } catch (error) {
        console.error("Error getting directions:", error)
        setIsTransitioning(false)
      }
    },
    [getDirections, isDirectionsServiceLoaded, selectedPlace, userLocation, isDesktop],
  )

  // Combined function to handle place selection from Autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace()
    if (place) {
      if (place.formatted_address) {
        setSearchValue(place.formatted_address)
        setSelectedPlace(place)
      }
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setNewLocation({
          latitude: lat,
          longitude: lng,
          zoom: 14,
        })

        // Reset directions when a new place is selected
        setShowDirections(false)
        setDirectionsResult(null)
        setShowDirectionsPanel(false)
        setMapMode("search")

        // Open drawer on mobile/tablet when a place is selected
        if (!isDesktop) {
          setDrawerOpen(true)
        }
      }
    }
  }

  // Simulated search functionality
  const handleSearch = async () => {
    if (searchValue.trim()) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }
  }

  // Clear search and results
  const handleClearSearch = () => {
    setSearchValue("")
    setSelectedPlace(null)
    setShowDirections(false)
    setDirectionsResult(null)
    setSelectedSpot(null)
    setOpenInfoWindow(null)
    setDrawerOpen(false)
    setShowDirectionsPanel(false)
    setMapMode("search")
    setAlternativeRoutes([])
  }

  // Return to search mode from directions mode
  const handleBackToSearch = () => {
    setIsTransitioning(true)

    setTimeout(() => {
      setShowDirections(false)
      setDirectionsResult(null)
      setShowDirectionsPanel(false)
      setMapMode("search")
      setAlternativeRoutes([])
      setIsTransitioning(false)
    }, 1000)
  }

  // useEffect to check for navigation state and trigger a search if available
  useEffect(() => {
    if (initialLocationState) {
      // If state is an object with searchQuery property (from Hero.tsx)
      if (typeof initialLocationState === "object" && initialLocationState.searchQuery) {
        setSearchValue(initialLocationState.searchQuery)

        // Wait for Google Maps API to be fully loaded
        if (isLoaded && window.google) {
          // We need to manually trigger a search since we don't have a proper place object
          setLoading(true)

          // Use geocoding to get place details from the search query
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ address: initialLocationState.searchQuery }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const place = results[0]

              // Create a simplified place result
              const placeResult = {
                formatted_address: initialLocationState.searchQuery,
                geometry: {
                  location: place.geometry.location,
                },
                place_id: place.place_id,
              } as google.maps.places.PlaceResult

              setSelectedPlace(placeResult)

              // Set new location based on the geocoded result
              const lat = place.geometry.location.lat()
              const lng = place.geometry.location.lng()
              setNewLocation({
                latitude: lat,
                longitude: lng,
                zoom: 14,
              })
            }
            setLoading(false)
          })
        }
      }
      // If state is a string (direct value)
      else if (typeof initialLocationState === "string") {
        setSearchValue(initialLocationState)
      }

      // Clear the navigation state so that the search won't re-run on refresh
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [initialLocationState, navigate, location.pathname, isLoaded])

  // Ensure that both Google Maps and vis.gl APIs are loaded before rendering
  if (!isLoaded || !apiIsLoaded)
    return <div className="h-screen w-screen flex items-center justify-center">Loading Map...</div>

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Loading overlay during map transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{
                rotate: 360,
                transition: {
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map */}
      <Map
        defaultZoom={newLocation ? newLocation.zoom : 12}
        defaultCenter={
          newLocation ? { lat: newLocation.latitude, lng: newLocation.longitude } : { lat: 19.076, lng: 72.8777 } // Mumbai coordinates as default
        }
        gestureHandling="greedy"
        disableDefaultUI={true}
        className="h-full w-full"
        onLoad={(map) => {
          mapRef.current = map
        }}
        mapId={mapMode === "search" ? import.meta.env.VITE_DEFAULT_MAP_ID : import.meta.env.VITE_DEFAULT_MAP_ID}
      >
        {/* Render parking spot markers in search mode */}
        {mapMode === "search" &&
          parkingSpots?.map((spot) => (
            <AdvancedMarker key={spot.id} position={{ lat: spot.latitude!, lng: spot.longitude! }} title={spot.name}>
              <ParkingMarker
                spot={spot}
                isSelected={selectedSpot?.id === spot.id}
                onClick={() => {
                  setSelectedSpot(spot)
                  setOpenInfoWindow(openInfoWindow === spot.id ? null : spot.id)
                }}
              />

              {/* Info window for the marker */}
              {openInfoWindow === spot.id && (
                <InfoWindow
                  position={{ lat: spot.latitude!, lng: spot.longitude! }}
                  onCloseClick={() => setOpenInfoWindow(null)}
                >
                  <MarkerInfoWindow spot={spot} />
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}

        {/* Render directions if available */}
        {mapMode === "directions" && showDirections && alternativeRoutes.length > 0 && (
          <CustomDirectionsRenderer
            directions={alternativeRoutes[selectedRouteIndex]}
            options={{
              polylineOptions: {
                strokeColor: "#4361ee",
                strokeWeight: 5,
                strokeOpacity: 1,
              },
              suppressMarkers: false,
            }}
          />
        )}
      </Map>

      {/* Desktop Layout */}
      {isDesktop ? (
        <div className="absolute top-0 left-0 h-full z-10 flex flex-col">
          {/* Search Bar */}
          <div className="p-4">
            {isLoaded && (
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for parking locations..."
                    className="w-[400px] px-4 py-3 pr-12 rounded-lg bg-white shadow-md border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {searchValue && (
                      <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    {loading ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                          className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                          animate={{
                            rotate: 360,
                            transition: {
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            },
                          }}
                        />
                      </motion.div>
                    ) : (
                      <Search
                        className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer"
                        onClick={handleSearch}
                      />
                    )}
                  </div>
                </div>
              </Autocomplete>
            )}
          </div>

          {/* Back button in directions mode */}
          {mapMode === "directions" && (
            <div className="px-4 mb-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleBackToSearch}>
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
          )}

          {/* Parking Spots List */}
          {selectedPlace && mapMode === "search" && (
            <div className="bg-white/95 backdrop-blur-sm w-[400px] max-h-[calc(100vh-100px)] overflow-y-auto p-4 m-4 mt-0 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Nearby Parking Spots</h2>
              {isLoadingSpots ? (
                <div className="flex justify-center py-8">
                  <motion.div
                    className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {parkingSpots?.map((spot) => (
                    <EnhancedParkingSpotCard
                      key={spot.id}
                      spot={spot}
                      layout="horizontal"
                      onViewMap={() => centerOnSpot(spot)}
                      onGetDirections={() => handleGetDirections(spot)}
                      isSelected={selectedSpot?.id === spot.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Directions Panel with Alternative Routes */}
          {mapMode === "directions" && alternativeRoutes.length > 0 && (
            <div className="bg-white/95 backdrop-blur-sm w-[400px] max-h-[calc(100vh-100px)] overflow-y-auto p-4 m-4 mt-0 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Directions to {selectedSpot?.name}</h2>
                <Button variant="ghost" size="sm" onClick={handleBackToSearch}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Alternative Routes Tabs */}
              <Tabs
                defaultValue="0"
                value={selectedRouteIndex.toString()}
                onValueChange={(value) => setSelectedRouteIndex(Number.parseInt(value))}
                className="mb-4"
              >
                <TabsList className="w-full">
                  {alternativeRoutes.map((_, index) => {
                    const route = alternativeRoutes[index].routes[0]
                    const duration = route.legs[0].duration?.text || ""
                    return (
                      <TabsTrigger key={index} value={index.toString()} className="flex-1">
                        Route {index + 1} ({duration})
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {alternativeRoutes.map((route, index) => (
                  <TabsContent key={index} value={index.toString()}>
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{route.routes[0].summary}</p>
                          <p className="text-sm text-gray-600">
                            {route.routes[0].legs[0].distance?.text} · {route.routes[0].legs[0].duration?.text}
                          </p>
                        </div>
                        <Badge variant={index === selectedRouteIndex ? "default" : "outline"}>
                          {index === selectedRouteIndex ? "Selected" : "Select"}
                        </Badge>
                      </div>
                    </div>
                    <DirectionsPanel directions={route} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        /* Mobile/Tablet Layout */
        <div className="absolute top-0 left-0 w-full z-10">
          <div className="p-4">
            {isLoaded && (
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for parking locations..."
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white shadow-md border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {searchValue && (
                      <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    {loading ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div
                          className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                          animate={{
                            rotate: 360,
                            transition: {
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            },
                          }}
                        />
                      </motion.div>
                    ) : (
                      <Search
                        className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer"
                        onClick={handleSearch}
                      />
                    )}
                  </div>
                </div>
              </Autocomplete>
            )}
          </div>

          {/* Back button in directions mode */}
          {mapMode === "directions" && (
            <div className="px-4 mb-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleBackToSearch}>
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
          )}

          {/* Mobile Drawer - Fixed to be properly adjustable */}
          {selectedPlace && mapMode === "search" && (
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="secondary"
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-lg flex items-center gap-2"
                >
                  <span>{drawerOpen ? "Close" : "View Parking Spots"}</span>
                  <ChevronUp className={cn("w-4 h-4 transition-transform", drawerOpen && "rotate-180")} />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Nearby Parking Spots</h2>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4"/>
                      </Button>
                    </DrawerClose>
                  </div>
                  {isLoadingSpots ? (
                    <div className="flex justify-center py-8">
                      <motion.div
                        className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
                        animate={{
                          rotate: 360,
                          transition: {
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
                      {parkingSpots?.map((spot) => (
                        <EnhancedParkingSpotCard
                          key={spot.id}
                          spot={spot}
                          layout="vertical"
                          onViewMap={() => centerOnSpot(spot)}
                          onGetDirections={() => handleGetDirections(spot)}
                          isSelected={selectedSpot?.id === spot.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {/* Mobile Directions Panel with Alternative Routes */}
          {mapMode === "directions" && alternativeRoutes.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-xl z-50 max-h-[70vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                <h2 className="text-lg font-semibold">Directions to {selectedSpot?.name}</h2>
                <Button variant="ghost" size="sm" onClick={handleBackToSearch}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Alternative Routes Tabs */}
              <Tabs
                defaultValue="0"
                value={selectedRouteIndex.toString()}
                onValueChange={(value) => setSelectedRouteIndex(Number.parseInt(value))}
                className="p-4"
              >
                <TabsList className="w-full mb-4">
                  {alternativeRoutes.map((_, index) => {
                    const route = alternativeRoutes[index].routes[0]
                    const duration = route.legs[0].duration?.text || ""
                    return (
                      <TabsTrigger key={index} value={index.toString()} className="flex-1">
                        Route {index + 1} ({duration})
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                <div className="overflow-y-auto max-h-[calc(70vh-120px)]">
                  {alternativeRoutes.map((route, index) => (
                    <TabsContent key={index} value={index.toString()}>
                      <div className="bg-blue-50 p-3 rounded-md mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{route.routes[0].summary}</p>
                            <p className="text-sm text-gray-600">
                              {route.routes[0].legs[0].distance?.text} · {route.routes[0].legs[0].duration?.text}
                            </p>
                          </div>
                          <Badge variant={index === selectedRouteIndex ? "default" : "outline"}>
                            {index === selectedRouteIndex ? "Selected" : "Select"}
                          </Badge>
                        </div>
                      </div>
                      <DirectionsPanel directions={route} />
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Enhanced ParkingSpotCard with additional functionality
const EnhancedParkingSpotCard = ({
  spot,
  layout,
  onViewMap,
  onGetDirections,
  isSelected,
}: {
  spot: ParkingSpot
  layout: "horizontal" | "vertical"
  onViewMap: () => void
  onGetDirections: () => void
  isSelected?: boolean
}) => {
  const navigate = useNavigate()

  const truncateAddress = (address: string) => {
    return address.length > 35 ? address.substring(0, 35) + "..." : address
  }

  if (layout === "horizontal") {
    return (
      <div
        className={cn(
          "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden p-4",
          isSelected && "ring-2 ring-blue-500",
        )}
      >
        <div className="flex gap-4">
          {/* Left side - Image */}
          <div className="w-1/4">
            <img
              src={spot.imageUrl || "/placeholder.svg?height=100&width=100"}
              alt={spot.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>

          {/* Right side - Details */}
          <div className="w-3/4 flex flex-col gap-1">
            {/* Vehicle Types */}
            <div className="flex gap-2 mb-1">
              {spot.availableTypes?.map((type) => (
                <span key={type} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 max-[500px]:text-sm">{spot.name}</h3>

            {/* Address */}
            <p className="text-gray-500 text-sm mb-2 max-[500px]:hidden">{truncateAddress(spot.address || "")}</p>
            <div className="flex items-center justify-between max-[500px]:gap-4 gap-8 mb-2 w-fit text-gray-500 max-[500px]:text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{spot.distance}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{spot.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 pt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(spot.rating) ? "text-yellow-300 fill-yellow-300" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({spot.reviews || 0} reviews)</span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center font-semibold justify-between pt-3 ">
          <div className="flex justify-center items-center gap-10 max-[500px]:text-sm">
            <span className="">₹{spot.price}/hr</span>
            <span className="flex justify-center items-center gap-1 text-sm">
              <Car className="h-5 w-5" /> {spot.availableSlots} available
            </span>
          </div>
          <div className="flex justify-center items-center gap-3">
            <MapPinCheck className="text-slate-800 hover:text-blue-600 cursor-pointer" onClick={onViewMap} />
            <Navigation className="text-slate-800 hover:text-blue-600 cursor-pointer" onClick={onGetDirections} />
            <motion.button
              className="relative px-1 py-1 max-[500px]:size-8 size-9 bg-blue-700 text-white rounded-full overflow-hidden flex justify-center items-center gap-2 cursor-pointer"
              whileHover="hover"
              initial="initial"
              onClick={() => navigate(`/parking-spots/${spot.id}`)}
            >
              <motion.div
                variants={{
                  initial: { x: 0 },
                  hover: { x: [0, 100, -100, 0] },
                }}
                transition={{
                  duration: 0.6,
                  times: [0, 0.3, 0.3, 1],
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="max-[500px]:size-5 size-6" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  // Vertical Card
  return (
    <Card
      className={cn(
        "w-full max-w-sm mx-auto overflow-hidden transition-shadow hover:shadow-lg",
        isSelected && "ring-2 ring-blue-500",
      )}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <img
            src={spot.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={spot.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold">{spot.name}</CardTitle>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{spot.distance}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{spot.time}</span>
          </div>
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < spot.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">({spot.rating})</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-lg font-semibold">
            ₹{spot.price}/hr
          </Badge>
          <div className="flex items-center text-muted-foreground">
            <Car className="w-4 h-4 mr-1" />
            <span className="text-sm">{spot.availableSlots} spots left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="default" className="w-[48%]" onClick={() => navigate(`/parking-spots/${spot.id}`)}>
          Book Now
        </Button>
        <Button variant="outline" className="w-[48%]" onClick={onViewMap}>
          View on Map
        </Button>
      </CardFooter>
      <div className="px-4 pb-4">
        <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={onGetDirections}>
          <Navigation className="w-4 h-4" />
          Get Directions
        </Button>
      </div>
    </Card>
  )
}

export default MapComponent

