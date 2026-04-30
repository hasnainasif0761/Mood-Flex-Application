import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import PageNotFound from '../pages/PageNotFound'
import Sidebar from '../components/Sidebar'
import Discover from '../components/Discover'

function AppRoutes() {
  return (
    <BrowserRouter>
    <div className='min-h-screen flex bg-[#0f172a] text-white'>
    <Sidebar/>
        <Routes>
            <Route path='*' element={<PageNotFound/>} />
            <Route path='/' element={<Home/>} />
            <Route path='/discover' element={<Discover/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default AppRoutes