// import React, { createContext, useContext, useEffect, useState } from 'react';

// interface GoogleMapsContextProps {
//   isLoaded: boolean;
//   loadError: Error | null;
// }

// const GoogleMapsContext = createContext<GoogleMapsContextProps>({
//   isLoaded: false,
//   loadError: null
// });

// interface GoogleMapsApiProviderProps {
//   apiKey: string;
//   children: React.ReactNode;
// }

// export const GoogleMapsApiProvider: React.FC<GoogleMapsApiProviderProps> = ({ apiKey, children }) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [loadError, setLoadError] = useState<Error | null>(null);

//   useEffect(() => {
//     if (!apiKey) {
//       setLoadError(new Error('Google Maps API key is required'));
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.id = 'google-maps-script';
    
//     script.addEventListener('load', () => {
//       setIsLoaded(true);
//     });

//     script.addEventListener('error', (error) => {
//       setLoadError(new Error('Failed to load Google Maps API'));
//     });

//     document.head.appendChild(script);

//     return () => {
//       const existingScript = document.getElementById('google-maps-script');
//       if (existingScript) {
//         existingScript.remove();
//       }
//     };
//   }, [apiKey]);

//   return (
//     <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
//       {children}
//     </GoogleMapsContext.Provider>
//   );
// };

// export const useGoogleMapsApi = () => useContext(GoogleMapsContext);