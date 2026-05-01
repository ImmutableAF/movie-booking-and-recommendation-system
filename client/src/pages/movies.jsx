import { useState, useEffect } from 'react'

function Movies() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
  }, [])

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>
          <h3>{movie.name}</h3>
          <p>{movie.releaseYear}</p>
        </div>
      ))}
    </div>
  )
}

export default Movies