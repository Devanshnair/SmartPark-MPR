"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, Clock, CreditCard, QrCode, Search, X, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BASE_URL } from "@/App"

// Interface for the API response
interface BookingApiResponse {
  parking_area_id: number;
  total_bookings: number;
  bookings: ApiBooking[];
}

interface ApiBooking {
  id: number;
  slot: number;
  req_time_start: string;
  req_time_end: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
  qr_code: string | null;
  status: string;
  phone_number: string | null;
}

// Transformed booking interface for UI
interface UIBooking {
  id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  spotId: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  payment?: {
    amount: string;
    status: string;
    method: string;
    transactionId: string;
  };
  createdAt: string;
  qrCode?: string | null;
}

// Fallback booking data in case of API failure
const fallbackBookings: UIBooking[] = [
  {
    id: "B-1001",
    user: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
    },
    spotId: "A-12",
    status: "active",
    startTime: "2023-05-15T09:30:00",
    endTime: "2023-05-15T14:30:00",
    duration: "5 hours",
    payment: {
      amount: "₹950",
      status: "paid",
      method: "Credit Card",
      transactionId: "txn_1234567890",
    },
    createdAt: "2023-05-14T18:25:43",
    qrCode: null,
  },
  {
    id: "B-1002",
    user: {
      name: "Priya Patel",
      email: "priya.p@example.com",
      phone: "+91 87654 32109",
    },
    spotId: "B-05",
    status: "completed",
    startTime: "2023-05-14T13:00:00",
    endTime: "2023-05-14T17:00:00",
    duration: "4 hours",
    payment: {
      amount: "₹760",
      status: "paid",
      method: "UPI",
      transactionId: "txn_0987654321",
    },
    createdAt: "2023-05-14T10:15:22",
    qrCode: null,
  },
  {
    id: "B-1003",
    user: {
      name: "Amit Kumar",
      email: "amit.k@example.com",
      phone: "+91 76543 21098",
    },
    spotId: "C-18",
    status: "upcoming",
    startTime: "2023-05-16T08:00:00",
    endTime: "2023-05-16T18:00:00",
    duration: "10 hours",
    payment: {
      amount: "₹1,900",
      status: "paid",
      method: "Credit Card",
      transactionId: "txn_5678901234",
    },
    createdAt: "2023-05-15T09:45:11",
    qrCode: null,
  },
  {
    id: "B-1004",
    user: {
      name: "Sneha Verma",
      email: "sneha.v@example.com",
      phone: "+91 65432 10987",
    },
    spotId: "A-07",
    status: "cancelled",
    startTime: "2023-05-15T11:00:00",
    endTime: "2023-05-15T13:00:00",
    duration: "2 hours",
    payment: {
      amount: "₹380",
      status: "refunded",
      method: "Credit Card",
      transactionId: "txn_3456789012",
    },
    createdAt: "2023-05-14T22:30:05",
    qrCode: null,
  },
  {
    id: "B-1005",
    user: {
      name: "Vikram Singh",
      email: "vikram.s@example.com",
      phone: "+91 54321 09876",
    },
    spotId: "B-11",
    status: "active",
    startTime: "2023-05-15T10:00:00",
    endTime: "2023-05-15T19:00:00",
    duration: "9 hours",
    payment: {
      amount: "₹1,710",
      status: "paid",
      method: "UPI",
      transactionId: "txn_6789012345",
    },
    createdAt: "2023-05-15T08:10:33",
    qrCode: null,
  },
  {
    id: "B-1006",
    user: {
      name: "Neha Gupta",
      email: "neha.g@example.com",
      phone: "+91 43210 98765",
    },
    spotId: "C-03",
    status: "upcoming",
    startTime: "2023-05-17T14:00:00",
    endTime: "2023-05-17T16:00:00",
    duration: "2 hours",
    payment: {
      amount: "₹380",
      status: "paid",
      method: "Credit Card",
      transactionId: "txn_7890123456",
    },
    createdAt: "2023-05-15T11:20:17",
    qrCode: null,
  },
]

// API function to fetch bookings
const fetchBookings = async (): Promise<UIBooking[]> => {
  const response = await fetch(`${BASE_URL}/reservation/parking-area/3/bookings/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "ngrok-skip-browser-warning": "true",
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  
  const data: BookingApiResponse = await response.json();
  
  // Transform API response to UI format
  return data.bookings.map(booking => {
    // Create date objects for start and end times
    const today = new Date();
    const [startHours, startMinutes] = booking.req_time_start.split(':').map(Number);
    const [endHours, endMinutes] = booking.req_time_end.split(':').map(Number);
    
    const startDate = new Date(today);
    startDate.setHours(startHours, startMinutes, 0);
    
    const endDate = new Date(today);
    endDate.setHours(endHours, endMinutes, 0);
    
    // Calculate duration in hours
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.round(durationMs / (1000 * 60 * 60));
    
    // Determine booking status based on time
    let status: string;
    const now = new Date();
    
    if (booking.status === 'cancelled') {
      status = 'cancelled';
    } else if (booking.status === 'exit') {
      status = 'completed';
    } else if (startDate > now) {
      // If the start time is in the future
      status = 'upcoming';
    } else if (endDate < now) {
      // If end time has passed
      status = 'completed';
    } else {
      // If current time is between start and end
      status = 'active';
    }
    
    // Generate a spotId based on slot number
    const spotId = `L${Math.floor(booking.slot / 50) + 1}-${booking.slot % 50 || 50}`;
    
    return {
      id: `B-${booking.id}`,
      user: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.phone_number || 'Not provided'
      },
      spotId,
      status,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      duration: `${durationHours} hours`,
      payment: {
        amount: `₹${durationHours * 55}`, // Dummy price calculation
        status: booking.status === 'cancelled' ? 'refunded' : 'paid',
        method: 'Credit Card', // Dummy data as not provided in API
        transactionId: `txn_${Math.random().toString(36).substring(2, 10)}` // Dummy transaction ID
      },
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Dummy creation date
      qrCode: booking.qr_code
    };
  });
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

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    upcoming: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    cancelled: "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Badge variant="secondary" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<UIBooking | null>(null)
  const [isCardView, setIsCardView] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check for viewport width
  useEffect(() => {
    const checkViewportWidth = () => {
      setIsCardView(window.innerWidth < 1200)
    }

    checkViewportWidth()
    window.addEventListener("resize", checkViewportWidth)

    return () => {
      window.removeEventListener("resize", checkViewportWidth)
    }
  }, [])

  // Fetch bookings data using TanStack Query
  const {
    data: bookings = fallbackBookings,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    retry: 1,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    placeholderData: fallbackBookings,
  })

  const filteredBookings = bookings.filter((booking: UIBooking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.spotId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (booking: UIBooking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full max-w-full overflow-hidden md:mx-2 md:my-2 rounded-lg bg-white py-6 px-4 sm:px-6 md:px-8 max-md:py-[5.5rem]">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">Bookings</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 max-[900px]:flex-wrap">
        <div className="relative w-full sm:max-w-xs ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sm:w-auto">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none max-[400px]:text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1 sm:flex-none max-[400px]:text-xs">
                Active
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex-1 sm:flex-none max-[400px]:text-xs">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 sm:flex-none max-[400px]:text-xs">
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1 sm:flex-none max-[400px]:text-xs">
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-4 sm:px-6 border-b-slate-200  max-[1200px]:border-b">
          <CardTitle className="text-lg">All Bookings</CardTitle>
          <CardDescription>
            {isLoading ? "Loading bookings..." : `${filteredBookings.length} bookings found`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 px-4">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : isCardView ? (
            // Card view for screens < 1200px
            <div className="divide-y">
              {filteredBookings.map((booking: UIBooking) => (
                <div key={booking.id} className="p-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                    <div>
                      <p className="font-medium">{booking.id}</p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                        <p className="text-sm">{booking.user.name}</p>
                        <p className="text-xs text-muted-foreground hidden xs:block">•</p>
                        <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground text-xs">Spot</p>
                      <p>{booking.spotId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Payment</p>
                      <p>{booking.payment?.amount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Date</p>
                      <p className="text-xs sm:text-sm">{formatDate(booking.startTime).split(",")[0]}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Duration</p>
                      <p>{booking.duration}</p>
                    </div>
                  </div>
                  <button 
                    className="text-black text-sm cursor-pointer min-[1200px]:hover:text-blue-700 hover:underline transition max-[1200px]:text-white max-[1200px]:bg-black px-2 py-1 rounded-sm"
                    onClick={() => handleViewDetails(booking)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Table view for screens >= 1200px
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Spot</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking: UIBooking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.user.name}</div>
                        <div className="text-xs text-muted-foreground">{booking.user.email}</div>
                      </TableCell>
                      <TableCell>{booking.spotId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{formatDate(booking.startTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{booking.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.payment?.amount}</div>
                        <div className="flex items-center text-xs">
                          <CreditCard className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className={booking.payment?.status === "refunded" ? "text-destructive" : ""}>
                            {booking.payment?.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <button 
                          className="text-black cursor-pointer hover:text-blue-700 hover:underline transition text-sm"
                          onClick={() => handleViewDetails(booking)}>
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Booking ID: {selectedBooking?.id}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">User Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Name</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.user.name}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Email</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.user.email}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Phone</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.user.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Booking Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Status</Label>
                      <div className="col-span-2 -translate-x-2">
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Parking Spot</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.spotId}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Start Time</Label>
                      <div className="col-span-2 font-medium text-sm">{formatDate(selectedBooking.startTime)}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">End Time</Label>
                      <div className="col-span-2 font-medium text-sm">{formatDate(selectedBooking.endTime)}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Duration</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.duration}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Amount</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.payment?.amount}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Status</Label>
                      <div className="col-span-2 font-medium text-sm">
                        {selectedBooking.payment?.status === "paid" ? (
                          <span className="flex items-center text-green-600">
                           Paid
                          </span>
                        ) : (
                          <span className="flex items-center text-destructive">
                            <X className="mr-1 h-4 w-4" /> Refunded
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Method</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.payment?.method}</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <Label className="text-xs">Transaction ID</Label>
                      <div className="col-span-2 font-medium text-sm">{selectedBooking.payment?.transactionId}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">QR Code</h3>
                  <div className="flex items-center justify-center p-4">
                    {selectedBooking.qrCode ? (
                      <div className="text-center">
                        <img 
                          src={selectedBooking.qrCode} 
                          alt="Booking QR Code" 
                          className="mx-auto h-32 w-32 object-contain"
                        />
                        <div className="mt-2 flex items-center justify-center">
                          <a href={selectedBooking.qrCode} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center">
                            View Full Size <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="mx-auto h-20 w-20 text-muted-foreground" />
                        <p className="mt-2 text-xs text-muted-foreground">QR Code not available</p>
                      </div>
                    )}
                  </div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}