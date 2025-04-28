import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoPersonCircleSharp } from "react-icons/io5";
import { Calendar, LogOut } from "lucide-react";
import Logo from '/parkingicon.png';
import { BASE_URL } from '@/App';

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
    { label: 'Home', to: '/#home' },
    { label: 'Explore', to: '/#explore' },
    { label: 'How it works', to: '/#howitworks' },
    { label: 'App', to: '/#app' }
  ] 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/');
  };

  // Handle scroll to section
  const handleScrollToSection = (sectionId: string) => {
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
  
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const topPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const paddingAdjustment = 20; // adjust according to your section padding
        
        window.scrollTo({
          top: topPosition - 70,
          behavior: 'smooth',
        });
      }
    };
  
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToElement, 100);
    } else {
      scrollToElement();
    }
  };
  

  // Extract section ID from href
  const getSectionId = (href: string) => {
    if (href.includes('#')) {
      return href.split('#')[1];
    }
    return '';
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`${BASE_URL}/api/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': '444',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          console.log(data);
          
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

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
            <button
              key={index}
              onClick={() => item.to.includes('#') ? handleScrollToSection(getSectionId(item.to)) : navigate(item.to)}
              className="text-slate-800 font-medium relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </div>

        {/* Replace auth buttons with conditional rendering */}
        <div className="hidden md:flex items-center space-x-4">
          {!localStorage.getItem('accessToken') ? (
            <>
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
            </>
          ) : (
            <div className="relative">
              <div className="mr-4 flex translate-y-0.5 items-center space-x-2">
                <IoPersonCircleSharp
                  className="cursor-pointer text-[3rem] text-slate-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                <div>{user?.username || "authenticating..."}</div>
              </div>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg">
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Dashbooard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Update mobile auth buttons */}
        <div className="md:hidden flex items-center space-x-4">
          {!localStorage.getItem('accessToken') ? (
            <Link to={'/login'}>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 font-medium cursor-pointer">
                Login
              </button>
            </Link>
          ) : (
            <div className='relative'>
            <IoPersonCircleSharp
              className="cursor-pointer text-[2.5rem] text-slate-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Dashbooard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
            </div>
          )}
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
              <button
                key={index}
                onClick={() => item.to.includes('#') ? handleScrollToSection(getSectionId(item.to)) : navigate(item.to)}
                className="text-gray-700 font-medium text-left"
              >
                {item.label}
              </button>
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
