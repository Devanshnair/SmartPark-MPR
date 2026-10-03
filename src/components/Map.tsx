"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api"
import { Map, useApiIsLoaded, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ChevronUp, Navigation, MapPin, MapPinIcon as MapPinCheck, ArrowLeft, Car, Star, Clock, ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useCustomDirectionsService,
  CustomDirectionsRenderer,
  type DirectionsResult,
  DirectionsPanel,
} from "@/components/custom-directions"
import { BASE_URL } from "@/App"

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"]

interface Viewport {
  latitude: number
  longitude: number
  zoom: number
}

export interface ParkingSpot {
  id: string | number;
  latitude?: number;
  longitude?: number;
  distance?: string;
  time?: string;
  available_slots?: number;
  owner?: {
    id: number;
    user?: {
      id: number;
      username: string;
      name: string;
      email: string;
    };
    parking_name: string;
    total_slots: number;
    hourlyRate: number;
    dailyRate: number;
    monthlyRate: number;
    openingHours: string;
    description: string;
    levels: number;
    address: string;
    rating: number;
    image_url: string;
    availableTypes: string;
  };
  name?: string;
  imageUrl?: string;
  address?: string;
  rating?: number;
  price?: string;
  availableSlots?: number;
  availableTypes?: string[];
  reviews?: number;
}

export const PARKING_SPOT: ParkingSpot[] = [
  {
    id: "1",
    latitude: 19.0760 + (Math.random() - 0.5) * 0.05,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.05,
    distance: "2.5 km",
    time: "10 mins",
    available_slots: 92,
    owner: {
      id: 1,
      parking_name: "Trios Fashion Mall Parking",
      total_slots: 150,
      hourlyRate: 50.0,
      dailyRate: 350.0,
      monthlyRate: 4000.0,
      openingHours: "24 hours",
      description: "Secure parking at Trios Fashion Mall",
      levels: 3,
      address: "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      rating: 4.2,
      image_url: "https://cdn11.bigcommerce.com/s-64cbb/product_images/uploaded_images/tgtechnicalservices-246300-parking-garage-safer-blogbanner1.jpg",
      availableTypes: "Compact, SUV, Bike"
    }
  },
  {
    id: "2",
    latitude: 19.0760 + (Math.random() - 0.5) * 0.05,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.05,
    distance: "4.0 km",
    time: "15 mins",
    available_slots: 1152,
    owner: {
      id: 2,
      parking_name: "Runwal Greens Parking",
      total_slots: 2000,
      hourlyRate: 60.0,
      dailyRate: 450.0,
      monthlyRate: 5000.0,
      openingHours: "6 AM - 11 PM",
      description: "Spacious parking at Runwal Greens with EV charging and security.",
      levels: 4,
      address: "GMLR Road, Nahur West, Mumbai, Maharashtra 400078",
      rating: 4.5,
      image_url: "https://www.adanirealty.com/-/media/project/realty/blogs/what-is-stilt-parking-meaning-rules-how-it-works.ashx",
      availableTypes: "Compact, SUV"
    }
  },
  {
    id: "3",
    latitude: 19.0760 + (Math.random() - 0.5) * 0.05,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.05,
    distance: "3.2 km",
    time: "12 mins",
    available_slots: 890,
    owner: {
      id: 3,
      parking_name: "Indiabulls Finance Center Parking",
      total_slots: 1200,
      hourlyRate: 70.0,
      dailyRate: 500.0,
      monthlyRate: 6000.0,
      openingHours: "7 AM - 10 PM",
      description: "Premium parking with valet service available",
      levels: 5,
      address: "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
      rating: 4.3,
      image_url: "https://raicdn.nl/cdn-cgi/image/width=3840,quality=75,format=auto,sharpen=1/https://edge.sitecorecloud.io/raiamsterda13f7-raidigitalpdb6c-productionf3f5-ef30/media/project/rai-amsterdam-xmc/intertraffic/intertraffic/news/2022/9/parkingshape1-550-x-300-px.png",
      availableTypes: "Compact, Bike"
    }
  },
  {
    id: "4",
    latitude: 19.0760 + (Math.random() - 0.5) * 0.05,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.05,
    distance: "2.8 km",
    time: "9 mins",
    available_slots: 553,
    owner: {
      id: 4,
      parking_name: "Kalpataru Avana Parking",
      total_slots: 800,
      hourlyRate: 55.0,
      dailyRate: 400.0,
      monthlyRate: 4500.0,
      openingHours: "6 AM - 12 AM",
      description: "Modern parking facility with 24/7 security",
      levels: 3,
      address: "Gen Nagesh Marg, Parel, Mumbai, Maharashtra 400012",
      rating: 4.1,
      image_url: "https://www.99acres.com/microsite/articles/files/2018/07/car-parking.jpg",
      availableTypes: "SUV, Bike"
    }
  },
  {
    id: "5",
    latitude: 19.0760 + (Math.random() - 0.5) * 0.05,
    longitude: 72.8777 + (Math.random() - 0.5) * 0.05,
    distance: "6.0 km",
    time: "20 mins",
    available_slots: 144,
    owner: {
      id: 5,
      parking_name: "MCGM Parking Lot Andheri",
      total_slots: 200,
      hourlyRate: 40.0,
      dailyRate: 300.0,
      monthlyRate: 3500.0,
      openingHours: "24 hours",
      description: "Municipal parking lot with affordable rates",
      levels: 2,
      address: "Jay Prakash Road, Andheri West, Mumbai, Maharashtra 400058",
      rating: 3.9,
      image_url: "https://raicdn.nl/cdn-cgi/image/width=3840,quality=75,format=auto,sharpen=1/https://edge.sitecorecloud.io/raiamsterda13f7-raidigitalpdb6c-productionf3f5-ef30/media/project/rai-amsterdam-xmc/intertraffic/intertraffic/news/2022/9/parkingshape1-550-x-300-px.png",
      availableTypes: "Compact"
    }
  }
];

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

const MarkerInfoWindow = ({ spot }: { spot: ParkingSpot }) => {
  const name = spot.owner?.parking_name || spot.name || "";
  const hourlyRate = spot.owner?.hourlyRate || spot.price || "";
  const address = spot.owner?.address || spot.address || "";
  const availableSlots = spot.available_slots || spot.availableSlots || 0;
  
  return (
    <div className="p-3 min-w-[220px]">
      <h3 className="font-semibold text-sm">{name}</h3>
      <div className="flex items-center text-xs text-gray-600 mt-1">
        <MapPin className="w-3 h-3 mr-1" />
        <span>{spot.distance}</span>
      </div>
      <div className="text-xs text-gray-600 mt-1 truncate">
        {address}
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="font-bold text-sm">₹{hourlyRate}/hr</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{availableSlots} spots</span>
      </div>
      <div className="mt-1 text-xs text-gray-600">
        {spot.owner?.openingHours || ""}
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
  const [fetchError, setFetchError] = useState<string | null>(null)

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const initialLocationState = location.state ? location.state : ""
  const isDesktop = window.innerWidth >= 1024 ? true : false
  const map = useMap()
  useEffect(() => {
    if (map) {
      mapRef.current = map
    }
  }, [map])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  })

  const apiIsLoaded = useApiIsLoaded()

  const { getDirections, isLoaded: isDirectionsServiceLoaded } = useCustomDirectionsService()

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  };

  const { data: parkingSpots, isLoading: isLoadingSpots } = useQuery({
    queryKey: ["parkingSpots", selectedPlace?.place_id],
    queryFn: async () => {
      if (!selectedPlace) return []

      await new Promise((resolve) => setTimeout(resolve, 500))

      try {
        const lat = selectedPlace.geometry?.location?.lat()
        const lng = selectedPlace.geometry?.location?.lng()

        const response = await fetch(`${BASE_URL}/reservation/parking-area?lat=${lat}&lng=${lng}`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "ngrok-skip-browser-warning": "true",
          }
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No parking spots returned from API')
        }
        
        return data.map(spot => {
          if (!spot.distance && spot.latitude && spot.longitude && lat && lng) {
            const distance = calculateDistance(lat, lng, spot.latitude, spot.longitude);
            const time = Math.round(distance * 3);
            
            return {
              ...spot,
              distance: `${distance.toFixed(1)} km`,
              time: `${time} mins`
            };
          }
          return spot;
        }).sort((a, b) => {
          const distA = parseFloat((a.distance || "0").replace(" km", ""))
          const distB = parseFloat((b.distance || "0").replace(" km", ""))
          return distA - distB
        });
      } catch (error) {
        console.error("Error fetching parking spots:", error)
        setFetchError(error instanceof Error ? error.message : 'Unknown error')
        
        return PARKING_SPOT.sort((a, b) => {
          const distA = parseFloat((a.distance || "0").replace(" km", ""))
          const distB = parseFloat((b.distance || "0").replace(" km", ""))
          return distA - distB
        })
      }
    },
    enabled: !!selectedPlace,
  })

  const centerOnSpot = useCallback(
    (spot: ParkingSpot) => {
      if (map && spot.latitude && spot.longitude) {
        map.panTo({ lat: spot.latitude, lng: spot.longitude })
        map.setZoom(16)
        setSelectedSpot(spot)
        setOpenInfoWindow(String(spot.id))

        if (!isDesktop) {
          setDrawerOpen(false)
        }
      }
    },
    [map, isDesktop],
  )

  const handleGetDirections = useCallback(
    async (spot: ParkingSpot) => {
      if (!isDirectionsServiceLoaded || !spot.latitude || !spot.longitude) return

      setIsTransitioning(true)

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
        const result = await getDirections({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        })

        if (result) {
          setTimeout(() => {
            setDirectionsResult(result)

            if (result.routes && result.routes.length > 1) {
              const alternatives: DirectionsResult[] = []

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

            if (!isDesktop) {
              setDrawerOpen(false)
            }
          }, 1000)
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

        setShowDirections(false)
        setDirectionsResult(null)
        setShowDirectionsPanel(false)
        setMapMode("search")

        if (!isDesktop) {
          setDrawerOpen(true)
        }
      }
    }
  }

  const handleSearch = async () => {
    if (searchValue.trim()) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }
  }

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

  useEffect(() => {
    if (initialLocationState) {
      if (typeof initialLocationState === "object" && initialLocationState.searchQuery) {
        setSearchValue(initialLocationState.searchQuery)

        if (isLoaded && window.google) {
          setLoading(true)

          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ address: initialLocationState.searchQuery }, (results: any, status: any) => {
            if (status === "OK" && results && results[0]) {
              const place = results[0]

              const placeResult = {
                formatted_address: initialLocationState.searchQuery,
                geometry: {
                  location: place.geometry.location,
                },
                place_id: place.place_id,
              } as google.maps.places.PlaceResult

              setSelectedPlace(placeResult)

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
      else if (typeof initialLocationState === "string") {
        setSearchValue(initialLocationState)
      }

      navigate(location.pathname, { replace: true, state: null })
    }
  }, [initialLocationState, navigate, location.pathname, isLoaded])

  if (!isLoaded || !apiIsLoaded)
    return <div className="h-screen w-screen flex items-center justify-center">Loading Map...</div>

  return (
    <div className="h-screen w-screen relative overflow-hidden">
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

      <Map
        defaultZoom={newLocation ? newLocation.zoom : 12}
        defaultCenter={
          newLocation ? { lat: newLocation.latitude, lng: newLocation.longitude } : { lat: 19.076, lng: 72.8777 }
        }
        gestureHandling="greedy"
        disableDefaultUI={true}
        className="h-full w-full"
        mapId={mapMode === "search" ? import.meta.env.VITE_DEFAULT_MAP_ID : import.meta.env.VITE_DEFAULT_MAP_ID}
      >
        {mapMode === "search" &&
          parkingSpots?.map((spot) => (
            <AdvancedMarker 
              key={spot.id} 
              position={{ 
                lat: spot.latitude!, 
                lng: spot.longitude! 
              }} 
              title={spot.owner?.parking_name || spot.name || ""}
            >
              <ParkingMarker
                spot={spot}
                isSelected={selectedSpot?.id === spot.id}
                onClick={() => {
                  setSelectedSpot(spot)
                  setOpenInfoWindow(String(spot.id) === openInfoWindow ? null : String(spot.id))
                }}
              />

              {openInfoWindow === String(spot.id) && (
                <InfoWindow
                  position={{ lat: spot.latitude!, lng: spot.longitude! }}
                  onCloseClick={() => setOpenInfoWindow(null)}
                >
                  <MarkerInfoWindow spot={spot} />
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}

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

      {isDesktop ? (
        <div className="absolute top-0 left-0 h-full z-10 flex flex-col">
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

          {mapMode === "directions" && (
            <div className="px-4 mb-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleBackToSearch}>
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
          )}

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
                      }}}
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

          {mapMode === "directions" && alternativeRoutes.length > 0 && (
            <div className="bg-white/95 backdrop-blur-sm w-[400px] max-h-[calc(100vh-100px)] overflow-y-auto p-4 m-4 mt-0 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Directions to {selectedSpot?.name}</h2>
                <Button variant="ghost" size="sm" onClick={handleBackToSearch}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

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
                            }}}
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

          {mapMode === "directions" && (
            <div className="px-4 mb-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleBackToSearch}>
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
            </div>
          )}

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
                          }}}
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

          {mapMode === "directions" && alternativeRoutes.length > 0 && (
            <Drawer open={showDirectionsPanel} onOpenChange={setShowDirectionsPanel}>
              <DrawerTrigger asChild>
                <Button
                  variant="secondary"
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-lg flex items-center gap-2"
                >
                  <span>{showDirectionsPanel ? "Close Directions" : "View Directions"}</span>
                  <ChevronUp className={cn("w-4 h-4 transition-transform", showDirectionsPanel && "rotate-180")} />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Directions to {selectedSpot?.name}</h2>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="sm" onClick={handleBackToSearch}>
                        <X className="w-4 h-4" />
                      </Button>
                    </DrawerClose>
                  </div>

                  <Tabs
                    defaultValue="0"
                    value={selectedRouteIndex.toString()}
                    onValueChange={(value) => setSelectedRouteIndex(Number.parseInt(value))}
                    className="mb-4"
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

                    <div className="overflow-y-auto">
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
              </DrawerContent>
            </Drawer>
          )}
        </div>
      )}
    </div>
  )
}

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

  const name = spot.owner?.parking_name || spot.name || "";
  const address = spot.owner?.address || spot.address || "";
  const hourlyRate = spot.owner?.hourlyRate || spot.price || "";
  const rating = spot.owner?.rating || spot.rating || 0;
  const availableSlots = spot.available_slots || spot.availableSlots || 0;
  const imageUrl = spot.owner?.image_url || spot.imageUrl || "";
  const availableTypes = spot.owner?.availableTypes ? 
    spot.owner.availableTypes.split(", ").filter(Boolean) : 
    spot.availableTypes || [];

  const truncateAddress = (addr: string) => {
    return addr.length > 35 ? addr.substring(0, 35) + "..." : addr
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
          <div className="w-1/4">
            <img
              src={imageUrl || "/placeholder.svg?height=100&width=100"}
              alt={name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>

          <div className="w-3/4 flex flex-col gap-1">
            <div className="flex gap-2 mb-1 flex-wrap">
              {availableTypes.length > 0 && availableTypes.map((type) => (
                <span key={type} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 max-[500px]:text-sm">{name}</h3>

            <p className="text-gray-500 text-sm mb-2 max-[500px]:hidden">{truncateAddress(address)}</p>
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

        <div className="flex items-center gap-2 pt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-300 fill-yellow-300" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({spot.reviews || 0} reviews)</span>
        </div>

        <div className="flex items-center font-semibold justify-between pt-3 ">
          <div className="flex justify-center items-center gap-10 max-[500px]:text-sm">
            <span className="">₹{hourlyRate}/hr</span>
            <span className="flex justify-center items-center gap-1 text-sm">
              <Car className="h-5 w-5" /> {availableSlots} available
            </span>
          </div>
          <div className="flex justify-center items-center gap-3">
            <MapPinCheck className="text-slate-800 hover:text-blue-600 cursor-pointer" onClick={onViewMap} />
            <Navigation className="text-slate-800 hover:text-blue-600 cursor-pointer" onClick={onGetDirections} />
            <motion.button
              className="relative px-1 py-1 max-[500px]:size-8 size-9 bg-blue-700 text-white rounded-full overflow-hidden flex justify-center items-center gap-2 cursor-pointer"
              whileHover="hover"
              initial="initial"
              onClick={() => navigate(`/parkingprofile/${spot.id}`)}
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
            src={imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold">{name}</CardTitle>
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
            <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-lg font-semibold">
            ₹{hourlyRate}/hr
          </Badge>
          <div className="flex items-center text-muted-foreground">
            <Car className="w-4 h-4 mr-1" />
            <span className="text-sm">{availableSlots} spots left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="default" className="w-[48%]" onClick={() => navigate(`/parkingprofile/${spot.id}`)}>
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

