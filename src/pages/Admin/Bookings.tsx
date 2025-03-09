"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, Clock, CreditCard, Download, Eye, MoreHorizontal, QrCode, Search, X } from "lucide-react"

// Sample booking data
const bookings = [
  {
    id: "B-1001",
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    spotId: "A-12",
    status: "active",
    startTime: "2023-05-15T09:30:00",
    endTime: "2023-05-15T14:30:00",
    duration: "5 hours",
    payment: {
      amount: "$12.50",
      status: "paid",
      method: "Credit Card",
      transactionId: "txn_1234567890",
    },
    createdAt: "2023-05-14T18:25:43",
  },
  {
    id: "B-1002",
    user: {
      name: "Emily Johnson",
      email: "emily.j@example.com",
      phone: "+1 (555) 987-6543",
    },
    spotId: "B-05",
    status: "completed",
    startTime: "2023-05-14T13:00:00",
    endTime: "2023-05-14T17:00:00",
    duration: "4 hours",
    payment: {
      amount: "$10.00",
      status: "paid",
      method: "PayPal",
      transactionId: "txn_0987654321",
    },
    createdAt: "2023-05-14T10:15:22",
  },
  {
    id: "B-1003",
    user: {
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+1 (555) 456-7890",
    },
    spotId: "C-18",
    status: "upcoming",
    startTime: "2023-05-16T08:00:00",
    endTime: "2023-05-16T18:00:00",
    duration: "10 hours",
    payment: {
      amount: "$25.00",
      status: "paid",
      method: "Credit Card",
      transactionId: "txn_5678901234",
    },
    createdAt: "2023-05-15T09:45:11",
  },
  {
    id: "B-1004",
    user: {
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      phone: "+1 (555) 789-0123",
    },
    spotId: "A-07",
    status: "cancelled",
    startTime: "2023-05-15T11:00:00",
    endTime: "2023-05-15T13:00:00",
    duration: "2 hours",
    payment: {
      amount: "$5.00",
      status: "refunded",
      method: "Credit Card",
      transactionId: "txn_3456789012",
    },
    createdAt: "2023-05-14T22:30:05",
  },
  {
    id: "B-1005",
    user: {
      name: "David Lee",
      email: "david.l@example.com",
      phone: "+1 (555) 234-5678",
    },
    spotId: "B-11",
    status: "active",
    startTime: "2023-05-15T10:00:00",
    endTime: "2023-05-15T19:00:00",
    duration: "9 hours",
    payment: {
      amount: "$22.50",
      status: "paid",
      method: "Apple Pay",
      transactionId: "txn_6789012345",
    },
    createdAt: "2023-05-15T08:10:33",
  },
  {
    id: "B-1006",
    user: {
      name: "Jessica Taylor",
      email: "jessica.t@example.com",
      phone: "+1 (555) 345-6789",
    },
    spotId: "C-03",
    status: "upcoming",
    startTime: "2023-05-17T14:00:00",
    endTime: "2023-05-17T16:00:00",
    duration: "2 hours",
    payment: {
      amount: "$5.00",
      status: "paid",
      method: "Credit Card",
      transactionId: "txn_7890123456",
    },
    createdAt: "2023-05-15T11:20:17",
  },
]

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Badge variant="outline" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.spotId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage all parking bookings and payments</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>{filteredBookings.length} bookings found</CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredBookings.map((booking) => (
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
                    <div className="font-medium">{booking.payment.amount}</div>
                    <div className="flex items-center text-xs">
                      <CreditCard className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className={booking.payment.status === "refunded" ? "text-destructive" : ""}>
                        {booking.payment.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="mr-2 h-4 w-4" />
                          View QR Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Receipt
                        </DropdownMenuItem>
                        {booking.status === "upcoming" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <X className="mr-2 h-4 w-4" />
                              Cancel Booking
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedBooking && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Booking ID: {selectedBooking.id}</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setSelectedBooking(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium">User Information</h3>
                <div className="space-y-2">
                  <div>
                    <Label>Name</Label>
                    <div className="font-medium">{selectedBooking.user.name}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="font-medium">{selectedBooking.user.email}</div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="font-medium">{selectedBooking.user.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">Booking Information</h3>
                <div className="space-y-2">
                  <div>
                    <Label>Status</Label>
                    <div>
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>
                  <div>
                    <Label>Parking Spot</Label>
                    <div className="font-medium">{selectedBooking.spotId}</div>
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <div className="font-medium">{formatDate(selectedBooking.startTime)}</div>
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <div className="font-medium">{formatDate(selectedBooking.endTime)}</div>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <div className="font-medium">{selectedBooking.duration}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">Payment Information</h3>
                <div className="space-y-2">
                  <div>
                    <Label>Amount</Label>
                    <div className="font-medium">{selectedBooking.payment.amount}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="font-medium">
                      {selectedBooking.payment.status === "paid" ? (
                        <span className="flex items-center text-green-600">
                          <Check className="mr-1 h-4 w-4" /> Paid
                        </span>
                      ) : (
                        <span className="flex items-center text-destructive">
                          <X className="mr-1 h-4 w-4" /> Refunded
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <div className="font-medium">{selectedBooking.payment.method}</div>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <div className="font-medium">{selectedBooking.payment.transactionId}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">QR Code</h3>
                <div className="flex items-center justify-center rounded-lg border border-dashed p-6">
                  <div className="text-center">
                    <QrCode className="mx-auto h-32 w-32 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Scan this QR code to access the parking spot</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Download Receipt</Button>
            {selectedBooking.status === "upcoming" && <Button variant="destructive">Cancel Booking</Button>}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

