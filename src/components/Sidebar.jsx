import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Brain from '../assets/Svg.png'

// React Icon Import Library
import { IoHomeOutline } from "react-icons/io5";
import { LiaBandcamp } from "react-icons/lia";
import { IoBookmark } from "react-icons/io5";
import { MdOutlineSettings, MdMenu, MdClose } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menus = [
    { name: "Home", path: "/", icon: <IoHomeOutline size={20} /> },
    { name: "Discover", path: "/discover", icon: <LiaBandcamp size={20} /> },
    { name: "Saved", path: "/saved", icon: <IoBookmark size={20} /> },
    { name: "Settings", path: "/settings", icon: <MdOutlineSettings size={20} /> }
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button - Mobile pe only */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-cyan-400"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Overlay - Mobile pe jab sidebar open ho */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 h-screen bg-[#0b1120] border-r border-slate-800 p-6 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="text-2xl font-bold text-cyan-400 mb-10 flex gap-3 items-center">
          <img src={Brain} alt="brain Image" className='w-10' />
          MOOD FLIX
        </div>
        
        <nav className="flex flex-col gap-2">
          {menus.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar} // Mobile pe click karte hi band ho jaye
              className={({ isActive }) => 
                `p-3 rounded-xl transition flex items-center gap-3 ${
                  isActive 
                  ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-cyan-500/10' 
                  : 'hover:bg-slate-800/50 text-slate-400'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;