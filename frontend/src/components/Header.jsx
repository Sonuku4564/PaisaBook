import React from 'react'

const Header = ({ title }) => {
  return (
    <header className='bg-white bg-opacity-80 backdrop:blur-md shadow-md border-b border-gray-200'>
      <div className='max-w-7xl mx-auto py-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>{title}</h1>
      </div>
    </header>
  )
}

export default Header
