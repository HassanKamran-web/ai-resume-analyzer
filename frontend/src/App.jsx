import React from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import ResultPage from './pages/ResultPage'

const App = () => {
  return (
    <div>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="*" element={<h1 className='text-blue-500 text-3xl flex items-center justify-center h-screen'>404 Not Found</h1>} />

        <Route path="/" element={
          <LandingPage />
        } />
        <Route path="/result/:id" element={
          <ResultPage />
        } />

      </Routes>
    </div>
  )
}

export default App