"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Car, Phone, Mail, Globe, Building, Edit2 } from "lucide-react"

// Sample parking space data
const parkingSpaceData = {
  name: "Downtown Parking Complex",
  address: "123 Main Street, Downtown, City",
  description:
    "A modern parking facility located in the heart of downtown, offering secure and convenient parking for visitors and commuters.",
  openingHours: "24/7",
  totalSpots: 120,
  hourlyRate: "$2.50",
  dailyRate: "$15.00",
  monthlyRate: "$150.00",
  contactPhone: "+1 (555) 123-4567",
  contactEmail: "info@downtownparking.com",
  website: "www.downtownparking.com",
  company: "City Parking Solutions Inc.",
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(parkingSpaceData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data to your backend
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parking Space Profile</h1>
          <p className="text-muted-foreground">Manage your parking space information and settings</p>
        </div>
        <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Parking Space Details</CardTitle>
              <CardDescription>Basic information about your parking space</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Parking Space Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="openingHours">Opening Hours</Label>
                      <Input
                        id="openingHours"
                        name="openingHours"
                        value={formData.openingHours}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalSpots">Total Parking Spots</Label>
                      <Input
                        id="totalSpots"
                        name="totalSpots"
                        value={formData.totalSpots.toString()}
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Parking Space Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.address}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Opening Hours</p>
                      <p className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.openingHours}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Parking Spots</p>
                      <p className="flex items-center">
                        <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.totalSpots} spots
                      </p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p>{formData.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>Set your parking rates and payment options</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <Input id="hourlyRate" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyRate">Daily Rate</Label>
                      <Input id="dailyRate" name="dailyRate" value={formData.dailyRate} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRate">Monthly Rate</Label>
                      <Input id="monthlyRate" name="monthlyRate" value={formData.monthlyRate} onChange={handleChange} />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Hourly Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{formData.hourlyRate}</p>
                      <p className="text-xs text-muted-foreground">Per hour</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Daily Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{formData.dailyRate}</p>
                      <p className="text-xs text-muted-foreground">Per day</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Monthly Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{formData.monthlyRate}</p>
                      <p className="text-xs text-muted-foreground">Per month</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" name="website" value={formData.website} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.contactPhone}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.contactEmail}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Website</p>
                      <p className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.website}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Company</p>
                      <p className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.company}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

