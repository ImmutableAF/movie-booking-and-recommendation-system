import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/home'
import Movies from './pages/movies'
import Bookings from './pages/bookings'
import Customers from './pages/customers'
import Theatres from './pages/theatres'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <h1>CinePulse</h1>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/theatres">Theatres</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/bookings">Bookings</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
