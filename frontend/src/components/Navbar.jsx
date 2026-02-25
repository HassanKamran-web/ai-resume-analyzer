import React from 'react'

const Navbar = () => {
  return (
    <header className='bg-blue-500/10'>
        <nav className='h-20 flex select-none items-center justify-center inter-uniquifier w-full border-gray-200 border-b-3'>
            <h1 className='text-2xl lg:text-4xl md:text-3xl font-bold text-gray-400'><span className='text-blue-400 font-bold font-inter'>Optimi</span>CV</h1>
        </nav>
    </header>
  )
}

export default Navbar