import { useState, useEffect } from 'react'
import { theatresApi } from '../services/api'

function Theatres() {
  const [occupancy, setOccupancy] = useState([])
  const [revenueByType, setRevenueByType] = useState([])
  const [seats, setSeats] = useState([])
  const [screeningId, setScreeningId] = useState('')
  const [seatsMsg, setSeatsMsg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      theatresApi.getOccupancy(),
      theatresApi.getRevenueByType(),
    ]).then(([o, r]) => {
      setOccupancy(o)
      setRevenueByType(r)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const lookupSeats = () => {
    if (!screeningId) return
    setSeatsMsg(null)
    setSeats([])
    theatresApi.getAvailableSeats(screeningId)
      .then(data => {
        setSeats(data)
        if (data.length === 0) setSeatsMsg({ type: 'error', text: 'No available seats for this screening.' })
      })
      .catch(() => setSeatsMsg({ type: 'error', text: 'Screening not found.' }))
  }

  if (loading) return <div className="page"><p className="loading">Loading theatre data…</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Theatres</h1>
        <p>Monitor live screening occupancy, compare revenue across screen types, and look up available seats before making a booking.</p>
      </div>

      <h2 className="section-title">Screening Occupancy</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>vw_ScreeningOccupancy</code> — live view joining Screenings, Screens, Theatres and BookingSeats. Shows booked vs available seats and occupancy rate (%) for every screening.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Movie</th>
              <th>Theatre</th>
              <th>Screen</th>
              <th>Start Time</th>
              <th>Capacity</th>
              <th>Booked</th>
              <th>Available</th>
              <th>Occupancy %</th>
            </tr>
          </thead>
          <tbody>
            {occupancy.map((row) => (
              <tr key={row.ScreeningID}>
                <td>{row.ScreeningID}</td>
                <td>{row.Movie}</td>
                <td>{row.Theatre}</td>
                <td>{row.screenName}</td>
                <td>{new Date(row.startTime).toLocaleString()}</td>
                <td>{row.Capacity}</td>
                <td>{row.BookedSeats}</td>
                <td>{row.AvailableSeats}</td>
                <td>
                  <span className={`badge ${row.OccupancyRate >= 70 ? 'maroon' : ''}`}>
                    {row.OccupancyRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Revenue by Screen Type</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>vw_RevenueByScreenType</code> — uses <code>GROUP BY ROLLUP</code> to show revenue per screen type (Standard, IMAX, 4DX, VIP) plus a grand total row.
      </p>
      <div className="grid">
        {revenueByType.map((r, i) => (
          <div className="card" key={i} style={{ borderLeft: `4px solid ${r.ScreenType === 'GRAND TOTAL' ? 'var(--maroon)' : 'var(--olive)'}` }}>
            <h3>{r.ScreenType ?? 'Grand Total'}</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--maroon)', marginTop: '0.4rem' }}>
              Rs {Number(r.Revenue).toLocaleString()}
            </p>
            <span className={`badge ${r.ScreenType === 'GRAND TOTAL' ? 'maroon' : ''}`}>
              {r.ScreenType === 'GRAND TOTAL' ? 'Total' : 'Revenue'}
            </span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Available Seats Lookup</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>sp_GetAvailableSeats</code> — stored procedure that returns all seats for a screening's screen that have not yet been booked. Use the Seat ID returned here when processing a booking.
      </p>
      <div className="form-card">
        <h2>Check Seats for a Screening</h2>
        <div className="form-row">
          <input
            placeholder="Screening ID (e.g. 1)"
            value={screeningId}
            onChange={e => { setScreeningId(e.target.value); setSeats([]); setSeatsMsg(null) }}
            type="number"
          />
          <button className="btn btn-olive" onClick={lookupSeats}>Check Seats</button>
        </div>
        {seatsMsg && <div className={`msg ${seatsMsg.type}`}>{seatsMsg.text}</div>}
      </div>

      {seats.length > 0 && (
        <>
          <p style={{ color: 'var(--text-light)', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
            {seats.length} seat{seats.length !== 1 ? 's' : ''} available for Screening {screeningId}. Copy a Seat ID to use in the Bookings page.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Seat ID</th>
                  <th>Row</th>
                  <th>Seat No</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{s.rowLabel}</td>
                    <td>{s.seatNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Theatres
