import React from 'react'
import { useAuth } from '../../context/authContext'

function Profile() {
   const {user} = useAuth()
  return (
    <div>
       <h1 className="text-3xl font-bold text-blue-400">Profile</h1>

       {user ? 
         <div className="flex flex-col items-center justify-center min-h-[80vh] mt-4">
            <div className="bg-white p-7 mt-5 w-[60%] rounded-lg shadow-md">
               <div>
                  <p>Name</p>
                  <p>{user.name}</p>
               </div>
            </div>
         </div>
      : "Loading"}

       
    </div>
  )
}

export default Profile