import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, CalendarPlus, Car } from "lucide-react";
import { IoCarOutline, IoQrCodeOutline } from "react-icons/io5";
import { LuQrCode } from "react-icons/lu";
import { MdQrCodeScanner } from "react-icons/md";

const Kiosk: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">SmartPark Kiosk</h1>
        <p className="text-xl text-gray-600">Welcome! Please select an option below</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button
          onClick={() => navigate("/scan-qr")}
          className="h-48 text-2xl flex flex-col items-center justify-center bg-slate-100 text-black border-2 border-slate-300 md:hover:border-slate-400 rounded-lg"
        >
          <MdQrCodeScanner className="h-14 w-14 mb-4" />
          Scan QR Code
        </button>

        <button
          onClick={() => navigate("/parkingprofile/3/bookoffline")}
          className="h-48 text-2xl flex flex-col items-center justify-center bg-slate-100 text-black border-2 border-slate-300 md:hover:border-slate-400 rounded-lg"
        >
          <IoCarOutline className="h-16 w-16 mb-4" />
          Book Parking
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Scan your pre-booked QR code or make a new booking
        </p>
      </div>
    </div>
  );
};

export default Kiosk;
