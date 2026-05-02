import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";

function MovieRow({title,movies}) {
    const scrollRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(()=>{
        const scrollContainer = scrollRef.current
        if(!scrollContainer) return;

        const interval = setInterval(()=>{
            if(isHovered) return;
            
            if(scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth -10){
                scrollContainer.scrollTo({left:0,behavior:'smooth'})
            }else
            {
                scrollContainer.scrollBy({left:210,behavior:'smooth'})
            }
        },2000)

        return () => clearInterval(interval)
    },[isHovered])
    return(
        <>
             <h1 className='text-3xl mt-10 ml-4 font-medium font-spiderman text-gray-200 doted'>{title}</h1>
             <div
             ref={scrollRef}
             onMouseEnter={()=>setIsHovered(true)}
             onMouseLeave={()=>setIsHovered(false)}
            className='px-2 gap-3 flex overflow-x-auto py-1 w-[98%] mx-auto mt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth'
             >
            {movies.map((movie) => (
            <MovieCard key={movie.id} id={movie.id} image={movie.poster} title={movie.title} desc={movie.overview} year={movie.year} />
            ))}
             </div>
        </>
    )
}

export default MovieRow