import React from 'react';
import Hero from './sections/Hero';
import Nearby from './sections/Nearby';
import HowItWorks from './sections/HowItWorks';
import DownloadApp from './sections/DownloadApp';
import { APIProvider } from '@vis.gl/react-google-maps';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative pt-[4.5rem]">
      <Hero />
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <Nearby />
      </APIProvider>
      <HowItWorks />
      <DownloadApp />
    </div>
  );
};

export default LandingPage;