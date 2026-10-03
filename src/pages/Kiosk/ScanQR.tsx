"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { BASE_URL } from "@/App"
import { Html5Qrcode } from "html5-qrcode"

type ScanStatus = "scanning" | "success" | "error" | "loading"

const ScanQR: React.FC = () => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("scanning")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const navigate = useNavigate()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)
  const isProcessingScan = useRef<boolean>(false)

  // Initialize QR scanner
  useEffect(() => {
    if (scanStatus === "scanning" && scannerContainerRef.current) {
      const qrScannerId = "html5qr-code-scanner"

      // Create scanner container if it doesn't exist
      if (!document.getElementById(qrScannerId) && scannerContainerRef.current) {
        const scannerElement = document.createElement("div")
        scannerElement.id = qrScannerId
        scannerContainerRef.current.appendChild(scannerElement)
      }

      // Initialize scanner
      scannerRef.current = new Html5Qrcode(qrScannerId)

      // Start scanning
      scannerRef.current
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleScan(decodedText)
          },
          (errorMessage) => {
            // Silence frequent errors during scanning process
            console.debug(errorMessage)
          },
        )
        .catch((err) => {
          handleError(err)
        })
    }

    // Cleanup scanner when component unmounts or status changes
    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current
            .stop()
            .then(() => console.log("Scanner stopped in cleanup"))
            .catch((err) => console.error("Error stopping scanner in cleanup:", err))
        }
        scannerRef.current = null
      }
    }
  }, [scanStatus])

  // Handle successful scan
  const handleScan = async (result: string) => {
    // Prevent multiple scans using ref
    if (isProcessingScan.current || scanStatus !== "scanning" || !result) {
      console.log("Scan ignored - already processing or invalid state")
      return
    }

    // Set processing flag immediately
    isProcessingScan.current = true

    // Immediately stop scanner to prevent multiple scans
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        // Stop the scanner immediately before doing anything else
        await scannerRef.current.stop()
        console.log("Scanner stopped successfully")
      } catch (error) {
        console.error("Error stopping scanner:", error)
      }
    }

    // Set status to loading
    setScanStatus("loading")

    try {
      // Extract booking ID from QR code
      // Get the numeric part from the QR code URL
      const bookingId = result.match(/\d+/g)?.[0] || result.trim()
      console.log("Booking ID extracted:", bookingId)

      const response = await fetch(`${BASE_URL}/reservation/scan/${bookingId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ booking_id: bookingId }),
      })

      if (response.ok) {
        const data = await response.json()
        setScanStatus("success")
        setSuccessMessage(data.message || "Booking verified successfully!")

        // Auto-redirect back to kiosk screen after 5 seconds
        setTimeout(() => {
          navigate("/kiosk")
        }, 5000)
      } else {
        const errorData = await response.json()
        setScanStatus("error")
        setErrorMessage(errorData.message || "Invalid QR code. Please try again.")
      }
    } catch (error) {
      setScanStatus("error")
      setErrorMessage("Error processing QR code. Please try again.")
    }
  }

  // Handle QR code scan errors
  const handleError = (error: any) => {
    console.error(error)
    setScanStatus("error")
    setErrorMessage("Error accessing camera. Please check permissions and try again.")
  }

  // Reset the scanner state
  const resetScanner = () => {
    setScanStatus("scanning")
    setErrorMessage("")
    setSuccessMessage("")
    isProcessingScan.current = false
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Scan QR Code</h1>
            <Button variant="ghost" size="sm" onClick={() => navigate("/kiosk")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {scanStatus === "scanning" && (
            <div className="relative">
              <div className="mb-4 rounded-lg overflow-hidden" ref={scannerContainerRef} style={{ height: "300px" }}>
                {/* The HTML5-QRCode scanner will be rendered here */}
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">Point your camera at a QR code to scan</div>
            </div>
          )}

          {scanStatus === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              <p className="mt-4 text-lg">Processing QR code...</p>
            </div>
          )}

          {scanStatus === "success" && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}

          {scanStatus === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {(scanStatus === "error" || scanStatus === "success") && (
            <div className="flex justify-center mt-4">
              {scanStatus === "error" && (
                <Button onClick={resetScanner} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              )}
              {scanStatus === "success" && (
                <p className="text-sm text-gray-500">Redirecting to home screen in a few seconds...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScanQR
