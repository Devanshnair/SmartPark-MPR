import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Map, Marker, InfoWindow, useApiIsLoaded } from '@vis.gl/react-google-maps';
import ParkingSpotCard from '@/components/ParkingSpotCard';
import { PARKING_SPOTS, ParkingSpot } from '@/data/parking-spots';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/App';

const Nearby: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(PARKING_SPOTS);
  const [isLoading, setIsLoading] = useState(true);
  const apiIsLoaded = useApiIsLoaded();

  // Handle marker click to toggle InfoWindow
  const handleMarkerClick = useCallback(() => {
    setInfoWindowOpen((prev) => !prev);
  }, []);

  // Get current location and fetch nearby spots
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoading(true);

          try {
            const response = await fetch(`${BASE_URL}/reservation/parking-area/nearby/?user-lat=${latitude}&user-long=${longitude}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "ngrok-skip-browser-warning": "true",
              }
            });

            if (response.ok) {
              const data: ParkingSpot[] = await response.json();
              setParkingSpots(data);
            } else {
              setParkingSpots(PARKING_SPOTS);
            }
          } catch (error) {
            console.error('Error fetching nearby parking spots:', error);
            setParkingSpots(PARKING_SPOTS);
          } finally {
            setIsLoading(false);
            console.log(parkingSpots);
            
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setParkingSpots(PARKING_SPOTS);
          setIsLoading(false);
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
            location: userLocation,
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
          <h2 className="max-[500px]:text-2xl text-3xl font-bold mb-4">
            Explore Nearby Parking
          </h2>
          <p className="max-[500px]:text-sm text-base text-gray-600 max-w-3xl mx-auto">
            Find and reserve parking spots in your area with real-time availability and competitive pricing.
          </p>
        </motion.div>

        <div className="flex flex-col-reverse md:flex-row gap-6 border-none">
          {/* Parking Spots Listing (Left Column - 3/5 width) */}
          <div className="md:w-3/5 space-y-4 md:px-4">
            {isLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading nearby parking spots...</p>
                </div>
              </div>
            ) : (
              parkingSpots.slice(0, 3).map((spot, index) => (
                <Link to={`/parkingprofile/${spot.id}`} key={spot.id}>
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
                  >
                    <ParkingSpotCard
                      spot={{
                        id: spot.id.toString(),
                        name: spot.parking_user.parking_name,
                        address: spot.parking_user.address,
                        distance: `${(spot.distance).toFixed(1)} km`,
                        spots: spot.available_slots,
                        price: spot.parking_user.hourlyRate.toString(),
                        rating: spot.parking_user.rating,
                        imageUrl: spot.parking_user.image_url || 'default-parking-image.jpg',
                        availableTypes: spot.parking_user.availableTypes.split(','),
                        time: `${index == 0 ? '7 mins' : index == 1 ? '12 mins' : '14 mins'}` // This could be calculated based on distance
                      }}
                      layout="horizontal"
                    />
                  </motion.div>
                </Link>
              ))
            )}
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
                    <Marker position={userLocation} onClick={handleMarkerClick} />
                    {infoWindowOpen && (
                      <InfoWindow
                        position={userLocation}
                        onCloseClick={handleMarkerClick}
                        pixelOffset={[0, -30]}
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
