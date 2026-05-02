import { useState, useEffect } from 'react'

function Home() {
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetch('http://localhost:3000/bookings/stats')
      .then(res => res.json())
      .then(data => setStats(data[0]))
  }, [])

  return (
    <div className="page">
      <div className="hero-home">
        <p>Your ultimate movie booking and recommendation system</p>
      </div>
      <h2 className="section-title">Platform Overview</h2>
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
          <div className="stat-label">Avg Booking Value</div>
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
    </div>
  )
}

export default Home