import { useState, useEffect } from 'react'

function Bookings() {
  const [stats, setStats] = useState({})
  const [counts, setCounts] = useState([])
  const [popular, setPopular] = useState([])
  const [revenue, setRevenue] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/bookings/stats').then(res => res.json()).then(d => setStats(d[0]))
    fetch('http://localhost:3000/bookings/count').then(res => res.json()).then(setCounts)
    fetch('http://localhost:3000/bookings/popular').then(res => res.json()).then(setPopular)
    fetch('http://localhost:3000/movies/revenue').then(res => res.json()).then(setRevenue)
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bookings</h1>
        <p>Booking analytics, revenue and screening statistics</p>
      </div>

      <h2 className="section-title">Overall Statistics</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.TotalBookings ?? '—'}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Rs {stats.TotalRevenue ?? '—'}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Rs {stats.AverageBookingValue ? Number(stats.AverageBookingValue).toFixed(0) : '—'}</div>
          <div className="stat-label">Avg Booking</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Rs {stats.HighestBooking ?? '—'}</div>
          <div className="stat-label">Highest Booking</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Rs {stats.LowestBooking ?? '—'}</div>
          <div className="stat-label">Lowest Booking</div>
        </div>
      </div>

      <h2 className="section-title">Bookings Per Screening</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Screening ID</th><th>Total Bookings</th></tr>
          </thead>
          <tbody>
            {counts.map(c => (
              <tr key={c.screeningID}>
                <td>Screening {c.screeningID}</td>
                <td>{c.TotalBookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Popular Screenings (3+ Bookings)</h2>
      <div className="grid">
        {popular.length === 0 ? <p className="loading">No screenings with more than 3 bookings</p> : popular.map(p => (
          <div className="card" key={p.screeningID}>
            <h3>Screening {p.screeningID}</h3>
            <p>{p.TotalBookings} bookings</p>
            <span className="badge maroon">Popular</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Revenue by Movie</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Movie</th><th>Revenue</th></tr>
          </thead>
          <tbody>
            {revenue.map(r => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>Rs {r.MovieRevenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bookings