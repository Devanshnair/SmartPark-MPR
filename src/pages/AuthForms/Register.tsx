import { FcGoogle } from "react-icons/fc"
import LoginImg from "/LoginImg.svg"
import { CiLock, CiMail, CiUser, CiPhone } from "react-icons/ci"
import { IoArrowBack } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { BASE_URL } from "@/App"

const Register = () => {
  const navigate = useNavigate()
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    isParkingOwner: false
  })

  const [parkingData, setParkingData] = useState({
    parking_name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    total_slots: "",
    hourlyRate: "",
    dailyRate: "",
    monthlyRate: "",
    openingHours: "",
    description: "",
    levels: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleParkingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setParkingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)' // Optional but recommended
          }
        }
      )
      const data = await response.json()
  
      if (data.length > 0) {
        const { lat, lon } = data[0]
        setParkingData(prev => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }))
      } else {
        console.warn('No coordinates found for the provided address.')
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.isParkingOwner) {
      setFormStep(2)
    } else {
      try {
        const response = await fetch(`${BASE_URL}/api/user/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          })
        })

        if (response.status === 201) {
          navigate('/login')
        }
      } catch (error) {
        console.error('Registration failed:', error)
      }
    }
  }

  const handleParkingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await getCoordinates(parkingData.address)
    try {
      const response = await fetch(`${BASE_URL}/api/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            is_parking_owner: true,
            ...parkingData,
        })
      })

      if (response.status === 201) {
        navigate('/login')
      }
    } catch (error) {
      console.error('Parking registration failed:', error)
    }
  }

  return (
    <div className='flex justify-center items-center gap-12 max-w-[60rem] w-full px-12 mx-auto'>
      <div className='flex flex-col justify-center items-center gap-6 md:w-1/2 sm:w-2/3 w-full px-2 h-full min-h-[calc(100vh-4.5rem)] pt-[5.5rem]'>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-4 mb-2">
            {formStep === 2 && (
              <button 
                onClick={() => setFormStep(1)} 
                className="p-1 rounded-full w-fit cursor-pointer"
              >
                <IoArrowBack size={24} />
              </button>
            )}
            <div>
              <p className="text-4xl font-semibold mb-4">Register</p>
              <p className="text-gray-600">Let's get started!</p>
            </div>
          </div>
          {formData.isParkingOwner && (
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                style={{ width: `${formStep === 1 ? "50%" : "100%"}` }}
              />
            </div>
          )}
        </div>
        {formStep === 1 ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center gap-4">
            <label className="relative w-full flex justify-center items-center">
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name" 
                className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"
              />
              <CiUser className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="relative w-full flex justify-center items-center">
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username" 
                className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"
              />
              <CiUser className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="relative w-full flex justify-center items-center">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email" 
                className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"
              />
              <CiMail className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="relative w-full flex justify-center items-center">
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password" 
                className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"
              />
              <CiLock className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="relative w-full flex justify-center items-center">
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number" 
                className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"
              />
              <CiPhone className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="flex justify-start gap-2 w-full px-1">
              <input 
                type="checkbox"
                name="isParkingOwner"
                checked={formData.isParkingOwner}
                onChange={handleInputChange}
              />
              <p className="text-sm">Register as Parking Space Owner</p>
            </label>
            <button type="submit" className="rounded-lg px-4 py-2 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer transition">
              Register
            </button>
            <p className="w-full">
              Already a member?
              <Link to={"/login"}>
                {" "}
                <span className="text-base text-blue-500 hover:underline">
                  Login
                </span>
              </Link>
            </p>
            <div className="relative w-full flex justify-center items-center">
              <div className="absolute left-0 w-[calc(50%-15px)] border-b border-gray-300"/>
              <div className="absolute right-0 w-[calc(50%-15px)] border-b border-gray-300"/>
              <p className="text-lg text-gray-500">or</p>
            </div>
            <button className="flex justify-center items-center gap-4 border border-gray-300 rounded-lg px-8 py-2 cursor-pointer hover:bg-gray-100">
              <FcGoogle size={22}/>
              <p className="font-bold">Sign up with google</p>
            </button>
          </form>
        ) : (
          <form onSubmit={handleParkingSubmit} className="w-full flex flex-col justify-center items-center gap-4 h-full pb-8">
            <input 
              type="text"
              name="parking_name"
              value={parkingData.parking_name}
              onChange={handleParkingInputChange}
              placeholder="Parking Name"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
              required
            />
            <textarea
              name="address"
              value={parkingData.address}
              onChange={handleParkingInputChange}
              placeholder="Address"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
              required
            />
            <input 
              type="number"
              name="total_slots"
              value={parkingData.total_slots}
              onChange={handleParkingInputChange}
              placeholder="Total Parking Slots"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
              required
            />
            <input 
              type="number"
              name="hourlyRate"
              value={parkingData.hourlyRate}
              onChange={handleParkingInputChange}
              placeholder="Hourly Rate"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
              required
            />
            <input 
              type="number"
              name="dailyRate"
              value={parkingData.dailyRate}
              onChange={handleParkingInputChange}
              placeholder="Daily Rate"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <input 
              type="number"
              name="monthlyRate"
              value={parkingData.monthlyRate}
              onChange={handleParkingInputChange}
              placeholder="Monthly Rate"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <input 
              type="text"
              name="openingHours"
              value={parkingData.openingHours}
              onChange={handleParkingInputChange}
              placeholder="Opening Hours"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <input 
              type="number"
              name="levels"
              value={parkingData.levels}
              onChange={handleParkingInputChange}
              placeholder="Number of Levels"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <textarea
              name="description"
              value={parkingData.description}
              onChange={handleParkingInputChange}
              placeholder="Description"
              className="px-4 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition"
            />
            <button type="submit" className="rounded-lg px-4 py-2 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer transition">
              Register Parking Space
            </button>
          </form>
        )}
      </div>
      <div className="w-1/2 h-screen max-md:hidden">
        <img src={LoginImg} alt='Image' className='h-full object-contain'/>
      </div>
    </div>
  )
}

export default Register