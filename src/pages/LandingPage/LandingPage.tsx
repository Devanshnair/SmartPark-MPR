import React from 'react';
import Hero from './sections/Hero';
import Nearby from './sections/Nearby';
import HowItWorks from './sections/HowItWorks';
import DownloadApp from './sections/DownloadApp';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative pt-[4.5rem]">
      <Hero />
      <Nearby />
      <HowItWorks />
      <DownloadApp />
    </div>
  );
};

export default LandingPage;