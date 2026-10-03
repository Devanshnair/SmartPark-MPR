import React from 'react';
import { motion } from 'framer-motion';

const DownloadApp: React.FC = () => {
  return (
    <section id="app" className="py-10 md:py-20 max-sm:bg-black/85 bg-slate-200 text-black mt-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center">
          <motion.div 
            className="sm:w-1/2 mb-0 order-2 md:order-1 max-md:z-10 max-sm:text-slate-100"
            initial={{
              opacity: 0,
              x: -20,
              ...(window.innerWidth <= 640 && {
                y:20,
                x:0,
              })
            }}
            whileInView={{ opacity: 1, x: 0, y:0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Pay. Park. Go.</h2>
            <p className="text-base md:text-lg mb-8">Parking's even easier with the app. Download Now!</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="flex items-center justify-center gap-2 rounded-lg cursor-pointer px-3 md:px-4 py-2 bg-slate-200 sm:bg-black text-black sm:text-white max-md:text-sm font-medium md:font-bold hover:bg-black/90 transition duration-300">
                <svg className="size-7 md:size-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_8317)"/>
                  <path d="M18.4468 8.65403C18.7494 8.12586 18.5685 7.45126 18.0428 7.14727C17.5171 6.84328 16.8456 7.02502 16.543 7.55318L16.0153 8.47442L15.4875 7.55318C15.1849 7.02502 14.5134 6.84328 13.9877 7.14727C13.462 7.45126 13.2811 8.12586 13.5837 8.65403L14.748 10.6864L11.0652 17.1149H8.09831C7.49173 17.1149 7 17.6089 7 18.2183C7 18.8277 7.49173 19.3217 8.09831 19.3217H18.4324C18.523 19.0825 18.6184 18.6721 18.5169 18.2949C18.3644 17.7279 17.8 17.1149 16.8542 17.1149H13.5997L18.4468 8.65403Z" fill="white"/>
                  <path d="M11.6364 20.5419C11.449 20.3328 11.0292 19.9987 10.661 19.8888C10.0997 19.7211 9.67413 19.8263 9.45942 19.9179L8.64132 21.346C8.33874 21.8741 8.51963 22.5487 9.04535 22.8527C9.57107 23.1567 10.2425 22.975 10.5451 22.4468L11.6364 20.5419Z" fill="white"/>
                  <path d="M22.2295 19.3217H23.9017C24.5083 19.3217 25 18.8277 25 18.2183C25 17.6089 24.5083 17.1149 23.9017 17.1149H20.9653L17.6575 11.3411C17.4118 11.5757 16.9407 12.175 16.8695 12.8545C16.778 13.728 16.9152 14.4636 17.3271 15.1839C18.7118 17.6056 20.0987 20.0262 21.4854 22.4468C21.788 22.975 22.4594 23.1567 22.9852 22.8527C23.5109 22.5487 23.6918 21.8741 23.3892 21.346L22.2295 19.3217Z" fill="white"/>
                  <defs>
                  <linearGradient id="paint0_linear_87_8317" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2AC9FA"/>
                  <stop offset="1" stopColor="#1F65EB"/>
                  </linearGradient>
                  </defs>
                </svg>
                App Store
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg cursor-pointer px-3 md:px-4 py-2 bg-slate-200 sm:bg-black text-black sm:text-white max-md:text-sm font-medium md:font-bold hover:bg-black/90 transition duration-300">
                <svg className="size-6 md:size-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_87_8320" style={{ maskType:"alpha"}} maskUnits="userSpaceOnUse" x="7" y="3" width="24" height="26">
                <path d="M30.0484 14.4004C31.3172 15.0986 31.3172 16.9014 30.0484 17.5996L9.75627 28.7659C8.52052 29.4459 7 28.5634 7 27.1663L7 4.83374C7 3.43657 8.52052 2.55415 9.75627 3.23415L30.0484 14.4004Z" fill="#C4C4C4"/>
                </mask>
                <g mask="url(#mask0_87_8320)">
                <path d="M7.63473 28.5466L20.2923 15.8179L7.84319 3.29883C7.34653 3.61721 7 4.1669 7 4.8339V27.1664C7 27.7355 7.25223 28.2191 7.63473 28.5466Z" fill="url(#paint0_linear_87_8320)"/>
                <path d="M30.048 14.4003C31.3169 15.0985 31.3169 16.9012 30.048 17.5994L24.9287 20.4165L20.292 15.8175L24.6923 11.4531L30.048 14.4003Z" fill="url(#paint1_linear_87_8320)"/>
                <path d="M24.9292 20.4168L20.2924 15.8179L7.63477 28.5466C8.19139 29.0232 9.02389 29.1691 9.75635 28.766L24.9292 20.4168Z" fill="url(#paint2_linear_87_8320)"/>
                <path d="M7.84277 3.29865L20.2919 15.8177L24.6922 11.4533L9.75583 3.23415C9.11003 2.87878 8.38646 2.95013 7.84277 3.29865Z" fill="url(#paint3_linear_87_8320)"/>
                </g>
                <defs>
                <linearGradient id="paint0_linear_87_8320" x1="15.6769" y1="10.874" x2="7.07106" y2="19.5506" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00C3FF"/>
                <stop offset="1" stopColor="#1BE2FA"/>
                </linearGradient>
                <linearGradient id="paint1_linear_87_8320" x1="20.292" y1="15.8176" x2="31.7381" y2="15.8176" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFCE00"/>
                <stop offset="1" stopColor="#FFEA00"/>
                </linearGradient>
                <linearGradient id="paint2_linear_87_8320" x1="7.36932" y1="30.1004" x2="22.595" y2="17.8937" gradientUnits="userSpaceOnUse">
                <stop stopColor="#DE2453"/>
                <stop offset="1" stopColor="#FE3944"/>
                </linearGradient>
                <linearGradient id="paint3_linear_87_8320" x1="8.10725" y1="1.90137" x2="22.5971" y2="13.7365" gradientUnits="userSpaceOnUse">
                <stop stopColor="#11D574"/>
                <stop offset="1" stopColor="#01F176"/>
                </linearGradient>
                </defs>
                </svg>
                Google Play
              </button>
            </div>
          </motion.div>
          <motion.div 
            className="sm:w-1/2 w-full order-1 md:order-2 absolute bottom-0 right-0 max-md:z-0 "
            initial={{
              opacity: 0,
              x: 20,
              ...(window.innerWidth <= 640 && {  
                scale: 0.8, 
                x: 0,
                y:0
              })
            }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="relative">
              <img 
                src="/App.png" 
                alt="Mobile app screenshot" 
                className="mx-auto rounded-xl max-sm:opacity-50"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;