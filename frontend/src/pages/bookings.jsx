import { useState } from 'react'
import { bookingsApi } from '../services/api'

function Bookings() {
  const [customerId, setCustomerId] = useState('')
  const [screeningId, setScreeningId] = useState('')
  const [seatId, setSeatId] = useState('')
  const [createMsg, setCreateMsg] = useState(null)

  const [cancelId, setCancelId] = useState('')
  const [cancelMsg, setCancelMsg] = useState(null)

  const createBooking = () => {
    if (!customerId || !screeningId || !seatId) {
      setCreateMsg({ type: 'error', text: 'All three fields are required.' })
      return
    }
    setCreateMsg(null)
    bookingsApi.create(Number(customerId), Number(screeningId), Number(seatId))
      .then(data => {
        const id = data?.SuccessBookingID ?? data?.BookingID ?? JSON.stringify(data)
        setCreateMsg({ type: 'success', text: `Booking confirmed! Booking ID: ${id}` })
        setCustomerId(''); setScreeningId(''); setSeatId('')
      })
      .catch(err => {
        const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? 'Booking failed.'
        setCreateMsg({ type: 'error', text: msg })
      })
  }

  const cancelBooking = () => {
    if (!cancelId) return
    setCancelMsg(null)
    bookingsApi.cancel(cancelId)
      .then(() => {
        setCancelMsg({ type: 'success', text: `Booking ${cancelId} cancelled.` })
        setCancelId('')
      })
      .catch(err => {
        const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? 'Cancellation failed.'
        setCancelMsg({ type: 'error', text: msg })
      })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bookings</h1>
        <p>Process new bookings and cancel existing ones</p>
      </div>

      <div className="form-card">
        <h2>Process New Booking</h2>
        <div className="form-row">
          <input
            placeholder="Customer ID"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            type="number"
          />
          <input
            placeholder="Screening ID"
            value={screeningId}
            onChange={e => setScreeningId(e.target.value)}
            type="number"
          />
          <input
            placeholder="Seat ID"
            value={seatId}
            onChange={e => setSeatId(e.target.value)}
            type="number"
          />
          <button className="btn btn-olive" onClick={createBooking}>Book Now</button>
        </div>
        {createMsg && <div className={`msg ${createMsg.type}`}>{createMsg.text}</div>}
      </div>

      <div className="form-card">
        <h2>Cancel Booking</h2>
        <div className="form-row">
          <input
            placeholder="Booking ID"
            value={cancelId}
            onChange={e => setCancelId(e.target.value)}
            type="number"
          />
          <button className="btn btn-maroon" onClick={cancelBooking}>Cancel Booking</button>
        </div>
        {cancelMsg && <div className={`msg ${cancelMsg.type}`}>{cancelMsg.text}</div>}
      </div>

      <div className="form-card" style={{ borderTop: '4px solid var(--beige-deeper)', background: 'var(--beige)' }}>
        <h2 style={{ color: 'var(--text-mid)', fontSize: '1rem' }}>How to book</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          1. Go to <strong>Theatres</strong> → use "Available Seats Lookup" with your Screening ID to get a valid Seat ID.<br />
          2. Enter Customer ID, Screening ID, and Seat ID above.<br />
          3. The system runs the <code>sp_ProcessBooking</code> stored procedure with full ACID guarantees.
        </p>
      </div>
    </div>
  )
}

export default Bookings
