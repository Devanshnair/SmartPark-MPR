import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '/parkingicon.png'

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: string;
  navItems?: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ 
  logo = 'Parko',
  navItems = [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/#explore' },
    { label: 'How it works', to: '/#howitworks' },
    { label: 'App', to: '/#app' }
  ] 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);
  

  return (
    <nav className="shadow-sm fixed z-50 py-4 px-6 w-full max-w-screen bg-transparent backdrop-blur-lg h-[4.5rem]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Hamburger menu for mobile - now on the left */}
        <div className="md:hidden">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none mr-4"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Logo */}
        <Link to={'/'}>
        <div className="flex-shrink-0 flex justify-center items-center gap-2 font-bold text-xl cursor-pointer" >
          <div className='h-7 -translate-y-1 [filter:sepia(100%)_hue-rotate(190deg)_saturate(800%)]'>
            <img src={Logo} alt={"logo"} className='h-full object-cover ' />
          </div>
          <p>{logo}</p>
        </div>
        </Link>

        {/* Navigation tabs - desktop with underline animation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              className="text-slate-800 font-medium relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>


        {/* Auth buttons - desktop */}
        <div className="hidden md:flex items-center space-x-4">
            <Link to={'/register'}>
                <button className="px-4 py-2 text-blue-700 hover:bg-gray-50 font-medium border border-blue-700 cursor-pointer rounded-md">
                    Register
                </button>
            </Link>
            <Link to={'/login'}>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 font-medium cursor-pointer">
                    Login
                </button>  
            </Link>
        </div>

        {/* Mobile auth buttons (only visible on mobile) */}
        <div className="md:hidden flex items-center space-x-4">
        <Link to={'/login'}>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 font-medium cursor-pointer">
                    Login
                </button>  
            </Link>
        </div>
      </div>

      {/* Mobile sidebar - opens from left to right */}
      <div className={`fixed top-0 left-0 h-full w-2/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 bg-white h-screen">
          <div className="flex justify-between items-center mb-8 w-full">
            <Link to={'/'}>
            <div className="flex-shrink-0 flex justify-between items-center gap-2 font-bold text-xl cursor-pointer" >
              <div className='h-7 -translate-y-1 [filter:sepia(100%)_hue-rotate(190deg)_saturate(800%)]'>
                <img src={Logo} alt={"logo"} className='h-full object-cover ' />
              </div>
              <p>{logo}</p>
            </div>
            </Link>
            <button 
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col space-y-6">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to} 
                className="text-gray-700 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
