import React from 'react'
import { HeroBg, HeroImg } from '../../assets/images'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <section 
         className="min-h-[85vh] flex items-center justify-between px-8 pb-0 bg-cover bg-center overflow-y-hidden" 
         style={{ background: `linear-gradient(rgba(66,153,255,0.8), rgba(66,153,255,0.8)), url(${HeroBg})`,backgroundRepeat: "no-repeat", backgroundSize:"cover" }}
         >
         <div className='text-white'>
            <h1 className='text-4xl font-bold'>Welcome to Laundry Pro</h1>
            <p>The best laundry management system that helps you organize your customers and orders</p> 
            <Link to="/auth/login" className='bg-white rounded-3xl text-blue-500 py-3 px-5 mt-5 block w-fit'>Get Started</Link>    
         </div>
         <div style={{background: "transparent", transform: "translateY(50px)", height: "500px", width:"fit-content"}}>
            <img src={HeroImg} alt="Hero" className='h-full'/>    
         </div>
      </section>

      
      
    </div>
  )
}

export default Home