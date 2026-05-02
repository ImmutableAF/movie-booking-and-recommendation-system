import { useState, useEffect } from 'react'
import { moviesApi } from '../services/api'

function Movies() {
  const [movies, setMovies] = useState([])
  const [revenue, setRevenue] = useState([])
  const [orphans, setOrphans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      moviesApi.getAll(),
      moviesApi.getRevenue(),
      moviesApi.getOrphans(),
    ]).then(([m, r, o]) => {
      setMovies(m)
      setRevenue(r)
      setOrphans(o)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p className="loading">Loading movies…</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Movies</h1>
        <p>Browse the full movie catalogue, analyse cross-theatre revenue, and identify unbooked future screenings.</p>
      </div>

      <h2 className="section-title">All Movies</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Every film registered in the system pulled directly from the <code>Movies</code> table.
      </p>
      <div className="grid">
        {movies.map((m) => (
          <div className="card" key={m.id}>
            <h3>{m.name}</h3>
            <p>{m.releaseYear}</p>
            <span className="badge">{m.releaseYear >= 2020 ? 'Recent' : 'Classic'}</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Global Revenue by Movie & Theatre</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>vw_GlobalRevenue</code> — aggregates all confirmed bookings grouped by movie and theatre. Shows total transactions and gross revenue per combination.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Movie</th>
              <th>Theatre</th>
              <th>Transactions</th>
              <th>Gross Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenue.map((r, i) => (
              <tr key={i}>
                <td>{r.MovieName}</td>
                <td>{r.TheatreLocation}</td>
                <td>{r.TotalTransactions}</td>
                <td>Rs {Number(r.GrossRevenue).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Orphan Screenings</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>vw_OrphanScreenings</code> — future screenings with zero bookings. These represent lost revenue opportunities that can trigger promotions or cancellations.
      </p>
      {orphans.length === 0
        ? <p className="loading">No orphan screenings — all future screenings have at least one booking.</p>
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Screen</th>
                  <th>Start Time</th>
                </tr>
              </thead>
              <tbody>
                {orphans.map((o, i) => (
                  <tr key={i}>
                    <td>{o.name}</td>
                    <td>{o.screenName}</td>
                    <td>{new Date(o.startTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

export default Movies
