// 1. Keys aur URLs upar ek hi jagah rakho
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

// 2. Helper: TMDB ka kachra data saaf karke apne format me badalna
const clean = (m) => ({
  id: m.id,
  title: m.title,
  poster: m.poster_path? IMG + m.poster_path : null,
  rating: m.vote_average?.toFixed(1),
  year: m.release_date?.split('-')[0] || "N/A",
  overview: m.overview
});

// 3. Helper: Kisi bhi TMDB link se movies laana
const getMovies = async (url) => {
  const res = await fetch(`${TMDB}${url}&api_key=${TMDB_KEY}`);
  const data = await res.json();
  return data.results?.slice(0, 20).map(clean) || [];
};

// 4. Groq se mood ke hisab se 3 movies ke naam lo + TMDB se poster/trailer
export const getMovieRecommendation = async (mood) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: `Mood: "${mood}". Give 3 movies as JSON: {"movies":[{"title":"Name","matchPercentage":"90%","description":"Why"}]}` }]
    })
  });
  const movies = JSON.parse((await res.json()).choices[0].message.content).movies;

  // Har movie ka poster + trailer TMDB se nikalo
  return Promise.all(movies.map(async (m) => {
    const search = await getMovies(`/search/movie?query=${encodeURIComponent(m.title)}`);
    if (!search[0]?.id) return {...m, poster: null, trailerUrl: null };

    const video = await (await fetch(`${TMDB}/movie/${search[0].id}/videos?api_key=${TMDB_KEY}`)).json();
    const trailer = video.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
    return {...m,...search[0], trailerUrl: trailer? `https://www.youtube.com/embed/${trailer.key}` : null };
  }));
};

// 5. Discover page ke liye 3 ready-made functions
export const getTrendingMovies = () => getMovies("/trending/movie/day?");
export const getTopRatedMovies = () => getMovies("/movie/top_rated?");
export const getMoviesByGenre = (id) => getMovies(`/discover/movie?with_genres=${id}&sort_by=popularity.desc`);

// 6. Modal me trailer dikhane ke liye - Ye missing tha
export const getMovieTrailer = async (movieId) => {
  if (!movieId) return null;
  const res = await fetch(`${TMDB}/movie/${movieId}/videos?api_key=${TMDB_KEY}`);
  const data = await res.json();
  const trailer = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  return trailer? `https://www.youtube.com/embed/${trailer.key}` : null;
};

// 7. Groq se row ke liye 1 line ki tagline
export const getAIInsight = async (movies, rowTitle) => {
  const names = movies.slice(0, 3).map(m => m.title).join(", ");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: `Row: ${rowTitle}, Movies: ${names}. Ek choti Hinglish tagline likho.` }],
      max_tokens: 60
    })
  });
  return (await res.json()).choices[0].message.content.trim();
};