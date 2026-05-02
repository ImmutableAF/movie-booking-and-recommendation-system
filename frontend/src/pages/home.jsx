import { useState, useEffect } from 'react'
import { moviesApi, customersApi } from '../services/api'

function Home() {
  const [revenue, setRevenue] = useState([])
  const [topSpenders, setTopSpenders] = useState([])

  useEffect(() => {
    moviesApi.getRevenue().then(setRevenue).catch(() => {})
    customersApi.getTopSpenders().then(setTopSpenders).catch(() => {})
  }, [])

  const totalRevenue = revenue.reduce((sum, r) => sum + (Number(r.GrossRevenue) || 0), 0)
  const totalTransactions = revenue.reduce((sum, r) => sum + (Number(r.TotalTransactions) || 0), 0)
  const topCustomer = topSpenders.reduce((best, c) => {
    return (!best || Number(c.TotalSpent) > Number(best.TotalSpent)) ? c : best
  }, null)

  return (
    <div className="page">
      <div className="hero-home">
        <h1>CinePulse</h1>
        <p>Production-grade cinema booking and analytics platform</p>
      </div>

      <h2 className="section-title">Platform Overview</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{revenue.length}</div>
          <div className="stat-label">Movie-Theatre Pairs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalTransactions}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Rs {totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Gross Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.1rem' }}>{topCustomer?.name ?? '—'}</div>
          <div className="stat-label">#1 Spender</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{topSpenders.length}</div>
          <div className="stat-label">Top Customers</div>
        </div>
      </div>

      <h2 className="section-title">Quick Navigation</h2>
      <div className="grid">
        {[
          { label: 'Movies', desc: 'Catalogue, global revenue view, orphan screenings', path: '/movies' },
          { label: 'Theatres', desc: 'Occupancy rates, screen type revenue, seat lookup', path: '/theatres' },
          { label: 'Customers', desc: 'Top spenders, corporate domains, booking history', path: '/customers' },
          { label: 'Bookings', desc: 'Process new bookings via ACID stored procedure, cancel existing', path: '/bookings' },
        ].map(({ label, desc, path }) => (
          <a key={label} href={path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', borderLeft: '4px solid var(--maroon)' }}>
              <h3>{label}</h3>
              <p>{desc}</p>
              <span className="badge maroon">Go →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Home
