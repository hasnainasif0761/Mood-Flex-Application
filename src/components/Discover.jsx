import React, { useRef, useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import { getTrendingMovies,getTopRatedMovies, getMoviesByGenre } from '@/services/ai'
import '../index.css'
import MovieRow from './MovieRow'




function Discover() {
  const scrollRef = useRef(null)
  const topRef = useRef(null)
  const actionRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [topTrendingMovie, setTopTrendingMovie] = useState([])
  const [topRatedMovie, setTopRatedMovie] = useState([])
  const [topActionMovie, setTopActionMovie] = useState([])

  useEffect(()=>{
    const fetchTrendingMovie = async() =>{
          try {
      const [topTrending,top,action] = await Promise.all([getTrendingMovies(),getTopRatedMovies(),getMoviesByGenre(28)]);
      console.log(topTrending)
      console.log(top)
      setTopTrendingMovie(topTrending)
      setTopRatedMovie(top)
      setTopActionMovie(action)
      console.log("your action=>",action)
    } catch (error) {
        console.log('Ape ka Api Error=>',error);
    }
    }
    fetchTrendingMovie();
  },[])
  useEffect(()=>{
      const timer = setTimeout(()=>{
      setIsLoading(true)
    },2000)
    return () =>clearTimeout(timer)
  },[])

  return (
    <div className=' md:max-w-[82%] w-full h-screen overflow-y-auto'>
      <h1 className='text-3xl mt-7 ml-3 font-medium'>Discover Movie</h1>
      { isLoading ? 
      <>
        <MovieRow title="Trending Movie" movies={topTrendingMovie} />
        <MovieRow title="Top Rated Movies" movies={topRatedMovie}/>
        <MovieRow  title="Action Movie" movies={topActionMovie}/>
      </>
      : <div className=' min-h-[85%] flex flex-col items-center justify-center text-white'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
      <p className='text-xl font-light tracking-widest'>LOADING</p>
    </div>
    }
    </div>

  )
}

export default Discover