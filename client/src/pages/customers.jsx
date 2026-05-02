import { useState, useEffect } from 'react'

function Customers() {
  const [searchResults, setSearchResults] = useState([])
  const [highSpenders, setHighSpenders] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/customers/search').then(res => res.json()).then(setSearchResults)
    fetch('http://localhost:3000/customers/high-spenders').then(res => res.json()).then(setHighSpenders)
  }, [])

  const deleteCustomer = () => {
    fetch(`http://localhost:3000/customers/${deleteId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.error) setMsg({ type: 'error', text: data.error })
        else { setMsg({ type: 'success', text: 'Customer deleted!' }); setDeleteId('') }
      })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Customers</h1>
        <p>Customer search, analytics and management</p>
      </div>

      <div className="form-card">
        <h2>Delete Customer by ID</h2>
        <div className="form-row">
          <input placeholder="Customer ID" value={deleteId} onChange={e => setDeleteId(e.target.value)} type="number" />
          <button className="btn btn-maroon" onClick={deleteCustomer}>Delete Customer</button>
        </div>
        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
      </div>

      <h2 className="section-title">Customers Whose Name Starts With 'A'</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr>
          </thead>
          <tbody>
            {searchResults.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">High Spenders (Above Average)</h2>
      <div className="grid">
        {highSpenders.map(c => (
          <div className="card" key={c.id}>
            <h3>{c.name}</h3>
            <p>{c.email}</p>
            <span className="badge maroon">High Spender</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Customers