import React from 'react'
import Layout from './routes/layout'
import AuthProvider from './context/authContext'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout/> 
      </AuthProvider>
    </BrowserRouter>
    
    
  )
}

export default App