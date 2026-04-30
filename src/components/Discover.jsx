import { useState, useEffect } from 'react';
import { getTrendingMovies, getTopRatedMovies, getMoviesByGenre, getAIInsight, getMovieTrailer } from '../services/ai';

// 1. Reusable Card - Fixed widths for responsiveness
const MovieCard = ({ movie, onClick }) => (
  <div 
    onClick={() => onClick(movie)} 
    className='min-w-[150px] md:min-w-[200px] flex-shrink-0 group cursor-pointer'
  >
    <div className='relative overflow-hidden rounded-lg'>
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className='w-full h-56 md:h-72 object-cover group-hover:scale-110 transition-transform duration-300' 
        loading="lazy" 
      />
      <div className='absolute top-2 left-2 bg-black/70 text-yellow-400 text-[10px] md:text-xs font-bold px-2 py-1 rounded'>
        ⭐ {movie.rating}
      </div>
    </div>
    <p className='text-white text-xs md:text-sm mt-2 truncate group-hover:text-cyan-400 font-medium'>{movie.title}</p>
    <p className='text-slate-500 text-[10px] md:text-xs'>{movie.year}</p>
  </div>
);

// 2. Reusable Row - Smooth horizontal scrolling
const MovieRow = ({ title, movies, insight, onClick }) => {
  if (!movies?.length) return null;
  return (
    <div className='mb-10'>
      <h2 className='text-xl md:text-3xl font-bold text-white mb-1 px-4 md:px-8'>{title}</h2>
      {insight && <p className='text-xs md:text-sm text-cyan-400 mb-4 px-4 md:px-8 italic opacity-80'>{insight}</p>}
      <div className='flex gap-4 overflow-x-auto pb-4 px-4 md:px-8 scrollbar-hide scroll-smooth'>
        {movies.map(m => <MovieCard key={m.id} movie={m} onClick={onClick} />)}
      </div>
    </div>
  );
};

// 3. Modal - Improved mobile layout
const Modal = ({ movie, trailer, onClose }) => {
  if (!movie) return null;
  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-6' onClick={onClose}>
      <div className='bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl' onClick={e => e.stopPropagation()}>
        <div className='relative'>
          {trailer ? (
            <iframe src={trailer} className='w-full aspect-video rounded-t-2xl' allowFullScreen></iframe>
          ) : (
            <img src={movie.poster} alt={movie.title} className='w-full h-64 md:h-96 object-cover rounded-t-2xl' />
          )}
          <button onClick={onClose} className='absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl hover:bg-white hover:text-black transition-colors'>×</button>
        </div>
        
        <div className='p-5 md:p-8'>
          <div className='mb-4'>
            <h2 className='text-2xl md:text-4xl font-bold text-white'>{movie.title}</h2>
            <p className='text-slate-400 text-sm md:text-base mt-1'>{movie.year} • ⭐ {movie.rating}/10</p>
          </div>
          <p className='text-slate-300 leading-relaxed text-sm md:text-lg'>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

// 4. Main Page
export default function Discover() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ movie: null, trailer: null });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [trend, top, action] = await Promise.all([getTrendingMovies(), getTopRatedMovies(), getMoviesByGenre(28)]);
        const [i1, i2, i3] = await Promise.all([getAIInsight(trend, "Trending"), getAIInsight(top, "Top Rated"), getAIInsight(action, "Action")]);
        
        setRows([
          { title: "Trending Today 🔥", movies: trend, insight: i1 },
          { title: "Top Rated All Time 🏆", movies: top, insight: i2 },
          { title: "Adrenaline Rush 💥", movies: action, insight: i3 }
        ]);
      } catch (error) {
        console.error("Data fetching failed", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openModal = async (movie) => {
    setModal({ movie, trailer: null });
    const trailer = await getMovieTrailer(movie.id);
    setModal({ movie, trailer });
  };

  if (loading) return (
    <div className='bg-slate-950 min-h-screen flex flex-col items-center justify-center text-white'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
      <p className='text-xl font-light tracking-widest'>LOADING</p>
    </div>
  );

  return (
    <div className='bg-slate-950 min-h-screen py-6 md:py-12'>
      <h1 className='text-3xl md:text-6xl font-extrabold text-white mb-8 md:mb-14 px-4 md:px-8 tracking-tight'>
        Discover
      </h1>
      <div className='space-y-4'>
        {rows.map(row => <MovieRow key={row.title} {...row} onClick={openModal} />)}
      </div>
      <Modal {...modal} onClose={() => setModal({ movie: null, trailer: null })} />
    </div>
  );
}