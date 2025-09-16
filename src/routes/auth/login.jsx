import React, { useState } from 'react'
import "../../index.css"
import { Link, useNavigate } from 'react-router-dom'
import { account } from '../../lib/appwrite';
import { useAuth } from '../../context/authContext';

function AuthLogin() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const {login, loading, error} = useAuth()


   const handleSubmit = async (e) => {
      e.preventDefault();
      login(email, password)
   };

   return (
      <div className='flex flex-col items-center justify-center h-[85vh]'>
      <h2 className='text-3xl font-bold'>Welcome Back</h2>
      <p className='text-sm text-blue-300'>Sign in to manage your Laundry</p>

      <form
         onSubmit={handleSubmit} 
         className='bg-white w-[35%] px-8 py-5 rounded-md my-5'
      >
         <input 
            type="text" 
            placeholder='Email Address' 
            className='w-full border border-gray-200 bg-gray-300 p-2 rounded-md my-2 outline-0'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
         />
         <input 
            type="password"  
            placeholder='Password' 
            className='w-full border border-gray-200 bg-gray-300 p-2 rounded-md my-2 outline-0'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
         />

         <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-1'>
               <input type="checkbox" name="rememberMe" id="rememberMe" />
               <label htmlFor="rememberMe">Remember Me</label>
            </div>

            <p className='text-blue-400'>Forgot Password?</p>
         </div>

         <button 
            type='submit' 
            disabled={loading}
            className='block bg-blue-400 w-full py-2 mt-5 rounded-md text-white text-center font-semibold cursor-pointer'
         >
            {loading ? "Logging in..." : "Login"}
         </button>
         <p className='text-center text-sm mt-3'>Don't have an Account? <Link to="/auth/signup" className="cursor-pointer text-blue-400">Sign up</Link></p>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
    </div>
  )
}

export default AuthLogin