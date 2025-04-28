import { useEffect, useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowRight, Download } from "lucide-react"
import confetti from "canvas-confetti"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { BASE_URL } from "@/App"

interface ConfirmationDetails {
  booking_id: string
  parkingId?: string
  date: string
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
  level: string
  spot: string
  slot: number
  paymentStatus: string
  paymentDate: string
  user: string
  req_time_start: string
  req_time_end: string
}

export default function Confirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [details, setDetails] = useState<ConfirmationDetails | null>(null)
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle page refresh or direct navigation without state
    if (!location.state) {
      navigate("/", { replace: true })
      return
    }

    setDetails(location.state as ConfirmationDetails)
    console.log(location.state)

    // Fetch QR code for the booking
    const fetchQrCode = async () => {
      try {
        const bookingId = (location.state as ConfirmationDetails).booking_id
        const response = await fetch(`${BASE_URL}/reservation/booking/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setQrImageUrl(data.qr_code || null)
      }   
    }
    catch (e) {
        console.error("Error fetching QR code:", e)
        setQrImageUrl(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQrCode()
    // Trigger confetti animation
    const triggerConfetti = () => {
      const duration = 2000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Create confetti from random positions around the screen
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
    }

    triggerConfetti()
  }, [location.state, navigate])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return

    try {
      // Clone the element to avoid modifying the original DOM
      const clonedTicket = ticketRef.current.cloneNode(true) as HTMLElement
      
      // Set a white background
      const wrapper = document.createElement('div')
      wrapper.style.backgroundColor = '#ffffff'
      wrapper.style.padding = '20px'
      wrapper.appendChild(clonedTicket)
      document.body.appendChild(wrapper)
      
      // Capture the cloned element
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (doc) => {
          // Remove any problematic color values in the cloned document
          const elements = doc.querySelectorAll('*')
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              const style = window.getComputedStyle(el)
              if (style.color.includes('oklch') || style.backgroundColor.includes('oklch')) {
                el.style.color = '#000000'
                el.style.backgroundColor = '#ffffff'
              }
            }
          })
        }
      })
      
      // Clean up the temporary element
      document.body.removeChild(wrapper)
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // Calculate dimensions to fit the content properly
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`parking-ticket-${details?.booking_id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback method if the above fails
      try {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        })
        
        pdf.setFontSize(20)
        pdf.text('Parking Ticket', 105, 20, { align: 'center' })
        
        pdf.setFontSize(12)
        pdf.text(`Booking ID: ${details?.booking_id}`, 20, 40)
        pdf.text(`Date: ${details?.date}`, 20, 50)
        pdf.text(`Time: ${details?.startTime} - ${details?.endTime}`, 20, 60)
        pdf.text(`Duration: ${details?.duration} hours`, 20, 70)
        pdf.text(`Level: ${details?.level}`, 20, 80)
        pdf.text(`Spot: ${details?.spot}`, 20, 90)
        pdf.text(`Amount Paid: ${formatPrice(details?.totalPrice || 0)}`, 20, 100)
        
        pdf.save(`parking-ticket-${details?.booking_id}.pdf`)
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError)
      }
    }
  }

  if (!details) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16 md:pt-24 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">Your parking spot has been reserved successfully.</p>
      </div>

      <Card ref={ticketRef} className="shadow-lg border-0 overflow-hidden" id="parking-ticket">
        <CardHeader className="bg-green-50 py-4 border-b">
          <CardTitle className="text-2xl text-center text-green-800">Parking Ticket</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{details.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{details.booking_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{formatTime(details.startTime)} - {formatTime(details.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{details.duration} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="font-medium">{details.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Spot</p>
                    <p className="font-medium">{details.spot}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-bold text-lg">{formatPrice(details.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-medium">{details.paymentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-green-600 font-medium">{details.paymentStatus}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="text-xs flex items-center gap-1" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-3 w-3" />
                Download Ticket
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-lg">Entry/Exit QR Code</h3>
                <p className="text-sm text-gray-500 mt-1">Scan at the parking gate</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[180px] w-[180px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : qrImageUrl ? (
                  <img 
                    src={qrImageUrl} 
                    alt="QR Code" 
                    className="h-[180px] w-[180px] object-contain"
                  />
                ) : (
                  <QRCodeSVG
                    value={details.booking_id}
                    size={180}
                    level="H"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t p-4 flex justify-between">
          <Button 
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
          
          <Button 
            className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800"
            onClick={() => navigate("/bookings")}
          >
            View My Bookings
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          A confirmation email has been sent with your parking details.<br />
          For assistance, contact our support at help@parkingsystem.com
        </p>
      </div>
    </div>
  )
}