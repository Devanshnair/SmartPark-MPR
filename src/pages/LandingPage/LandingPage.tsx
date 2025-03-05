import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// For Google Maps integration
declare global {
  interface Window {
    google: any;
  }
}

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

const LandingPage: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
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

  // Initialize Google Maps
  useEffect(() => {
    // In a real application, you would load the Google Maps API here
    // For this example, we'll simulate the map initialization
    const initMap = () => {
      if (window.google && window.google.maps) {
        const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 14
        });
        setMap(mapInstance);

        // Create markers for each parking spot
        const newMarkers = spots.map(spot => {
          const marker = new window.google.maps.Marker({
            position: { lat: spot.lat, lng: spot.lng },
            map: mapInstance,
            title: spot.name
          });

          // Add click event to markers
          marker.addListener('click', () => {
            setSelectedSpot(spot.id);
          });

          return marker;
        });

        setMarkers(newMarkers);
      }
    };

    // In a real app, you would load the Google Maps script here
    // For now, we'll just call the initialization function directly
    // This would be replaced with actual Google Maps script loading
    if (document.getElementById('map')) {
      // Simulating Google Maps being available - in production this would be loaded properly
      window.google = { 
        maps: { 
          Map: function(el: HTMLElement, options: any) { 
            return { 
              setCenter: function() {},
              setZoom: function() {}
            }; 
          },
          Marker: function(options: any) { 
            return { 
              addListener: function() {} 
            }; 
          }
        }
      };
      initMap();
    }
  }, [spots]);

  // Update map when selected spot changes
  useEffect(() => {
    if (map && selectedSpot) {
      const spot = spots.find(s => s.id === selectedSpot);
      if (spot) {
        map.setCenter({ lat: spot.lat, lng: spot.lng });
        map.setZoom(16);
      }
    }
  }, [selectedSpot, map, spots]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Perfect Parking Spots Near You</h1>
              <p className="text-lg md:text-xl mb-8">Discover available parking spots in real-time, reserve in advance, and save time.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition duration-300">Get Started</button>
                <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">Learn More</button>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="/api/placeholder/600/400" 
                alt="Parking app illustration" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Explore Section with Google Maps */}
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
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Parking Spots Listing (Left Column - 3/5 width) */}
            <motion.div 
              className="lg:w-3/5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                {spots.map(spot => (
                  <div 
                    key={spot.id}
                    className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition duration-300 hover:shadow-lg ${selectedSpot === spot.id ? 'border-2 border-blue-500' : ''}`}
                    onClick={() => setSelectedSpot(spot.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{spot.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{spot.address}</p>
                        <div className="flex items-center space-x-1 mb-2">
                          {renderStars(spot.rating)}
                          <span className="text-sm text-gray-600 ml-1">({spot.rating})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{spot.distance}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="text-sm">
                        <span className="font-medium">{spot.spots} spots available</span>
                      </div>
                      <div>
                        <span className="font-bold text-green-600">{spot.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Google Maps (Right Column - 2/5 width) */}
            <motion.div 
              className="lg:w-2/5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div id="map" className="h-96 lg:h-full rounded-lg shadow-md bg-gray-200"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our platform makes finding and reserving parking spots simple and stress-free.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Find",
                desc: "Search for parking spots near your destination and compare prices.",
                icon: (
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                title: "Reserve",
                desc: "Book your parking spot in advance to ensure availability when you arrive.",
                icon: (
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Park",
                desc: "Follow directions to your reserved spot and enjoy hassle-free parking.",
                icon: (
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Section */}
      <section id="app" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0 order-2 md:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-lg mb-8">Get the full experience with our mobile app. Find parking spots, make reservations, and pay securely all from your phone.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.707 9.293l-5-5a.999.999 0 00-1.414 0l-5 5a.999.999 0 101.414 1.414L12 6.414l4.293 4.293a.999.999 0 101.414-1.414zM17.707 14.707a.997.997 0 00-1.414 0L12 18.586l-4.293-4.293a.999.999 0 10-1.414 1.414l5 5a.999.999 0 001.414 0l5-5a.999.999 0 000-1.414z" />
                  </svg>
                  App Store
                </button>
                <button className="flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition duration-300">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                  </svg>
                  Google Play
                </button>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img 
                  src="/api/placeholder/300/600" 
                  alt="Mobile app screenshot" 
                  className="mx-auto rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">Free!</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;