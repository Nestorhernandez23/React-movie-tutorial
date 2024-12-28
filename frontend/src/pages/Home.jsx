import MovieCard  from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import '../css/Home.css';

function Home () {
  const [searchQuery, setSearchQuery] = useState('');  // searchQuery is the state variable and setSearchQuery is the function that will update the state variable
    const [movies, setMovies] = useState([]);    // movies is the state variable and setMovies is the function that will update the state variable
     const [error, setError] = useState(null); 
     const [loading, setLoadind] = useState(true) 
    
    
    useEffect(() => {
            const loadPopularMovies = async () => {
                try {
                    const popularMovies = await getPopularMovies();
                    setMovies(popularMovies);

                }catch (error) {
                    console.log(error);
                    setError("failed to load movies");
                }
                finally {
                    setLoadind(false);
                }
            }
            loadPopularMovies();
        }, []);   // useEffect is a hook that runs a function when the component is mounted. The second argument is an array of dependencies. If the array is empty, the function will only run once when the component is mounted.
        

        const handleSearch = async ( e) => {
            e.preventDefault();
           if(!searchQuery.trim()) return;
           if(loading) return;

            setLoadind(true);
            try {
                const searchResults = await searchMovies(searchQuery);
                setMovies(searchResults);
                    setError(null);
                } catch (err) {
                console.log(err);
                setError("Failed to search movies");
            } finally {
                setLoadind(false);
            }

            setSearchQuery('');

        };

    return ( <div className="home">
        <form  onSubmit={handleSearch} className="search-form">
            <input type="text" placeholder="search for a movie" 
             value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="search-button" type="submit">Search</button>

        </form>

        {error && <div className="error-message">{error}</div>}
       
        {loading ? <div className="loading">Loading...</div> :
           <div className="movies-grid">
           {movies.map((movie) => (
               movie.title.toLowerCase().startsWith(searchQuery) && <MovieCard movie = {movie} key ={movie.id} />
           ))}
       </div>}
     
    </div>
    );
}

export default Home;