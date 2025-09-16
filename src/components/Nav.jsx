import React, { useEffect, useState } from 'react'
import { FaBook, FaUserCircle } from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'
import { PiUsersThreeFill } from 'react-icons/pi'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function Nav() {
   const {logout, loading} = useAuth()
   const userNavLinks = [
      {name: "Dashboard", path: "/u", icon: <MdSpaceDashboard />},
      {name: "Customers", path: "/u/customers", icon: <PiUsersThreeFill />},
      {name: "Orders", path:"/u/orders", icon: <FaBook />},
      {name:"Profile", path:"/u/profile", icon:<FaUserCircle /> }
   ]
   const location = useLocation()
   const [activeTab, setActiveTab] = useState("")

   useEffect(() => {
    setActiveTab(location.pathname)
  }, [location.pathname])
   if(!location.pathname.includes("/u")){
      return (
      <div>
         <h1 className='text-2xl bg-white flex items-center px-5 text-blue-400 font-bold min-h-[15vh]'>Laundry Pro</h1>
         
         <main>
            <Outlet />
         </main>
      </div>
      )   
   }

   if(location.pathname.includes("/u")){
      return(
         <div className='flex h-screen overflow-hidden'>
            <div className='w-[20%] bg-blue-400 h-full overflow-y-auto relative'>
               <h1 className='text-2xl  text-center my-6 text-white font-bold'>Laundry Pro</h1>
               <div className='flex flex-col items-left'>
                  {userNavLinks.map((link, id) => {
  const isActive =
    link.path === "/u"
      ? location.pathname === "/u" // exact match for dashboard
      : location.pathname.startsWith(link.path); // prefix match for others

  return (
    <Link
      to={link.path}
      key={id}
      className={`${
        isActive
          ? "text-blue-400 bg-gradient-to-r from-white to-gray-100"
          : "text-white"
      } p-2 my-2 flex gap-3 items-center`}
    >
      {link.icon}
      <p>{link.name}</p>
    </Link>
  );
})}

   
               </div>
                  <button onClick={logout} className='bottom-0 pointer absolute text-white bg-red-600 font-semibold py-2 px-5 m-2 rounded-3xl'>{loading? "Logging out" : "Logout"}</button>
            </div>
            
            <main className='w-[80%] h-full overflow-y-auto'>
               <Outlet />
            </main>
         </div>
      )
   }
  
}

export default Nav