-- =============================================
-- CinePulse Database - Delete and Populate Script
-- =============================================

USE TestDB;
GO

-- =============================================
-- STEP 1: DELETE ALL DATA (in correct order to avoid FK conflicts)
-- =============================================

PRINT 'Deleting all data...';

-- Disable triggers temporarily
ALTER TABLE BookingSeats DISABLE TRIGGER TR_BookingSeat_ScreeningMatch;

-- Delete in reverse order of dependencies
DELETE FROM BookingSeats;
DELETE FROM Bookings;
DELETE FROM TicketPrices;
DELETE FROM Customers;
DELETE FROM Seats;
DELETE FROM SeatRows;
DELETE FROM Screenings;
DELETE FROM Screens;
DELETE FROM ScreenTypes;
DELETE FROM Theatres;
DELETE FROM Movies;

-- Reset IDENTITY columns to start from 1
DBCC CHECKIDENT ('BookingSeats', RESEED, 0);
DBCC CHECKIDENT ('Bookings', RESEED, 0);
DBCC CHECKIDENT ('TicketPrices', RESEED, 0);
DBCC CHECKIDENT ('Customers', RESEED, 0);
DBCC CHECKIDENT ('Seats', RESEED, 0);
DBCC CHECKIDENT ('Screenings', RESEED, 0);
DBCC CHECKIDENT ('Screens', RESEED, 0);
DBCC CHECKIDENT ('ScreenTypes', RESEED, 0);
DBCC CHECKIDENT ('Theatres', RESEED, 0);
DBCC CHECKIDENT ('Movies', RESEED, 0);

-- Re-enable triggers
ALTER TABLE BookingSeats ENABLE TRIGGER TR_BookingSeat_ScreeningMatch;

PRINT 'All data deleted successfully.';
GO

-- =============================================
-- STEP 2: POPULATE WITH SAMPLE DATA
-- =============================================

PRINT 'Populating database with sample data...';

-- Insert Movies
INSERT INTO Movies (name, releaseYear) VALUES
('Avengers: Endgame', 2019),
('Inception', 2010),
('The Dark Knight', 2008),
('Interstellar', 2014),
('Parasite', 2019),
('Joker', 2019),
('Dune', 2021),
('Spider-Man: No Way Home', 2021),
('Top Gun: Maverick', 2022),
('Avatar: The Way of Water', 2022),
('Oppenheimer', 2023),
('Barbie', 2023);

PRINT 'Movies inserted.';

-- Insert Theatres
INSERT INTO Theatres (location) VALUES
('Downtown Plaza, Lahore'),
('Liberty Market, Lahore'),
('DHA Phase 5, Lahore'),
('Gulberg Main Boulevard, Lahore'),
('Johar Town, Lahore');

PRINT 'Theatres inserted.';

-- Insert Screen Types
INSERT INTO ScreenTypes (typeName) VALUES
('Standard'),
('IMAX'),
('3D'),
('4DX'),
('Dolby Atmos');

PRINT 'Screen types inserted.';

-- Insert Screens (3 screens per theatre - simplified for clarity)
DECLARE @Theatre1 INT = 1, @Theatre2 INT = 2, @Theatre3 INT = 3, @Theatre4 INT = 4, @Theatre5 INT = 5;
DECLARE @Standard INT = 1, @IMAX INT = 2, @ThreeD INT = 3, @FourDX INT = 4, @Dolby INT = 5;

INSERT INTO Screens (screenName, seatCap, seatsPerRow, theatreID, typeID) VALUES
-- Theatre 1 (Downtown Plaza)
('Screen 1', 200, 20, @Theatre1, @Standard),
('Screen 2', 150, 15, @Theatre1, @IMAX),
('Screen 3', 180, 18, @Theatre1, @ThreeD),

-- Theatre 2 (Liberty Market)
('Screen 1', 220, 22, @Theatre2, @Standard),
('Screen 2', 160, 16, @Theatre2, @FourDX),
('Screen 3', 190, 19, @Theatre2, @Dolby),

-- Theatre 3 (DHA Phase 5)
('Screen 1', 210, 21, @Theatre3, @IMAX),
('Screen 2', 170, 17, @Theatre3, @ThreeD),
('Screen 3', 200, 20, @Theatre3, @Standard),

-- Theatre 4 (Gulberg)
('Screen 1', 180, 18, @Theatre4, @Dolby),
('Screen 2', 150, 15, @Theatre4, @Standard),

-- Theatre 5 (Johar Town)
('Screen 1', 200, 20, @Theatre5, @ThreeD),
('Screen 2', 190, 19, @Theatre5, @Standard);

PRINT 'Screens inserted.';

-- Insert Screenings (use variables for clarity)
DECLARE @Screen1 INT = 1, @Screen2 INT = 2, @Screen3 INT = 3, @Screen4 INT = 4, 
        @Screen5 INT = 5, @Screen6 INT = 6, @Screen7 INT = 7;

INSERT INTO Screenings (startTime, endTime, screenID, movieID) VALUES
-- Today's screenings
('2026-01-31 14:00:00', '2026-01-31 16:30:00', @Screen1, 11), -- Oppenheimer
('2026-01-31 17:00:00', '2026-01-31 19:00:00', @Screen1, 12), -- Barbie
('2026-01-31 19:30:00', '2026-01-31 22:00:00', @Screen1, 7),  -- Dune

('2026-01-31 15:00:00', '2026-01-31 17:30:00', @Screen2, 1),  -- Avengers
('2026-01-31 18:00:00', '2026-01-31 20:30:00', @Screen2, 8),  -- Spider-Man

('2026-01-31 16:00:00', '2026-01-31 18:30:00', @Screen3, 2),  -- Inception
('2026-01-31 19:00:00', '2026-01-31 21:30:00', @Screen3, 4),  -- Interstellar

-- Tomorrow's screenings
('2026-02-01 14:00:00', '2026-02-01 16:30:00', @Screen4, 9),  -- Top Gun
('2026-02-01 17:00:00', '2026-02-01 19:30:00', @Screen4, 10), -- Avatar
('2026-02-01 20:00:00', '2026-02-01 22:30:00', @Screen4, 11), -- Oppenheimer

('2026-02-01 15:00:00', '2026-02-01 17:00:00', @Screen5, 6),  -- Joker
('2026-02-01 18:00:00', '2026-02-01 20:00:00', @Screen5, 12), -- Barbie

('2026-02-01 16:00:00', '2026-02-01 18:30:00', @Screen6, 3),  -- Dark Knight
('2026-02-01 19:00:00', '2026-02-01 21:00:00', @Screen6, 5);  -- Parasite

PRINT 'Screenings inserted.';

-- Insert Seat Rows (10 rows per screen for simplicity)
DECLARE @screenID INT = 1;
DECLARE @maxScreenID INT = 13;
DECLARE @rowLabels TABLE (label NVARCHAR(3));

INSERT INTO @rowLabels VALUES ('A'), ('B'), ('C'), ('D'), ('E'), ('F'), ('G'), ('H'), ('I'), ('J');

WHILE @screenID <= @maxScreenID
BEGIN
    INSERT INTO SeatRows (rowLabel, screenID)
    SELECT label, @screenID FROM @rowLabels;
    
    SET @screenID = @screenID + 1;
END

PRINT 'Seat rows inserted.';

-- Insert Seats (20 seats per row for simplicity)
DECLARE @screenIDSeat INT = 1;
DECLARE @seatNo INT;

WHILE @screenIDSeat <= @maxScreenID
BEGIN
    DECLARE row_cursor CURSOR FOR 
    SELECT rowLabel FROM SeatRows WHERE screenID = @screenIDSeat;
    
    DECLARE @rowLabel NVARCHAR(3);
    OPEN row_cursor;
    FETCH NEXT FROM row_cursor INTO @rowLabel;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @seatNo = 1;
        WHILE @seatNo <= 20
        BEGIN
            INSERT INTO Seats (screenID, rowLabel, seatNo)
            VALUES (@screenIDSeat, @rowLabel, @seatNo);
            
            SET @seatNo = @seatNo + 1;
        END
        
        FETCH NEXT FROM row_cursor INTO @rowLabel;
    END
    
    CLOSE row_cursor;
    DEALLOCATE row_cursor;
    
    SET @screenIDSeat = @screenIDSeat + 1;
END

PRINT 'Seats inserted.';

-- Insert Customers
INSERT INTO Customers (name, email, phoneNumber) VALUES
('John Smith', 'john.smith@email.com', '3001234567'),
('Mutahhar Ahmed', 'mutahhar.ahmed@email.com', '3012345678'),
('Sarah Johnson', 'sarah.j@email.com', '3023456789'),
('Ali Hassan', 'ali.hassan@email.com', '3034567890'),
('Emma Wilson', 'emma.wilson@email.com', '3045678901'),
('Ahmed Khan', 'ahmed.khan@email.com', '3056789012'),
('Fatima Malik', 'fatima.malik@email.com', '3067890123'),
('Michael Brown', 'michael.b@email.com', '3078901234'),
('Ayesha Siddiqui', 'ayesha.s@email.com', '3089012345'),
('David Lee', 'david.lee@email.com', '3090123456'),
('Zainab Raza', NULL, '3001112222'),
('Robert Garcia', 'robert.g@email.com', NULL),
('Hina Tariq', 'hina.tariq@email.com', '3003334444'),
('James Martinez', 'james.m@email.com', '3004445555'),
('Mariam Naeem', 'mariam.n@email.com', '3005556666');

PRINT 'Customers inserted.';

-- Insert Ticket Prices (different prices for different screen types)
INSERT INTO TicketPrices (basePrice, movieID, screenID) VALUES
-- Screen 1 (Standard) - prices for movies shown there
(800.00, 11, 1), (750.00, 12, 1), (850.00, 7, 1),
-- Screen 2 (IMAX)
(1200.00, 1, 2), (1200.00, 8, 2),
-- Screen 3 (3D)
(1000.00, 2, 3), (1000.00, 4, 3),
-- Screen 4 (Standard)
(800.00, 9, 4), (800.00, 10, 4), (850.00, 11, 4),
-- Screen 5 (4DX)
(1500.00, 6, 5), (1500.00, 12, 5),
-- Screen 6 (Dolby Atmos)
(1100.00, 3, 6), (1100.00, 5, 6);

PRINT 'Ticket prices inserted.';

-- Insert Bookings and BookingSeats
-- Note: Seat IDs will be 1-200 for Screen 1 (10 rows × 20 seats)
--       201-400 for Screen 2, etc.

-- Booking 1: John books 2 seats for Oppenheimer (Screening 1, Screen 1)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (1600.00, 1, 1, 1);
DECLARE @Booking1 INT = SCOPE_IDENTITY();

-- Screen 1 starts at seat 1, Row A seats 1-2
INSERT INTO BookingSeats (bookingID, seatID, screeningID) 
SELECT @Booking1, id, 1 
FROM Seats 
WHERE screenID = 1 AND rowLabel = 'A' AND seatNo IN (1, 2);

-- Booking 2: Mutahhar books 4 seats for Barbie (Screening 2, Screen 1)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (3000.00, 2, 2, 2);
DECLARE @Booking2 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking2, id, 2
FROM Seats 
WHERE screenID = 1 AND rowLabel = 'B' AND seatNo IN (1, 2, 3, 4);

-- Booking 3: Sarah books 3 seats for Avengers (Screening 4, Screen 2, IMAX)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (3600.00, 3, 4, 4);
DECLARE @Booking3 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking3, id, 4
FROM Seats 
WHERE screenID = 2 AND rowLabel = 'C' AND seatNo IN (5, 6, 7);

-- Booking 4: Ali books 2 seats for Inception (Screening 6, Screen 3)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (2000.00, 4, 6, 6);
DECLARE @Booking4 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking4, id, 6
FROM Seats 
WHERE screenID = 3 AND rowLabel = 'D' AND seatNo IN (8, 9);

-- Booking 5: Emma books 5 seats for Top Gun (Screening 8, Screen 4)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (4000.00, 5, 8, 7);
DECLARE @Booking5 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking5, id, 8
FROM Seats 
WHERE screenID = 4 AND rowLabel = 'E' AND seatNo IN (10, 11, 12, 13, 14);

-- Booking 6: Ahmed books 1 seat for Joker (Screening 11, Screen 5, 4DX)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (1500.00, 6, 11, 11);
DECLARE @Booking6 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking6, id, 11
FROM Seats 
WHERE screenID = 5 AND rowLabel = 'F' AND seatNo = 15;

-- Booking 7: Fatima books 3 seats for Dark Knight (Screening 13, Screen 6)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (3300.00, 7, 13, 13);
DECLARE @Booking7 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking7, id, 13
FROM Seats 
WHERE screenID = 6 AND rowLabel = 'G' AND seatNo IN (1, 2, 3);

-- Booking 8: Michael books 2 seats for Dune (Screening 3, Screen 1)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (1700.00, 8, 3, 3);
DECLARE @Booking8 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking8, id, 3
FROM Seats 
WHERE screenID = 1 AND rowLabel = 'H' AND seatNo IN (5, 6);

-- Booking 9: Ayesha books 6 seats for Avatar (Screening 9, Screen 4)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (4800.00, 9, 9, 8);
DECLARE @Booking9 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking9, id, 9
FROM Seats 
WHERE screenID = 4 AND rowLabel = 'I' AND seatNo IN (7, 8, 9, 10, 11, 12);

-- Booking 10: David books 2 seats for Interstellar (Screening 7, Screen 3)
INSERT INTO Bookings (total, customerID, screeningID, priceID) 
VALUES (2000.00, 10, 7, 7);
DECLARE @Booking10 INT = SCOPE_IDENTITY();

INSERT INTO BookingSeats (bookingID, seatID, screeningID)
SELECT @Booking10, id, 7
FROM Seats 
WHERE screenID = 3 AND rowLabel = 'J' AND seatNo IN (13, 14);

PRINT 'Bookings and booking seats inserted.';

-- =============================================
-- STEP 3: VERIFICATION QUERIES
-- =============================================

PRINT '';
PRINT '=============================================';
PRINT 'DATA POPULATION COMPLETE!';
PRINT '=============================================';
PRINT '';

-- Display summary
SELECT 'Movies' AS TableName, COUNT(*) AS RecordCount FROM Movies
UNION ALL
SELECT 'Theatres', COUNT(*) FROM Theatres
UNION ALL
SELECT 'ScreenTypes', COUNT(*) FROM ScreenTypes
UNION ALL
SELECT 'Screens', COUNT(*) FROM Screens
UNION ALL
SELECT 'Screenings', COUNT(*) FROM Screenings
UNION ALL
SELECT 'SeatRows', COUNT(*) FROM SeatRows
UNION ALL
SELECT 'Seats', COUNT(*) FROM Seats
UNION ALL
SELECT 'Customers', COUNT(*) FROM Customers
UNION ALL
SELECT 'TicketPrices', COUNT(*) FROM TicketPrices
UNION ALL
SELECT 'Bookings', COUNT(*) FROM Bookings
UNION ALL
SELECT 'BookingSeats', COUNT(*) FROM BookingSeats;

PRINT '';
PRINT 'Sample booking details:';
PRINT '=============================================';

SELECT 
    b.id AS BookingID,
    c.name AS CustomerName,
    m.name AS Movie,
    sc.startTime AS ShowTime,
    t.location AS Theatre,
    s.screenName AS Screen,
    COUNT(bs.seatID) AS TotalSeats,
    b.total AS TotalAmount
FROM Bookings b
JOIN Customers c ON b.customerID = c.id
JOIN Screenings sc ON b.screeningID = sc.id
JOIN Movies m ON sc.movieID = m.id
JOIN Screens s ON sc.screenID = s.id
JOIN Theatres t ON s.theatreID = t.id
JOIN BookingSeats bs ON b.id = bs.bookingID
GROUP BY b.id, c.name, m.name, sc.startTime, t.location, s.screenName, b.total
ORDER BY b.id;

GO