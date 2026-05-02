import { useState, useEffect } from 'react'
import { customersApi } from '../services/api'

function Customers() {
  const [topSpenders, setTopSpenders] = useState([])
  const [corporate, setCorporate] = useState([])
  const [history, setHistory] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [historyMsg, setHistoryMsg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      customersApi.getTopSpenders(),
      customersApi.getCorporate(),
    ]).then(([t, c]) => {
      setTopSpenders(t)
      setCorporate(c)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const lookupHistory = () => {
    if (!customerId) return
    setHistoryMsg(null)
    setHistory([])
    customersApi.getHistory(customerId)
      .then(data => {
        setHistory(data)
        if (data.length === 0) setHistoryMsg({ type: 'error', text: 'No booking history found for this customer.' })
      })
      .catch(() => setHistoryMsg({ type: 'error', text: 'Customer not found.' }))
  }

  if (loading) return <div className="page"><p className="loading">Loading customer data…</p></div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Customers</h1>
        <p>Identify top spenders per theatre, detect corporate accounts sharing email domains, and retrieve full booking history for any customer.</p>
      </div>

      <h2 className="section-title">Top Spenders by Theatre</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>vw_TopCustomers</code> — uses a CTE with <code>RANK() OVER(PARTITION BY location)</code> to find the single highest-spending customer at each theatre location.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Theatre</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {topSpenders.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>Rs {Number(c.TotalSpent).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Corporate Accounts</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>vw_CorporateCustomers</code> — self-joins the Customers table on shared email domain (substring after @). Pairs of customers on the same corporate domain are flagged for B2B account management.
      </p>
      <div className="grid">
        {corporate.map((c, i) => (
          <div className="card" key={i}>
            <h3>{c.Cust1}</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>with {c.Cust2}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{c.Domain}</p>
            <span className="badge">Corporate</span>
          </div>
        ))}
      </div>

      <h2 className="section-title">Booking History Lookup</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <code>sp_GetCustomerHistory</code> — stored procedure that returns all past bookings for a customer, including movie, theatre, seat, start time and amount paid, ordered by most recent first.
      </p>
      <div className="form-card">
        <h2>Get Customer History</h2>
        <div className="form-row">
          <input
            placeholder="Customer ID (e.g. 1)"
            value={customerId}
            onChange={e => { setCustomerId(e.target.value); setHistory([]); setHistoryMsg(null) }}
            type="number"
          />
          <button className="btn btn-olive" onClick={lookupHistory}>Fetch History</button>
        </div>
        {historyMsg && <div className={`msg ${historyMsg.type}`}>{historyMsg.text}</div>}
      </div>

      {history.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Movie</th>
                <th>Theatre</th>
                <th>Start Time</th>
                <th>Seat ID</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.BookingRef}>
                  <td>#{h.BookingRef}</td>
                  <td>{h.Movie}</td>
                  <td>{h.location}</td>
                  <td>{new Date(h.startTime).toLocaleString()}</td>
                  <td>{h.seatID}</td>
                  <td>Rs {Number(h.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Customers
