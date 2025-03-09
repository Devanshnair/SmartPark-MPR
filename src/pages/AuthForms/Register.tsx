import { FcGoogle } from "react-icons/fc"
import LoginImg from "/LoginImg.svg"
import { AiOutlineMail } from "react-icons/ai"
import { CiLock, CiMail, CiUser } from "react-icons/ci"
import { Link } from "react-router-dom"

const Register = () => {
  return (
    <div className='flex justify-center items-center gap-10 max-w-4xl w-full mx-auto'>
        <div className='flex flex-col justify-center items-center gap-6 w-1/2 h-screen'>
          <div className="flex flex-col gap-3 w-full mb-2">
            <p className="text-4xl font-semibold">Register</p>
            <p className="text-gray-600">Let's get started!</p>
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-4">
            <label className="relative w-full flex justify-center items-center">
              <input type="tetx" placeholder="Full Name" className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"/>
              <CiUser className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="relative w-full flex justify-center items-center">
              <input type="email" placeholder="Email" className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"/>
              <CiMail className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="relative w-full flex justify-center items-center">
              <input type="password" placeholder="Password" className="peer px-10 py-2 w-full rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500 placeholder:text-sm focus:placeholder-transparent"/>
              <CiLock className="peer-focus:text-blue-600 absolute left-4 top-3.5 text-slate-500"/>
            </label>
            <label className="flex justify-start gap-2 w-full px-1">
              <input type="checkbox"/>
              <p className="text-sm">Register as Parking Space Owner</p>
            </label>
            <button className="rounded-lg px-4 py-2 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer transition">Login</button>
            <p className="w-full">
              Already a member?
              <Link to={"/login"}>
                {" "}
                <span className="text-base text-blue-500 hover:underline">
                  Login
                </span>
              </Link>
            </p>
          </div>
          <div className="relative w-full flex justify-center items-center">
            <div className="absolute left-0 w-[calc(50%-15px)] border-b border-gray-300"/>
            <div className="absolute right-0 w-[calc(50%-15px)] border-b border-gray-300"/>
            <p className="text-lg text-gray-500">or</p>
          </div>
          <button className="flex justify-center items-center gap-4 border border-gray-300 rounded-lg px-8 py-2 cursor-pointer hover:bg-gray-100">
            <FcGoogle size={22}/>
            <p className="font-bold">Sign up with google</p>
          </button>
        </div>
        <div className="w-1/2 h-screen">
            <img src={LoginImg} alt='Image' className='h-full object-contain'/>
        </div>
    </div>
  )
}

export default Register