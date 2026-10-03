import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';

// Define the step data structure
interface Step {
  number: number;
  title: string;
  imageUrl: string;
}

const HowItWorks: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
  
  // Step data
  const steps: Step[] = [
    {
      number: 1,
      title: "Find Parking by Location",
      imageUrl: "https://img.freepik.com/free-vector/taxi-online-service-illustration-car-city-map-with-navigation-pin-smartphone_33099-593.jpg?t=st=1741544145~exp=1741547745~hmac=72235a322f48ebd49d094a6fa2ba39847db28333bd2d0dc34bffdfeef527281f&w=1380"
    },
    {
      number: 2,
      title: "Choose Time & Vehicle",
      imageUrl: "/SelectTime&Vehicle.jpeg"
    },
    {
      number: 3,
      title: "Make Payment & Book Slot",
      imageUrl: "https://img.freepik.com/free-vector/hands-holding-credit-card-mobile-phone-with-banking-app-person-paying-with-bank-card-transferring-money-shopping-online-flat-vector-illustration-payment-finance-concept_74855-24760.jpg?t=st=1741547152~exp=1741550752~hmac=b1118d02af139c506efca1d1e3ddb98cfb5c713d80cba310958a478b2c877d74&w=826"
    },
    {
      number: 4,
      title: "Scan QR for Entry & Exit",
      imageUrl: "https://img.freepik.com/free-vector/smartphone-scanning-qr-code_23-2148629213.jpg?t=st=1741547525~exp=1741551125~hmac=2990bb8dc1f15e083594fcc20fdb4bd19cc8f1b26d1144d77bed75faf2f1ad30&w=900"
    }
  ];

  // Reset hovered state when mouse leaves the section
  const handleMouseLeave = () => {
    setHoveredStep(null);
  };
  
  return (
    <div 
      ref={sectionRef} 
      id="howitworks"
      className="py-16 md:py-24 bg-slate-50"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="max-[500px]:text-2xl text-3xl md:text-5xl font-bold mb-4">We Make a Difference</h2>
          <p className="max-[500px]:text-sm text-base text-gray-500 max-w-3xl mx-auto">
            Parko puts the power to park in your hands. Whether you're looking for a spot now or reserving a spot for 
            later, Parko has you covered.
          </p>
          <motion.div 
            className="mt-8 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-orange-400 hover:bg-orange-400 text-black font-medium max-[500px]:py-[10px] py-3 max-[500px]:px-5 px-8 transition-colors uppercase max-[500px]:text-xs text-sm tracking-wide">
              HOW IT WORKS
            </button>
          </motion.div>
        </motion.div>
        
        <div className="lg:flex justify-center gap-6 md:gap-4 items-center
                max-[500px]:flex max-[500px]:flex-col min-[500px]:grid min-[500px]:grid-cols-2 place-items-center lg:flex-row">

          {steps.map((step, index) => (
            <StepCard 
              key={step.number}
              step={step}
              isHovered={hoveredStep === index}
              onHover={() =>{ window.innerWidth > 768 ? setHoveredStep(index) : setHoveredStep(null)}}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StepCardProps {
  step: Step;
  isHovered: boolean;
  onHover: () => void;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, isHovered, onHover, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className={`relative group transition-all duration-500 ease-out w-full ${isHovered ? 'md:w-[100%] lg:w-[27%] sm:h-[400px]' : 'md:w-[90%] lg:w-[20%] h-[320px]'}`}>
      <motion.div
        ref={ref}
        className="bg-white border border-black overflow-hidden flex flex-col relative z-10 w-full h-full"
        initial={{ 
          opacity: 0, 
          y: 50, 
          x: 0, // Default no x animation
          ...(window.innerWidth <= 1024 && {  // Only apply x animation for lg and below
            x: index % 2 === 0 ? -50 : +50, // Even index: x=50, Odd index: x=-50
            y: 0 // Disable y animation
          })
        }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        onMouseEnter={onHover}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4">
            <div className="bg-orange-400 w-12 h-12 flex items-center justify-center text-xl sm:text-2xl font-bold mb-4">
              {step.number}
            </div>
            <h3 className="text-lg sm:text-xl font-bold">{step.title}</h3>
          </div>

          <div className="relative flex-grow mt-4 overflow-hidden">
            <AnimatePresence>
              {!isHovered ? (
                <motion.div
                  key="normal"
                  className="absolute inset-0"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src={step.imageUrl} 
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="hovered"
                  className="absolute inset-0"
                  initial={{ clipPath: "polygon(0 0, 0 0, 0 0)" }}
                  animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="w-full h-full origin-top-left"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <img 
                      src={step.imageUrl} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Diagonal flip overlay */}
            <AnimatePresence mode="wait">
              {isHovered ? (
                // Hover State: Peeling Effect
                <motion.div
                  key="hovered"
                  className="absolute inset-0"
                  initial={{ clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)" }}
                  animate={{ clipPath: "polygon(141.42% -120%, -120% 141.42%, 141.42% 141.42%)" }}
                  exit={{ clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)" }} // Reverse animation
                  transition={{ duration: 0.7, ease: [0.645, 0.045, 0.355, 1] }}
                >
                  <motion.div
                    className="w-full h-full origin-bottom-left"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1 }}
                    exit={{ scale: 1 }} // Reverse animation for scaling
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <img 
                      src={step.imageUrl} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              ) : (
                // Default (Normal) State
                <motion.div
                  key="normal"
                  className="absolute inset-0"
                  initial={{ opacity: 0, clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)" }}
                  animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                  exit={{ opacity: 0, clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)" }} // Reverse animation
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <img 
                    src={step.imageUrl} 
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <div className='h-full w-full absolute top-1 -right-1 bg-black z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-md:hidden'/>
    </div>
  );
};


export default HowItWorks;