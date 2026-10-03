"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckIcon,
  ImageIcon,
} from "lucide-react"
import { format } from "date-fns"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { BASE_URL } from "@/App"

// Type definitions for parking data
interface ParkingOwner {
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

interface ParkingArea {
  id: number
  latitude: number
  longitude: number
  owner: ParkingOwner
  available_slots: number
}

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  userAvatar?: string
}

// Fallback parking space data based on the backend schema
const createFallbackData = (): ParkingArea => ({
  id: 1,
  latitude: 0.0,
  longitude: 0.0,
  owner: {
    id: 1,
    user: {
      id: 1,
      username: "parkingadmin",
      name: "City Center Parking Admin",
      email: "admin@citycenterparking.com",
    },
    parking_name: "City Center Parking",
    total_slots: 120,
    hourlyRate: 60.0,
    dailyRate: 600.0,
    monthlyRate: 5000.0,
    openingHours: "24/7",
    description:
      "Located in the heart of downtown, City Center Parking offers secure, 24/7 parking with state-of-the-art surveillance systems. Our facility features both covered and open-air parking options, EV charging stations, and easy access to major attractions.",
    levels: 3,
    address: "123 Main St, Downtown, Metropolis",
    rating: 4.2,
    image_url: "",
    availableTypes: "Covered EV Wheelchair Monthly Mobile",
  },
  available_slots: 45,
})

// Static reviews data since it's not coming from backend
const staticReviews: Review[] = [
  {
    id: "1",
    userId: "user123",
    userName: "Priya Sharma",
    rating: 5,
    comment:
      "Very convenient location and reasonable rates. The security is excellent and I feel safe parking here even late at night.",
    date: "2024-03-15",
    userAvatar: "/avatars/user1.jpg",
  },
  {
    id: "2",
    userId: "user456",
    userName: "Raj Patel",
    rating: 4,
    comment: "Good parking facility in the heart of the city. Spots are a bit tight but overall good experience.",
    date: "2024-02-22",
    userAvatar: "/avatars/user2.jpg",
  },
  {
    id: "3",
    userId: "user789",
    userName: "Anita Desai",
    rating: 3,
    comment: "Average experience. Sometimes it gets full during peak hours. Wish they had a better reservation system.",
    date: "2024-01-10",
    userAvatar: "/avatars/user3.jpg",
  },
]

// Static security features
const staticSecurityFeatures = ["24h surveillance", "Security Guards", "Gated Entry/Exit", "Well-lit"]

// Static photos
const staticPhotos = [
  "/Parkingspots/1D.png",
  "/Parkingspots/1A.png",
  "/Parkingspots/1B.png",
  "/Parkingspots/1C.png",
  "/Parkingspots/1D.png",
]

// API functions
const fetchParkingData = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/reservation/parking-area/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "ngrok-skip-browser-warning": "true",
      },
    })

    if (!response.ok) {
      console.log("API error, using fallback data")
      return createFallbackData()
    }

    const data = await response.json()
    // Validate the received data has required fields
    if (!data?.owner?.parking_name) {
      console.log("Invalid data received, using fallback data")
      return createFallbackData()
    }

    return data
  } catch (error) {
    console.error("Error fetching parking data:", error)
    console.log("Using fallback data due to error")
    return createFallbackData()
  }
}

const submitReview = async (review: Omit<Review, "id" | "date">) => {
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    })

    if (!response.ok) {
      throw new Error("Failed to submit review")
    }

    return response.json()
  } catch (error) {
    console.error("Error submitting review:", error)
    throw error
  }
}

export default function ParkingProfile() {
  // Get ID from URL params
  const { id } = useParams()

  // States
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [reservationDate, setReservationDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("11:00")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [userName, setUserName] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const navigate = useNavigate()
  const location = useLocation()

  // Fetch parking data
  const { data, isLoading, error } = useQuery({
    queryKey: ["parkingProfile", id],
    queryFn: () => fetchParkingData(id || ""),
    enabled: !!id,
    initialData: createFallbackData(),
  })

  // Parse available types from string to array
  const availableTypes = data?.owner?.availableTypes ? data.owner.availableTypes.split(" ") : []

  // Update the time change effect
  useEffect(() => {
    if (!startTime || !endTime) return

    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    let durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    // Handle when end time is on the next day
    if (durationHours < 0) {
      durationHours += 24
    }

    setDuration(durationHours)
    setTotalPrice(durationHours * (data?.owner?.hourlyRate || 0))
  }, [startTime, endTime, data?.owner?.hourlyRate])

  const handlePhotoGalleryOpen = () => {
    setShowPhotoGallery(true)
  }

  const navigatePhoto = (direction: "next" | "prev") => {
    if (direction === "next") {
      setSelectedPhotoIndex((prev) => (prev === staticPhotos.length - 1 ? 0 : prev + 1))
    } else {
      setSelectedPhotoIndex((prev) => (prev === 0 ? staticPhotos.length - 1 : prev - 1))
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userName || !reviewComment) {
      alert("Please fill in all fields")
      return
    }

    setSubmittingReview(true)

    try {
      // In a real app, this would come from authentication
      const userId = `user${Math.floor(Math.random() * 1000)}`

      await submitReview({
        userId,
        userName,
        rating: reviewRating,
        comment: reviewComment,
      })

      // Reset form
      setUserName("")
      setReviewComment("")
      setReviewRating(5)
      setReviewSubmitted(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setReviewSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setSubmittingReview(false)
    }
  }

  // Display loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-[5.5rem]">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  // Display error state
  if (error && !data) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load parking data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-16 pt-[5.5rem]">
      <ArrowLeft className="text-late-500 h-5 w-5 mb-3" onClick={() => navigate(-1)} />

      {/* Parking Name */}
      <h1 className="text-2xl font-bold mb-2">{data?.owner?.parking_name}</h1>

      {/* Rating & Reviews */}
      <div className="flex items-center mb-2">
        <div className="flex items-center text-yellow-500 mr-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="ml-1 text-sm font-medium">{data?.owner?.rating}</span>
        </div>
        <span className="text-sm text-gray-500">({staticReviews.length} reviews)</span>
      </div>

      {/* Location */}
      <div className="flex items-start text-gray-600 mb-4">
        <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
        <p className="text-sm">{data?.owner?.address}</p>
      </div>

      {/* Main Photo and Gallery */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="md:col-span-2 aspect-video relative rounded-lg overflow-hidden border">
          {staticPhotos && staticPhotos.length > 0 ? (
            <img
              src={staticPhotos[0] || "/placeholder.svg"}
              alt="Main parking space photo"
              className="w-full h-full object-cover cursor-pointer"
              onClick={handlePhotoGalleryOpen}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="md:col-span-2 grid grid-cols-3 gap-2">
          {staticPhotos &&
            staticPhotos.slice(1, 4).map((photo, index) => (
              <div
                key={index}
                className="aspect-square relative rounded-md overflow-hidden border cursor-pointer"
                onClick={handlePhotoGalleryOpen}
              >
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Parking space photo ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                {index === 2 && staticPhotos.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">+{staticPhotos.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <Dialog open={showPhotoGallery} onOpenChange={setShowPhotoGallery}>
        <DialogContent className="max-w-4xl w-auto max-[500px]:p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Photo Gallery</DialogTitle>
            <DialogDescription>
              {selectedPhotoIndex + 1} of {staticPhotos.length}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            {/* Main large photo */}
            <div className="relative aspect-video">
              <img
                src={staticPhotos[selectedPhotoIndex] || "/placeholder.svg"}
                alt="Parking space"
                className="w-full h-full object-contain bg-black"
              />

              {/* Navigation buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80"
                onClick={() => navigatePhoto("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80"
                onClick={() => navigatePhoto("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnails carousel */}
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-2">
                {staticPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 max-[550px]:w-12 max-[550px]:h-12 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer ${
                      selectedPhotoIndex === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Key Information Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center">
            <Clock className="h-5 w-5 mr-3 text-blue-700" />
            <div>
              <p className="text-sm text-gray-500">Opening hours</p>
              <p className="font-medium">{data?.owner?.openingHours || "24/7"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-3 text-blue-700" />
            <div>
              <p className="text-sm text-gray-500">Security</p>
              <p className="font-medium">{staticSecurityFeatures[0]}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{data?.owner?.description}</p>
      </div>

      {/* Features Section, Price Information, Reserve Spot */}
      <div className="flex max-sm:flex-col gap-10 justify-between">
        <div className="flex flex-col justify-between sm:py-8 w-full">
          {/* Features Section (using availableTypes) */}
          <div className="mb-8 pl-1">
            <h2 className="text-xl font-semibold mb-3">Available Types</h2>
            <div className="grid grid-cols-2 gap-2">
              {availableTypes.map((type: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-700 mr-2"></div>
                  <span className="text-sm">{type} Parking</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Information */}
          <Card className="shadow-sm">
            <CardContent className="px-4">
              <h2 className="text-xl font-semibold mb-3">Pricing</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Hourly Rate</span>
                  <span className="font-medium">₹{data?.owner?.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Rate</span>
                  <span className="font-medium">₹{data?.owner?.dailyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rate</span>
                  <span className="font-medium">₹{data?.owner?.monthlyRate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Reserve Spot */}
        <Card className="mb-8 shadow-sm w-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Book a Parking Spot</h2>

            {/* Date picker */}
            <div className="mb-4 w-full">
              <Label htmlFor="date" className="mb-1 block">
                Date
              </Label>
              <div className="relative w-full">
                <input
                  id="date"
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
            </div>

            {/* Time selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <Label htmlFor="startTime" className="mb-1 block">
                  Start time
                </Label>
                <div className="relative w-full">
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="w-full">
                <Label htmlFor="endTime" className="mb-1 block">
                  End time
                </Label>
                <div className="relative w-full">
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Duration and total */}
            {duration > 0 && (
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="flex justify-between text-sm">
                  <span>Duration: {duration} hours</span>
                  <span className="font-semibold">Total: ₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={!duration || duration <= 0}
              onClick={() =>
                navigate(`${location.pathname}/choosespot`, {
                  state: {
                    parkingId: data?.id,
                    date: reservationDate,
                    startTime,
                    endTime,
                    duration,
                    totalPrice,
                  },
                })
              }
            >
              Choose Spot
            </Button>
            <p className="text-xs mt-2 text-center text-gray-500">Free cancellation up to 24h before arrival</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>+91 98765 43210</p> {/* Static as requested */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{data?.owner?.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <p>www.citycenterparking.com</p> {/* Static as requested */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p>Metro Parking Solutions Pvt. Ltd.</p> {/* Static as requested */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>

        {/* Review Stats */}
        <div className="flex items-center mb-4">
          <div className="text-xl font-bold rounded-lg p-3 flex items-center justify-center mr-3 border border-slate-200">
            {data?.owner?.rating}
          </div>
          <div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(data?.owner?.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Based on {staticReviews.length} reviews</p>
          </div>
        </div>

        {/* Add Review Form */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Write a Review</h3>

            {reviewSubmitted ? (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckIcon className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your review has been submitted. Thank you for your feedback!</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <Label htmlFor="userName" className="mb-1 block">
                    Your Name
                  </Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <Label className="mb-1 block">Rating</Label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`w-6 h-6 cursor-pointer ${
                          rating <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        }`}
                        onClick={() => setReviewRating(rating)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="reviewComment" className="mb-1 block">
                    Your Review
                  </Label>
                  <Textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-black" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {staticReviews.map((review) => (
            <Card key={review.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar || "/placeholder.svg"}
                        alt={review.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-medium">
                        {review.userName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{review.userName}</p>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>

                    <div className="flex my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!staticReviews || staticReviews.length === 0) && (
            <p className="text-gray-500 text-center italic">No reviews yet. Be the first to leave a review!</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to format review dates
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return format(date, "dd MMM yyyy")
}
