import { useState, useEffect } from 'react'

function Screenings() {
  const [withMovies, setWithMovies] = useState([])
  const [allCombined, setAllCombined] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/screenings/with-movies').then(res => res.json()).then(setWithMovies)
    fetch('http://localhost:3000/screenings/all-combined').then(res => res.json()).then(setAllCombined)
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Screenings</h1>
        <p>All screenings and their associated movies</p>
      </div>

      <h2 className="section-title">Screenings with Movies</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Movie</th><th>Start Time</th><th>End Time</th></tr>
          </thead>
          <tbody>
            {withMovies.map((s, i) => (
              <tr key={i}>
                <td>{s.MovieName}</td>
                <td>{new Date(s.startTime).toLocaleString()}</td>
                <td>{new Date(s.endTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">All Movies & Screenings</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Movie</th><th>Start Time</th></tr>
          </thead>
          <tbody>
            {allCombined.map((s, i) => (
              <tr key={i}>
                <td>{s.name ?? '—'}</td>
                <td>{s.startTime ? new Date(s.startTime).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Screenings