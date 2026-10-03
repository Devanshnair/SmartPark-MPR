"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, Plus, X, AlertCircle, Check, ImageIcon, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BASE_URL } from "@/App"

// Interface for the API response
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

// Type definitions for parking data
interface ParkingLevel {
  id: string
  name: string
  totalSpots: number
  spotPrefix: string
  spotRangeStart: number
  spotRangeEnd: number
}

interface ParkingData {
  name: string
  address: string
  description: string
  openingHours: string
  totalSpots: number
  hourlyRate: number
  dailyRate: number
  monthlyRate: number
  contactPhone: string
  contactEmail: string
  website: string
  company: string
  photos: string[]
  levels: ParkingLevel[]
  latitude?: number
  longitude?: number
  rating?: number
  availableTypes?: string
  availableSlots?: number
}

// Static fallback photos
const STATIC_PHOTOS = [
  "/Parkingspots/1D.png",
  "/Parkingspots/1C.png",
  "/Parkingspots/1A.png",
  "/Parkingspots/1B.png",
  "/Parkingspots/1A.png"
]

// Fallback parking space data
const fallbackParkingData: ParkingData = {
  name: "Rajdhani Parking Complex",
  address: "123 Connaught Place, New Delhi, 110001",
  description:
    "A modern parking facility located in the heart of Delhi, offering secure and convenient parking for visitors and commuters.",
  openingHours: "24/7",
  totalSpots: 120,
  hourlyRate: 50,
  dailyRate: 300,
  monthlyRate: 3000,
  contactPhone: "+91 98765 43210",
  contactEmail: "info@rajdhaniparking.com",
  website: "www.rajdhaniparking.com",
  company: "Delhi Parking Solutions Pvt. Ltd.",
  photos: STATIC_PHOTOS,
  levels: [
    {
      id: "1",
      name: "Ground Floor",
      totalSpots: 40,
      spotPrefix: "G",
      spotRangeStart: 1,
      spotRangeEnd: 40
    },
    {
      id: "2",
      name: "Level 1",
      totalSpots: 40,
      spotPrefix: "L1",
      spotRangeStart: 1,
      spotRangeEnd: 40
    },
    {
      id: "3",
      name: "Level 2",
      totalSpots: 40,
      spotPrefix: "L2",
      spotRangeStart: 1,
      spotRangeEnd: 40
    }
  ]
}

// Transform API response to our ParkingData format
const transformApiResponse = (data: ParkingAreaResponse): ParkingData => {
  console.log('Transforming API response:', data); // Debug log
  const generatedLevels: ParkingLevel[] = [];
  const levelsCount = data.owner.levels || 1;
  const spotsPerLevel = Math.ceil(data.owner.total_slots / levelsCount);

  for (let i = 0; i < levelsCount; i++) {
    generatedLevels.push({
      id: (i + 1).toString(),
      name: `Level ${i + 1}`,
      totalSpots: i === levelsCount - 1
        ? data.owner.total_slots - (spotsPerLevel * i)
        : spotsPerLevel,
      spotPrefix: `L${i + 1}`,
      spotRangeStart: 1,
      spotRangeEnd: i === levelsCount - 1
        ? data.owner.total_slots - (spotsPerLevel * i)
        : spotsPerLevel
    });
  }

  // Use the image_url from the API response as the primary photo
  const photos = data.owner.image_url
    ? [data.owner.image_url, ...STATIC_PHOTOS]
    : [...STATIC_PHOTOS];

  const transformedData = {
    name: data.owner.parking_name,
    address: data.owner.address,
    description: data.owner.description,
    openingHours: data.owner.openingHours,
    totalSpots: data.owner.total_slots,
    hourlyRate: data.owner.hourlyRate,
    dailyRate: data.owner.dailyRate,
    monthlyRate: data.owner.monthlyRate,
    contactPhone: "", // Not provided in API response
    contactEmail: data.owner.user.email || "",
    website: "", // Not provided in API response
    company: "", // Not provided in API response
    photos: photos,
    levels: generatedLevels,
    latitude: data.latitude,
    longitude: data.longitude,
    rating: data.owner.rating,
    availableTypes: data.owner.availableTypes,
    availableSlots: data.available_slots
  };
  console.log('Transformed Data:', transformedData); // Debug log
  return transformedData;
};

// API functions
const fetchProfileData = async (): Promise<ParkingData> => {
  console.log('Fetching profile data...'); // Debug log
  const response = await fetch(`${BASE_URL}/reservation/parking-area/3`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "ngrok-skip-browser-warning": "true",
    }
  });

  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText); // Debug log
    throw new Error("Failed to fetch profile data");
  }

  const apiData: ParkingAreaResponse = await response.json();
  console.log('Raw API Response:', apiData); // Debug log
  return transformApiResponse(apiData);
};

const updateProfileData = async (data: ParkingData) => {
  // Transform back to API format
  const apiData = {
    owner: {
      parking_name: data.name,
      address: data.address,
      description: data.description,
      openingHours: data.openingHours,
      total_slots: data.totalSpots,
      hourlyRate: data.hourlyRate,
      dailyRate: data.dailyRate,
      monthlyRate: data.monthlyRate,
      levels: data.levels.length,
      image_url: data.photos[0], // Use first photo as main image
      availableTypes: data.availableTypes
    },
    latitude: data.latitude,
    longitude: data.longitude
  };

  const response = await fetch(`${BASE_URL}/reservation/parking-area/3/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(apiData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile data");
  }

  return response.json();
};

export default function Profile() {
  const [formData, setFormData] = useState<ParkingData>(fallbackParkingData);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [, setHasChanges] = useState(false)

  const queryClient = useQueryClient()

const { data: apiData, isLoading, error } = useQuery({
  queryKey: ["profile"],
  queryFn: fetchProfileData,
});

useEffect(() => {
  if (apiData) {
    setFormData(apiData);
  } else if (error) {
    setFormData(fallbackParkingData);
  }
}, [apiData, error]);

  const mutation = useMutation({
    mutationFn: updateProfileData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setHasChanges(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  useEffect(() => {
    if (error && !formData && !isLoading) {
      setFormData(fallbackParkingData)
    }
  }, [error, formData, isLoading])

useEffect(() => {
  console.log('Current formData:', formData);
}, [formData]);

  useEffect(() => {
    if (formData?.levels) {
      const totalSpots = formData.levels.reduce((sum, level) => sum + level.totalSpots, 0)
      setFormData(prev => ({ ...prev, totalSpots }))
    }
  }, [formData?.levels])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
    setHasChanges(true)
  }

  const handleLevelChange = (levelId: string, field: keyof ParkingLevel, value: string | number) => {
    setFormData((prev: any) => {
      if (!prev) return prev

      const updatedLevels = prev.levels.map((level: ParkingLevel) => {
        if (level.id === levelId) {
          return { ...level, [field]: value }
        }
        return level
      })

      return { ...prev, levels: updatedLevels }
    })

    setHasChanges(true)
  }

  const addNewLevel = () => {
    setFormData((prev: any) => {
      if (!prev) return prev

      const newLevelId = Date.now().toString()
      const nextLevelNum = prev.levels.length + 1

      return {
        ...prev,
        levels: [
          ...prev.levels,
          {
            id: newLevelId,
            name: `Level ${nextLevelNum - 1}`,
            totalSpots: 0,
            spotPrefix: String.fromCharCode(65 + nextLevelNum - 1),
            spotRangeStart: 1,
            spotRangeEnd: 0
          }
        ]
      }
    })

    setHasChanges(true)
  }

  const removeLevel = (levelId: string) => {
    setFormData((prev: any) => {
      if (!prev) return prev

      return {
        ...prev,
        levels: prev.levels.filter((level: ParkingLevel) => level.id !== levelId)
      }
    })

    setHasChanges(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
  
    const updatedData = {
      ...formData,
      photos: [...(formData.photos || []), ...uploadedPhotos],
    };
  
    mutation.mutate(updatedData);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file))
    setUploadedPhotos([...uploadedPhotos, ...newPhotos])
    setHasChanges(true)
  }

  const confirmPhotoUpload = () => {
    setFormData((prev: any) => ({
      ...prev,
      photos: [...(prev.photos || []), ...uploadedPhotos],
    }))
    setUploadedPhotos([])
    setHasChanges(true)
  }

  const cancelPhotoUpload = () => {
    uploadedPhotos.forEach((url) => URL.revokeObjectURL(url))
    setUploadedPhotos([])
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handlePhotoGalleryOpen = () => {
    setShowPhotoGallery(true)
  }

  const navigatePhoto = (direction: "next" | "prev") => {
    if (!formData?.photos) return

    if (direction === "next") {
      setSelectedPhotoIndex((prev) => (prev === formData.photos.length - 1 ? 0 : prev + 1))
    } else {
      setSelectedPhotoIndex((prev) => (prev === 0 ? formData.photos.length - 1 : prev - 1))
    }
  }

  if (isLoading) {
    return (
      <div className="mx-2 my-2 rounded-lg py-5 px-8">
        <Skeleton className="bg-slate-200 h-12 w-64 mb-6" />
        <Skeleton className="bg-slate-200 h-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="bg-slate-200 h-40" />
          <Skeleton className="bg-slate-200 h-40" />
          <Skeleton className="bg-slate-200 h-40" />
          <Skeleton className="bg-slate-200 h-40" />
        </div>
      </div>
    )
  }

  if (error && !formData) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load profile data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="md:mx-2 md:my-2 rounded-lg bg-white py-5 px-8 max-md:py-[5.5rem]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Profile</h1>
        <Button variant="outline" onClick={openFileDialog} className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <span>Upload Photos</span>
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>

      {uploadedPhotos.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Review Uploaded Photos</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={cancelPhotoUpload}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={confirmPhotoUpload}>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Upload
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Uploaded photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        URL.revokeObjectURL(photo)
                        setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 aspect-video relative rounded-lg overflow-hidden border">
            {formData?.photos && formData.photos.length > 0 ? (
              <img
                src={formData.photos[0] || "/pl"}
                alt="Main parking space photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="md:col-span-2 grid grid-cols-3 gap-2">
            {formData?.photos &&
              formData.photos.slice(1, 4).map((photo: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-md overflow-hidden border cursor-pointer"
                  onClick={index === 2 && formData.photos.length > 4 ? handlePhotoGalleryOpen : undefined}
                >
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Parking space photo ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 2 && formData.photos.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">+{formData.photos.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {formData && (formData.rating || formData.availableSlots !== undefined) && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {formData.rating !== undefined && (
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={i < Math.floor(formData.rating || 0) ? "currentColor" : "none"}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 font-medium">{formData.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}

                {formData.availableSlots !== undefined && (
                  <div className="space-y-2">
                    <Label>Available Slots</Label>
                    <p className="text-xl font-semibold">{formData.availableSlots} / {formData.totalSpots}</p>
                  </div>
                )}

                {formData.availableTypes && (
                  <div className="space-y-2">
                    <Label>Available Vehicle Types</Label>
                    <p>
                      {formData.availableTypes
                        ? formData.availableTypes.split(',').map(type =>
                          type.trim()).join(', ')
                        : "All types"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Parking Space Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleChange}
                  placeholder="Enter parking space name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData?.address || ""}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Input
                  id="openingHours"
                  name="openingHours"
                  value={formData?.openingHours || ""}
                  onChange={handleChange}
                  placeholder="Enter opening hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSpots">Total Parking Spots</Label>
                <Input
                  id="totalSpots"
                  name="totalSpots"
                  value={formData?.totalSpots?.toString() || ""}
                  disabled
                  type="number"
                  placeholder="Calculated from levels"
                />
                <p className="text-xs text-muted-foreground">Total is calculated from all levels</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData?.description || ""}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Parking Levels</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addNewLevel}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Level
              </Button>
            </div>

            {formData?.levels && formData.levels.length > 0 ? (
              <div className="space-y-6">
                {formData.levels.map((level) => (
                  <div key={level.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{level.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLevel(level.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`level-name-${level.id}`}>Level Name</Label>
                        <Input
                          id={`level-name-${level.id}`}
                          value={level.name}
                          onChange={(e) => handleLevelChange(level.id, 'name', e.target.value)}
                          placeholder="e.g. Ground Floor, Level 1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`level-spots-${level.id}`}>Number of Spots</Label>
                        <Input
                          id={`level-spots-${level.id}`}
                          type="number"
                          value={level.totalSpots}
                          onChange={(e) => handleLevelChange(level.id, 'totalSpots', parseInt(e.target.value) || 0)}
                          placeholder="Enter number of spots"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`level-prefix-${level.id}`}>Spot Prefix</Label>
                        <Input
                          id={`level-prefix-${level.id}`}
                          value={level.spotPrefix}
                          onChange={(e) => handleLevelChange(level.id, 'spotPrefix', e.target.value)}
                          placeholder="e.g. A, B, C"
                          maxLength={3}
                        />
                        <p className="text-xs text-muted-foreground">Letters/numbers to prefix spot numbers (e.g. 'A' for A1, A2...)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`level-start-${level.id}`}>Starting Number</Label>
                          <Input
                            id={`level-start-${level.id}`}
                            type="number"
                            value={level.spotRangeStart}
                            onChange={(e) => handleLevelChange(level.id, 'spotRangeStart', parseInt(e.target.value) || 1)}
                            placeholder="e.g. 1"
                            min={1}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`level-end-${level.id}`}>Ending Number</Label>
                          <Input
                            id={`level-end-${level.id}`}
                            type="number"
                            value={level.spotRangeEnd}
                            onChange={(e) => handleLevelChange(level.id, 'spotRangeEnd', parseInt(e.target.value) || level.spotRangeStart)}
                            placeholder="e.g. 40"
                            min={level.spotRangeStart}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div className="bg-muted p-3 rounded-md mt-2">
                          <p className="text-sm font-medium">Spot Naming Preview:</p>
                          <p className="text-sm">
                            {level.spotPrefix}-{level.spotRangeStart} to {level.spotPrefix}-{level.spotRangeEnd}
                            {level.spotRangeEnd - level.spotRangeStart + 1 !== level.totalSpots && (
                              <span className="text-amber-600 ml-2">
                                (Warning: Range has {level.spotRangeEnd - level.spotRangeStart + 1} spots but total spots is {level.totalSpots})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed">
                <p className="text-muted-foreground mb-4">No parking levels added yet</p>
                <Button
                  variant="outline"
                  onClick={addNewLevel}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add First Level
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pricing Information</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData?.hourlyRate || ""}
                  onChange={handleChange}
                  placeholder="Enter hourly rate"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate (₹)</Label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  value={formData?.dailyRate || ""}
                  onChange={handleChange}
                  placeholder="Enter daily rate"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRate">Monthly Rate (₹)</Label>
                <Input
                  id="monthlyRate"
                  name="monthlyRate"
                  value={formData?.monthlyRate || ""}
                  onChange={handleChange}
                  placeholder="Enter monthly rate"
                  type="number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData?.contactPhone || ""}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  value={formData?.contactEmail || ""}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData?.website || ""}
                  onChange={handleChange}
                  placeholder="Enter website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData?.company || ""}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full flex justify-end ">
          <Button type="submit" size="lg" disabled={mutation.isPending} className="cursor-pointer">
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <Dialog open={showPhotoGallery} onOpenChange={setShowPhotoGallery}>
        <DialogContent className="!max-w-[90vh] w-auto max-[500px]:p-0 ">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Photo Gallery</DialogTitle>
            <DialogDescription>Browse all photos of your parking space</DialogDescription>
          </DialogHeader>

          <div className="relative">
            <div className="relative aspect-video">
              {formData?.photos && (
                <img
                  src={formData.photos[selectedPhotoIndex] || "/placeholder.svg"}
                  alt="Parking space"
                  className="w-full h-full object-contain"
                />
              )}

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

            <div className="p-4 overflow-x-auto">
              <div className="flex gap-2">
                {formData?.photos &&
                  formData.photos.map((photo: string, index: number) => (
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
    </div>
  )
}