import { getMovieTrailer } from '@/services/ai'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack, IoTimeOutline, IoCalendarOutline, IoStar } from "react-icons/io5";

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB = "https://api.themoviedb.org/3"

function ViewMovie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [trailerUrl, setTrailerUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${TMDB}/movie/${id}?api_key=${TMDB_KEY}`)
        const data = await res.json()
        setMovie(data)

        const trailer = await getMovieTrailer(id)
        setTrailerUrl(trailer)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  if (loading) return (
    <div className='w-[90%] min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
      <p className='text-xl font-light tracking-widest'>LOADING</p>
    </div>
  )
  
  if (!movie) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-2xl mb-4">Movie not found</p>
        <button onClick={() => navigate(-1)} className="text-cyan-400 hover:text-cyan-300 cursor-pointer">
          Go Back
        </button>
      </div>
    </div>
  )

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null
    
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster'

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Backdrop Hero Section */}
      <div className="relative w-full h- lg:h-">
        {/* Backdrop Image */}
        {backdropUrl && (
          <>
            <img 
              src={backdropUrl} 
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
          </>
        )}
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur-md hover:bg-black/70 p-3 rounded-full transition-all cursor-pointer"
        >
          <IoArrowBack size={24} />
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-12 lg:pb-20">
          <div className="flex flex-col lg:flex-row gap-8 items-end w-full">
            
            {/* Poster */}
            <div className="shrink-0 hidden lg:block">
              <img 
                src={posterUrl}
                alt={movie.title}
                className="w-64 rounded-xl shadow-2xl shadow-black/50 border-slate-700"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                {movie.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm lg:text-base">
                <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg border border-yellow-500/30">
                  <IoStar className="text-yellow-400" />
                  <span className="font-bold">{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                  <IoCalendarOutline />
                  <span>{movie.release_date?.split('-')[0]}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                  <IoTimeOutline />
                  <span>{movie.runtime} min</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="bg-cyan-500/10 text-cyan-400 text-sm px-3 py-1 rounded-full border border-cyan-500/20">
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-slate-300 text-base lg:text-lg leading-relaxed max-w-3xl mb-6">
                {movie.overview}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {trailerUrl && (
                  <a 
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                  >
                    ▶ Watch Trailer
                  </a>
                )}
                <button
                  onClick={() => alert('Download feature coming soon!')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trailer Embed */}
          {trailerUrl && (
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Official Trailer</h2>
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <iframe
                  className="w-full h-full"
                  src={trailerUrl}
                  allowFullScreen
                  title="Movie Trailer"
                />
              </div>
            </div>
          )}

          {/* Extra Info */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-medium">{movie.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Language</span>
                  <span className="font-medium uppercase">{movie.original_language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget</span>
                  <span className="font-medium">
                    {movie.budget ? `$${(movie.budget / 1000000).toFixed(0)}M` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue</span>
                  <span className="font-medium">
                    {movie.revenue ? `$${(movie.revenue / 1000000).toFixed(0)}M` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Production Companies */}
            {movie.production_companies?.length > 0 && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Production</h3>
                <div className="space-y-2">
                  {movie.production_companies.slice(0, 3).map((company) => (
                    <p key={company.id} className="text-slate-300 text-sm">
                      {company.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewMovie