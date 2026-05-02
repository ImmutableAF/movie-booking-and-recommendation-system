USE TestDB;
GO

INSERT INTO Movies (name, releaseYear) VALUES 
('Interstellar', 2014), ('Inception', 2010), ('The Dark Knight', 2008), ('Dune', 2021), ('Avatar', 2009);

INSERT INTO Theatres (location) VALUES 
('Lahore'), ('Karachi'), ('Islamabad');

INSERT INTO ScreenTypes (typeName) VALUES 
('Standard'), ('IMAX'), ('3D'), ('Dolby Cinema');

INSERT INTO Screens (screenName, seatCap, seatsPerRow, theatreID, typeID) VALUES 
('Screen 1', 100, 10, 1, 1), ('Screen 2', 120, 12, 1, 2), ('Screen 3', 80, 8, 2, 1), ('Screen 4', 90, 9, 3, 3);

INSERT INTO SeatRows (screenID, rowLabel) VALUES 
(1,'A'),(1,'B'),(1,'C'), (2,'A'),(2,'B'), (3,'A'),(3,'B'), (4,'A'),(4,'B');

INSERT INTO Seats (screenID,rowLabel,seatNo) VALUES 
(1,'A',1),(1,'A',2),(1,'A',3), (1,'B',1),(1,'B',2), (2,'A',1),(2,'A',2), (3,'A',1),(3,'A',2), (4,'A',1),(4,'A',2);

INSERT INTO Screenings (startTime,endTime,screenID,movieID) VALUES 
('2026-03-29 10:00','2026-03-29 12:30',1,1), 
('2026-03-29 13:00','2026-03-29 15:30',1,2), 
('2026-03-29 16:00','2026-03-29 18:30',2,3);

INSERT INTO Customers (name,email,phoneNumber) VALUES 
('Ali Khan','ali@gmail.com','03001234567'), 
('Ahmed Raza','ahmed@gmail.com','03007654321');

INSERT INTO TicketPrices (basePrice,movieID,screenID) VALUES 
(800,1,1), (850,2,1), (900,3,2);
GO

-- Seed an initial valid booking to establish report data
INSERT INTO Bookings (total, customerID, screeningID, priceID) VALUES (800, 1, 1, 1);
INSERT INTO BookingSeats (bookingID, seatID, screeningID) VALUES (1, 1, 1);
GO