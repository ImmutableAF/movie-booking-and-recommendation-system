import { useState, useEffect } from 'react'

function Movies() {
  const [movies, setMovies] = useState([])
  const [recent, setRecent] = useState([])
  const [sorted, setSorted] = useState([])
  const [name, setName] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [msg, setMsg] = useState(null)

  const fetchAll = () => {
    fetch('http://localhost:3000/movies')
      .then(res => res.json()).then(setMovies)
    fetch('http://localhost:3000/movies/recent')
      .then(res => res.json()).then(setRecent)
    fetch('http://localhost:3000/movies/sorted')
      .then(res => res.json()).then(setSorted)
  }

  useEffect(() => { fetchAll() }, [])

  const addMovie = () => {
    fetch('http://localhost:3000/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, releaseYear: Number(releaseYear) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) { setMsg({ type: 'error', text: data.error }) }
        else { setMsg({ type: 'success', text: 'Movie added successfully!' }); setName(''); setReleaseYear(''); fetchAll() }
      })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Movies</h1>
        <p>Browse, search and manage all movies in the system</p>
      </div>

      <div className="form-card">
        <h2>Add New Movie</h2>
        <div className="form-row">
          <input placeholder="Movie name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Release year" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} type="number" />
          <button className="btn btn-olive" onClick={addMovie}>Add Movie</button>
        </div>
        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
      </div>

      <h2 className="section-title">All Movies</h2>
      <div className="grid">
        {movies.map(m => (
          <div className="card" key={m.id}>
            <h3>{m.name}</h3>
            <p>{m.releaseYear}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Released After 2015</h2>
      <div className="grid">
        {recent.map(m => (
          <div className="card" key={m.id}>
            <h3>{m.name}</h3>
            <p>{m.releaseYear}</p>
            <span className="badge">Recent</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Sorted by Release Year</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Movie</th><th>Year</th></tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.releaseYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Movies