import { useState, useEffect } from 'react'

function Theatres() {
  const [allTheatres, setAllTheatres] = useState([])
  const [theatres, setTheatres] = useState([])
  const [screenCounts, setScreenCounts] = useState([])
  const [location, setLocation] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [updateLocation, setUpdateLocation] = useState('')
  const [addMsg, setAddMsg] = useState(null)
  const [updateMsg, setUpdateMsg] = useState(null)

  const fetchAll = () => {
    fetch('http://localhost:3000/theatres').then(res => res.json()).then(setAllTheatres)
    fetch('http://localhost:3000/theatres/with-screens').then(res => res.json()).then(setTheatres)
    fetch('http://localhost:3000/theatres/screen-count').then(res => res.json()).then(setScreenCounts)
  }

  useEffect(() => { fetchAll() }, [])

  const addTheatre = () => {
    fetch('http://localhost:3000/theatres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setAddMsg({ type: 'error', text: data.error })
        else { setAddMsg({ type: 'success', text: 'Theatre added!' }); setLocation(''); fetchAll() }
      })
  }

  const updateTheatre = () => {
    fetch(`http://localhost:3000/theatres/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: updateLocation })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setUpdateMsg({ type: 'error', text: data.error })
        else { setUpdateMsg({ type: 'success', text: 'Theatre updated!' }); setUpdateId(''); setUpdateLocation(''); fetchAll() }
      })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Theatres</h1>
        <p>Manage theatres and view screen availability</p>
      </div>

      <div className="form-card">
        <h2>Add New Theatre</h2>
        <div className="form-row">
          <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
          <button className="btn btn-olive" onClick={addTheatre}>Add Theatre</button>
        </div>
        {addMsg && <div className={`msg ${addMsg.type}`}>{addMsg.text}</div>}
      </div>

      <div className="form-card">
        <h2>Update Theatre Location</h2>
        <div className="form-row">
          <input placeholder="Theatre ID" value={updateId} onChange={e => setUpdateId(e.target.value)} type="number" />
          <input placeholder="New location" value={updateLocation} onChange={e => setUpdateLocation(e.target.value)} />
          <button className="btn btn-maroon" onClick={updateTheatre}>Update</button>
        </div>
        {updateMsg && <div className={`msg ${updateMsg.type}`}>{updateMsg.text}</div>}
      </div>

      <h2 className="section-title">All Theatres</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Location</th></tr>
          </thead>
          <tbody>
            {allTheatres.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Screens by Theatre</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Screen Name</th><th>Theatre Location</th></tr>
          </thead>
          <tbody>
            {theatres.map((t, i) => (
              <tr key={i}>
                <td>{t.screenName}</td>
                <td>{t.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Screen Count Per Theatre</h2>
      <div className="grid">
        {screenCounts.map(t => (
          <div className="card" key={t.location}>
            <h3>{t.location}</h3>
            <p>{t.NumberOfScreens} screen{t.NumberOfScreens !== 1 ? 's' : ''}</p>
            <span className="badge">{t.NumberOfScreens} Screens</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Theatres