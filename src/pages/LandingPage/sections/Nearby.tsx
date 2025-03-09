import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import { PARKING_SPOTS } from '@/data/parking-spots';

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  distance: string;
  spots: number;
  price: string;
  rating: number;
  lat: number;
  lng: number;
}

const Nearby: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [spots, setSpots] = useState<ParkingSpot[]>([
    {
      id: '1',
      name: 'Downtown Parking',
      address: '123 Main St, Downtown',
      distance: '0.2 miles',
      spots: 15,
      price: '$2.50/hr',
      rating: 4.2,
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: '2',
      name: 'Central Garage',
      address: '456 Park Ave, Central',
      distance: '0.5 miles',
      spots: 32,
      price: '$3.00/hr',
      rating: 4.5,
      lat: 40.7138,
      lng: -74.0070
    },
    {
      id: '3',
      name: 'Westside Parking Lot',
      address: '789 West St, Westside',
      distance: '0.7 miles',
      spots: 8,
      price: '$2.00/hr',
      rating: 3.8,
      lat: 40.7148,
      lng: -74.0090
    },
    {
      id: '4',
      name: 'East End Garage',
      address: '321 East End Ave',
      distance: '1.1 miles',
      spots: 25,
      price: '$1.75/hr',
      rating: 4.0,
      lat: 40.7158,
      lng: -74.0040
    }
  ]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  })

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(userLocation)
    if (map) {
      map.fitBounds(bounds);
    }
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a.75.75 0 01.671.415l1.88 3.8 4.295.619a.75.75 0 01.415 1.279l-3.128 3.04.755 4.397a.75.75 0 01-1.088.791L10 14.347l-3.8 1.997a.75.75 0 01-1.088-.79l.755-4.398-3.128-3.04a.75.75 0 01.415-1.28l4.295-.618 1.88-3.8A.75.75 0 0110 2zm0 2.445L8.615 7.31a.75.75 0 01-.564.41l-3.064.442 2.213 2.15a.75.75 0 01.216.664l-.517 3.012 2.702-1.42a.75.75 0 01.698 0l2.701 1.42-.516-3.012a.75.75 0 01.216-.664l2.213-2.15-3.064-.442a.75.75 0 01-.564-.41L10 4.445z" clipRule="evenodd" />
        </svg>
      );
    }

    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  // Get current Location and set to state
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <section id="explore" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Explore Nearby Parking</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Find and reserve parking spots in your area with real-time availability and competitive pricing.</p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-6 border-none">
          {/* Parking Spots Listing (Left Column - 3/5 width) */}
          <motion.div
            className="lg:w-3/5 space-y-4 px-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {PARKING_SPOTS.slice(0, 3).map((spot) => (
              <ParkingSpotCard key={spot.id} spot={spot} layout="horizontal" />
            ))}
          </motion.div>
          
          {/* Google Maps (Right Column - 2/5 width) */}
          <motion.div 
            className="lg:w-2/5 rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isLoaded && userLocation ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={userLocation}
                zoom={15}
                options={{
                  mapTypeControl: false, // Removes "Map", "Satellite", and "Terrain" options
                  streetViewControl: false, // Removes Street View option
                  fullscreenControl: false, // Removes fullscreen button
                }}
              >
                {/* Show User's Location */}
                <Marker position={userLocation} />
              </GoogleMap>
            ) : (
              <p>Loading Map...</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Nearby;