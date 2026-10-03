import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Car, ArrowRight, MapPinCheck } from "lucide-react";
import { motion } from "framer-motion";

export interface ParkingSpotCardData {
  id?: string | number;
  name: string;
  address?: string;
  distance?: string;
  time?: string;
  spots?: number;
  availableSpots?: number;
  price?: string | number;
  rating: number;
  imageUrl?: string;
  availableTypes?: string[];
  reviews?: number;
  viewOnMap?: boolean;
}

interface ParkingSpotCardProps {
  spot: ParkingSpotCardData;
  layout: "horizontal" | "vertical";
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ spot, layout }) => {
  const navigate = useNavigate();

  const truncateAddress = (address: string) => {
    return address.length > 35 ? address.substring(0, 35) + "..." : address;
  };

  if (layout === "horizontal") {
    return (
      <div
        
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden p-4"
      >
        <div className="flex gap-4">
          {/* Left side - Image */}
          <div className="w-1/4">
            <img src={spot.imageUrl} alt={spot.name} className="w-full aspect-square object-cover rounded-lg" />
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
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(spot.rating) ? "text-yellow-300 fill-yellow-300" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="text-sm text-gray-600">({spot.reviews} 24 reviews)</span>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center font-semibold justify-between pt-3 ">
          <div className="flex justify-center items-center gap-10 max-[500px]:text-sm">
            <span className="">₹{spot.price}/hr</span>
            <span className="flex justify-center items-center gap-1 text-sm">
              <Car className="h-5 w-5" /> {spot.spots} available
            </span>
          </div>
          <button className="flex justify-center items-center gap-6">
          {spot.viewOnMap && (
              <MapPinCheck  className="text-slate-800 hover:text-red-600 cursor-pointer"/>
            )}
          <motion.button
            className="relative px-1 py-1 max-[500px]:size-8 size-9 bg-blue-700 text-white rounded-full overflow-hidden flex justify-center items-center gap-2 cursor-pointer"
            whileHover="hover"
            initial="initial"
            >
            <motion.div
              variants={{
                initial: { x: 0 },
                hover: { x: [0, 100, -100, 0] }
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.3, 0.3, 1],
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="max-[500px]:size-5 size-6"  onClick={() => navigate(`/parkingprofile/${spot.id}`)}/>
            </motion.div>
          </motion.button>
          </button>
        </div>
      </div>
    );
  }

  // Vertical Card
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <img
            src={spot.imageUrl || "https://placehold.co"}
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
            <span className="text-sm">{spot.availableSpots} spots left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="default" className="w-[48%]" onClick={() => navigate(`/parkingprofle/${spot.id}`)}>
          Book Now
        </Button>
        <Button variant="outline" className="w-[48%]">
          View on Map
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ParkingSpotCard;
