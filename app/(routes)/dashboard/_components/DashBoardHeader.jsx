import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react';
import React from 'react'

const DashBoardHeader = ({setSidebarOpen, sidebarOpen}) => {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center'>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden p-4" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </button>
        <div>Search Bar</div>
        <div>
            <UserButton />
        </div>
    </div>
  )
}

export default DashBoardHeader