import React from 'react'
import { useNavigate } from 'react-router-dom'

function MovieCard({id,image,title,desc,year}) {
  const navigate = useNavigate()
  function handleClick(){
    navigate(`/movie/${id}`)
  }
  
  return (
    <div onClick={handleClick} className="w-[250px] flex-shrink-0 cursor-pointer border-2 hover:shadow-cyan-500/50 shadow-sm hover:border-blue-300 h-[300px] rounded-sm overflow-hidden">
      <div className="w-full h-[230px] border border-black">
        <img
          src={image}
          alt={title}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='w-full h-auto '>
        <p className='text-[12px] ml-1 mt-1 bg-gray-500/40 w-[40px] pl-1 rounded-[5px]'>{year}</p>
        <p className='text-[13px] ml-1 mt-1'>{title}</p>
        <p className='text-[13px] ml-1 line-clamp-1 mb-1 w-[220px] text-gray-400'>{desc}</p>
      </div>
    </div>
  )
}

export default MovieCard