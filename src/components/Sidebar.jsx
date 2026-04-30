import { NavLink } from 'react-router-dom';
import Brain from '../assets/Svg.png'

import { IoHomeOutline } from "react-icons/io5";
import { LiaBandcamp } from "react-icons/lia";
import { IoBookmark } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";




const Sidebar = () => {
  const menus = [
    { name: "Home", path: "/",icon:<IoHomeOutline /> },
    { name: "Discover", path: "/discover",icon:<LiaBandcamp />  },
    { name: "Saved", path: "/saved",icon:<IoBookmark />  },
    { name: "Settings", path: "/settings",icon:<MdOutlineSettings />  }
  ];

  return (
    <div className="w-64 h-screen bg-[#0b1120] border-r border-slate-800 p-6 flex flex-col">
      <div className="text-2xl font-bold text-cyan-400 mb-10 flex gap-3 items-center">
        <img src={Brain} alt="brain Image" className='w-12.5' />
        MOOD FLIX
        </div>
      
      <nav className="flex flex-col gap-4">
        {menus.map((item) => (
          <>
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `p-3 rounded-xl transition ${
                isActive 
                ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-cyan-500/10' 
                : 'hover:bg-slate-800/50 text-slate-400'
              }`
            }
            style={{display:'flex',alignItems:'center',justifyContent:'start',gap:'10px'}}
            >
            {item.icon}
            {item.name}
          </NavLink>
          </>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar