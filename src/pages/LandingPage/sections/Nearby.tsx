import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { APIProvider, Map, Marker, InfoWindow, useApiIsLoaded } from '@vis.gl/react-google-maps';
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const apiIsLoaded = useApiIsLoaded();

    // Handle marker click to toggle InfoWindow
    const handleMarkerClick = useCallback(() => {
      setInfoWindowOpen((prev) => !prev);
    }, []);


  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.error(`lat: ${latitude}, lng: ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Geocode the user's location to get the address
  useEffect(() => {
    const geocodeLocation = async () => {
      if (userLocation && apiIsLoaded && window.google) {
        try {
          const geocoder = new window.google.maps.Geocoder();
          const response = await geocoder.geocode({ 
            location: userLocation 
          });

          if (response.results?.[0]) {
            setAddress(response.results[0].formatted_address);
          }
        } catch (error) {
          console.error('Geocoding failed:', error);
        }
      }
    };

    geocodeLocation();
  }, [userLocation, apiIsLoaded]);

  useEffect(() => {
    if (apiIsLoaded && userLocation) {
      setIsMapReady(true);
    }
  }, [apiIsLoaded, userLocation]);

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
          <h2 className="max-[500px]:text-2xl text-3xl font-bold mb-4">Explore Nearby Parking</h2>
          <p className="max-[500px]:text-sm text-base text-gray-600 max-w-3xl mx-auto">
            Find and reserve parking spots in your area with real-time availability and competitive pricing.
          </p>
        </motion.div>

        <div className="flex flex-col-reverse md:flex-row gap-6 border-none">
          {/* Parking Spots Listing (Left Column - 3/5 width) */}
          <div className="md:w-3/5 space-y-4 md:px-4">
            {PARKING_SPOTS.slice(0, 3).map((spot, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                  ...(window.innerWidth <= 1024 && {
                    x: index % 2 === 0 ? -50 : +50,
                  }),
                }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.8 }}
                key={spot.id}
              >
                <ParkingSpotCard spot={spot} layout="horizontal" />
              </motion.div>
            ))}
          </div>

          {/* Google Maps (Right Column - 2/5 width) */}
          <motion.div
            className="w-full max-sm:h-[28.5vh] max-md:h-[35vh] md:w-2/5 rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isMapReady && userLocation ? (
              <Map
                defaultZoom={16}
                defaultCenter={userLocation}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                // mapId={import.meta.env.VITE_MAPS_MAP_ID}
              >
                {userLocation && (
                  <>
                    <Marker 
                      position={userLocation} 
                      onClick={handleMarkerClick}
                    />
                    {infoWindowOpen && (
                      <InfoWindow 
                        position={userLocation} 
                        onCloseClick={handleMarkerClick}
                        options={{
                          pixelOffset: new window.google.maps.Size(0, -30)
                        }}
                      >
                        <div className="p-2">
                          <h2 className="font-semibold mb-2">Your Location</h2>
                          <p>{address || 'Fetching address...'}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </>
                )}
              </Map>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading Map...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Nearby;
