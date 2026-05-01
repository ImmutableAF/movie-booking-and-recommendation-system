import { useState, useEffect } from 'react'

function Home() {
    const [stats, setStats] = useState({})

    useEffect(() => {
        fetch('http://localhost:3000/bookings/stats')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setStats(data[0])
        })
    }, [])

    return (
        <div>
            <h1>Welcome to CinePulse 🎬</h1>
            <p>Your ultimate movie booking experience</p>
            <h2>Quick Stats</h2>
            <p>Total Bookings: {stats.TotalBookings}</p>
            <p>Total Revenue: {stats.TotalRevenue}</p>
            <p>Average Booking: {stats.AverageBookingValue}</p>
        </div>
    )
}

export default Home