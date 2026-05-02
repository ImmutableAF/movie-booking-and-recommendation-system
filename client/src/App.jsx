import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import Screenings from './pages/Screenings'
import Theatres from './pages/Theatres'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>CinePulse</h1>
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/screenings">Screenings</Link>
        <Link to="/theatres">Theatres</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/screenings" element={<Screenings />} />
        <Route path="/theatres" element={<Theatres />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App