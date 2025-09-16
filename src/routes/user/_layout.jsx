import React from 'react'
import { IoPerson } from 'react-icons/io5'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

function UserLayout() {
  const {user} = useAuth()
  return (
    <div>
      <nav className='bg-white px-5 py-4'>
        <div className='ml-auto w-fit text-blue-400 flex items-center gap-3'>
          <IoPerson /> 
          <p className='text-sm text-black font-bold'>{user ? user.name : ""}</p>
        </div>
        
      </nav>
      <main className='px-10 py-5'>
         <Outlet />
      </main>
    </div>
  )
}

export default UserLayout