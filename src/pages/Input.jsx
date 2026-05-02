import React, { useState } from 'react';
import { getMovieRecommendation } from '../services/ai';

function Input() {
    const [userInput, setUserInput] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    async function askAi() {
        if (!userInput.trim()) return alert('Bhai, pehle mood to likho! ⚠️');

        setLoading(true);
        setMovies([]); 

        const data = await getMovieRecommendation(userInput);

        if (data && Array.isArray(data)) {
            setMovies(data);
            console.log("AI Response Data:", data);
        } else {
            alert('AI thoda bhatak gaya hai, dobara koshish karein.');
        }
        setLoading(false);
    }

    // Enter key pe submit karne ke liye
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) {
            askAi();
        }
    }

    return (
        <div className='p-6 w-full h-screen'>
            {/* Search Section */}
            <div className=' flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-10'>
                <input 
                    type="text" 
                    value={userInput} // 1. Controlled input fix
                    placeholder='Describe your mood (e.g., I want something exciting but short)' 
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown} // 2. Enter pe submit
                    disabled={loading}
                    className='flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                />
                <button 
                    onClick={askAi} 
                    disabled={loading}
                    className='bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95' // 3. cursor-pointer + active state
                >
                    {loading ? "Thinking..." : "Ask AI"}
                </button>
            </div>

            {/* Results Grid Section */}
            <div className='md:w-[1113px]  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {movies.length > 0 ? (
                    movies.map((m, index) => (
                        <div key={index} className='bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all group shadow-xl overflow-hidden flex flex-col'>
                            
                            {/* 1. Movie Poster */}
                            {m.poster ? (
                                <div className='relative'>
                                    <img 
                                        src={m.poster} 
                                        alt={m.title}
                                        className='w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300'
                                        loading="lazy"
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent'></div>
                                    
                                    {/* Rating Badge */}
                                    {m.rating && (
                                        <div className='absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1'>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {m.rating}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='w-full h-80 bg-slate-700 flex items-center justify-center'>
                                    <span className='text-slate-500'>No Poster</span>
                                </div>
                            )}

                            {/* 2. Content */}
                            <div className='p-5 flex flex-col flex-grow'>
                                <div className='flex justify-between items-start mb-3 gap-2'>
                                    <div className='min-w-0'>
                                        <h3 className='text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate'>
                                            {m.title}
                                        </h3>
                                        {m.year && <p className='text-xs text-slate-500'>{m.year}</p>}
                                    </div>
                                    <span className='bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-1 rounded-md border border-cyan-500/20 whitespace-nowrap shrink-0'>
                                        {m.matchPercentage || m.match} Match
                                    </span>
                                </div>
                                
                                <p className='text-slate-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-4'>
                                    {m.description || m.desc}
                                </p>

                                {/* 3. Trailer Button */}
                                {m.trailerUrl && (
                                    <a 
                                        href={m.trailerUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className='mt-auto w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95' // 4. cursor-pointer yaha bhi
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        Watch Trailer
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : !loading && (
                    <p className='text-slate-500 text-center col-span-full mt-10 italic'>
                        Apna mood batayein taake AI aapke liye movies dhoond sakay...
                    </p>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className='flex justify-center items-center col-span-full mt-10'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500'></div>
                </div>
            )}
        </div>
    );
}

export default Input;