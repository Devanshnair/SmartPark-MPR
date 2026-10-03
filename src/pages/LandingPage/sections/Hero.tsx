import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import Banner from '/Banner.png';
import GetUserLocation from '../../../components/GetUserLocation';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    console.log(place)
    if (place && place.formatted_address) {
      setSearchQuery(place.formatted_address);
      setSelectedPlace(place);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      navigate('/map', { state: { searchQuery } });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Checking if valid place is selected and navigating accordingly.
  useEffect(()=>{
    if(selectedPlace) {
      console.log('Valid Place selected, navigating to maps');
      handleSearch();
    }
  },[selectedPlace])

  // Last word color
  useEffect(() => {
    const applyColorToLastWordOfFirstLine = () => {
      const heading = headingRef.current;
      if (!heading) return;
  
      // Remove any existing styling
      const html = heading.innerHTML;
      heading.innerHTML = html.replace(/<\/?span[^>]*>/g, '');
  
      // Get the heading text content
      const text = heading.textContent || '';
      const words = text.split(' ');
      
      // Create a temporary hidden element to measure text width
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = window.getComputedStyle(heading).fontSize;
      tempSpan.style.fontWeight = window.getComputedStyle(heading).fontWeight;
      document.body.appendChild(tempSpan);
      
      let lastWordIndex = -1;
      const headingWidth = heading.offsetWidth;
      
      // Find the last word that fits on the first line
      for (let i = 0; i < words.length; i++) {
        tempSpan.textContent = words.slice(0, i + 1).join(' ');
        if (tempSpan.offsetWidth <= headingWidth) {
          lastWordIndex = i;
        } else {
          break;
        }
      }
      
      document.body.removeChild(tempSpan);
      
      if (lastWordIndex >= 0) {
        // Create new HTML with the last word of first line colored
        const firstPartWords = words.slice(0, lastWordIndex);
        const lastWord = words[lastWordIndex];
        const remainingWords = words.slice(lastWordIndex + 1);
        
        heading.innerHTML = 
          firstPartWords.join(' ') + 
          (firstPartWords.length > 0 ? ' ' : '') + 
          `<span class='text-orange-500'>${lastWord}</span>` + 
          (remainingWords.length > 0 ? ' ' + remainingWords.join(' ') : '');
      }
    };
  
    // Apply styling initially and on window resize
    applyColorToLastWordOfFirstLine();
    window.addEventListener('resize', applyColorToLastWordOfFirstLine);
    
    return () => {
      window.removeEventListener('resize', applyColorToLastWordOfFirstLine);
    };
  }, []);

  

  return (
    <section id="home" className="bg-slate-50 pt-[4.5rem] relative ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-row items-center py-10 gap-10 relative">
          <motion.div
            className="md:w-3/7 mb-10 md:mb-0 flex flex-col gap-8 w-full z-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <GetUserLocation
              divcolor="bg-gray-100 md:bg-black/2"
              textcolor1="md:text-gray-800"
              textcolor2=""
              iconcolor="text-blue-500 md:text-blue-700"
            />
            <div className="flex flex-col">
              <h1
                ref={headingRef}
                className="text-4xl md:text-5xl font-bold mb-4 max-w-lg max-md:text-white"
              >
                Find Parking Spots Near You
              </h1>
              <p className="text-base md:text-lg max-w-lg text-gray-500 max-md:text-gray-200">
                Discover available parking spots in real-time, reserve in advance, and save time.
              </p>
              {isLoaded && (
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <form onSubmit={(e)=> e.preventDefault()} className="relative mt-4 pr-6">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for locations..."
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-gray-400 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500 peer"
                    />
                    {loading ? (
                      <motion.div 
                        className="absolute right-10 top-1/2 -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div 
                          className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                          animate={{ 
                            rotate: 360,
                            transition: {
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }
                          }}
                        />
                      </motion.div>
                    ) : (
                      <Search 
                        className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 peer-focus:text-blue-500 cursor-pointer" 
                        onClick={handleSearch}
                      />
                    )}
                  </form>
                </Autocomplete>
              )}
            </div>
          </motion.div>
          <motion.div
            className="md:w-4/7 flex justify-center items-center max-md:absolute max-md:inset-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={Banner}
              alt="Parking app illustration"
              className="-rotate-y-180 h-full object-cover"
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/60 md:hidden" />
      </div>
    </section>
  );
};

export default Hero;

