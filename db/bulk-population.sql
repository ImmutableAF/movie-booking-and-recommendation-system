USE TestDB;
GO

-- ============================================================
-- FULL WIPE (order respects FK constraints)
-- ============================================================
DELETE FROM BookingSeats;
DELETE FROM Bookings;
DELETE FROM TicketPrices;
DELETE FROM Screenings;
DELETE FROM Seats;
DELETE FROM SeatRows;
DELETE FROM Screens;
DELETE FROM ScreenTypes;
DELETE FROM Customers;
DELETE FROM Movies;
DELETE FROM Theatres;

-- Reset all identity counters
DBCC CHECKIDENT ('BookingSeats', RESEED, 0);
DBCC CHECKIDENT ('Bookings',     RESEED, 0);
DBCC CHECKIDENT ('TicketPrices', RESEED, 0);
DBCC CHECKIDENT ('Screenings',   RESEED, 0);
DBCC CHECKIDENT ('Seats',        RESEED, 0);
DBCC CHECKIDENT ('Screens',      RESEED, 0);
DBCC CHECKIDENT ('ScreenTypes',  RESEED, 0);
DBCC CHECKIDENT ('Customers',    RESEED, 0);
DBCC CHECKIDENT ('Movies',       RESEED, 0);
DBCC CHECKIDENT ('Theatres',     RESEED, 0);
GO

-- ============================================================
-- 1. MOVIES
-- ============================================================
INSERT INTO Movies (name, releaseYear) VALUES
('Inception',         2010),
('The Dark Knight',   2008),
('Interstellar',      2014),
('Dune',              2021),
('Oppenheimer',       2023),
('Parasite',          2019),
('The Matrix',        1999),
('Avatar',            2009),
('Tenet',             2020),
('Blade Runner 2049', 2017);
GO

-- ============================================================
-- 2. THEATRES
-- ============================================================
INSERT INTO Theatres (location) VALUES
('Lahore - Gulberg'),
('Lahore - DHA'),
('Karachi - Clifton'),
('Islamabad - F7');
GO

-- ============================================================
-- 3. SCREEN TYPES
-- ============================================================
INSERT INTO ScreenTypes (typeName) VALUES
('Standard'),
('IMAX'),
('4DX'),
('VIP');
GO

-- ============================================================
-- 4. SCREENS (2 per theatre)
-- ============================================================
INSERT INTO Screens (screenName, seatCap, seatsPerRow, theatreID, typeID) VALUES
('G1', 100, 10, 1, 1),  -- screenID 1
('G2',  60, 10, 1, 2),  -- screenID 2
('D1', 100, 10, 2, 1),  -- screenID 3
('D2',  40, 10, 2, 4),  -- screenID 4
('C1', 120, 10, 3, 1),  -- screenID 5
('C2',  80, 10, 3, 3),  -- screenID 6
('I1', 100, 10, 4, 1),  -- screenID 7
('I2',  60, 10, 4, 2);  -- screenID 8
GO

-- ============================================================
-- 5. INITIALIZE SEATS
-- ============================================================
EXEC sp_InitializeScreenSeats @ScreenID=1, @Rows=10, @SeatsPerRow=10;  -- IDs   1-100
EXEC sp_InitializeScreenSeats @ScreenID=2, @Rows=6,  @SeatsPerRow=10;  -- IDs 101-160
EXEC sp_InitializeScreenSeats @ScreenID=3, @Rows=10, @SeatsPerRow=10;  -- IDs 161-260
EXEC sp_InitializeScreenSeats @ScreenID=4, @Rows=4,  @SeatsPerRow=10;  -- IDs 261-300
EXEC sp_InitializeScreenSeats @ScreenID=5, @Rows=12, @SeatsPerRow=10;  -- IDs 301-420
EXEC sp_InitializeScreenSeats @ScreenID=6, @Rows=8,  @SeatsPerRow=10;  -- IDs 421-500
EXEC sp_InitializeScreenSeats @ScreenID=7, @Rows=10, @SeatsPerRow=10;  -- IDs 501-600
EXEC sp_InitializeScreenSeats @ScreenID=8, @Rows=6,  @SeatsPerRow=10;  -- IDs 601-660
GO

-- ============================================================
-- 6. CUSTOMERS
-- 4 corporate domain pairs for vw_CorporateCustomers
-- ============================================================
INSERT INTO Customers (name, email, phoneNumber) VALUES
('Ali Ahmed',      'ali@techcorp.pk',      '03001234561'),
('Ayesha Ahmed',   'ayesha@techcorp.pk',   '03001234562'),
('Bilal Khan',     'bilal@mediahouse.pk',  '03211234561'),
('Bushra Khan',    'bushra@mediahouse.pk', '03211234562'),
('Hamza Siddiqui', 'hamza@fintech.io',     '03451234561'),
('Hira Siddiqui',  'hira@fintech.io',      '03451234562'),
('Omar Sheikh',    'omar@logistics.pk',    '03321234561'),
('Omer Farooq',    'omer@logistics.pk',    '03321234562'),
('Zara Malik',     'zara@gmail.com',       '03111234561'),
('Usman Tariq',    'usman@gmail.com',      '03111234562'),
('Fatima Noor',    'fatima@hotmail.com',   '03551234561'),
('Saad Rehman',    'saad@hotmail.com',     '03551234562'),
('Nadia Qadir',    'nadia@yahoo.com',      '03661234561'),
('Kamran Ali',     'kamran@yahoo.com',     '03661234562'),
('Sana Javed',     'sana@outlook.com',     '03771234561'),
('Raza Hussain',   'raza@outlook.com',     '03771234562');
GO

-- ============================================================
-- 7. SCREENINGS
-- Past = will have bookings (revenue/occupancy views)
-- Future 2026 = orphans (vw_OrphanScreenings, startTime > GETDATE())
-- ============================================================
INSERT INTO Screenings (startTime, endTime, screenID, movieID) VALUES
-- screen 1 (G1 Standard, Gulberg)
('2025-01-10 14:00', '2025-01-10 16:30', 1, 1),   -- S1  Inception
('2025-01-11 18:00', '2025-01-11 20:15', 1, 2),   -- S2  Dark Knight
('2025-02-05 15:00', '2025-02-05 17:45', 1, 3),   -- S3  Interstellar
-- screen 2 (G2 IMAX, Gulberg)
('2025-02-10 20:00', '2025-02-10 22:45', 2, 4),   -- S4  Dune
('2025-03-01 17:00', '2025-03-01 19:30', 2, 5),   -- S5  Oppenheimer
-- screen 3 (D1 Standard, DHA)
('2025-03-15 13:00', '2025-03-15 15:15', 3, 6),   -- S6  Parasite
('2025-04-01 19:00', '2025-04-01 21:00', 3, 7),   -- S7  Matrix
-- screen 4 (D2 VIP, DHA)
('2025-04-10 16:00', '2025-04-10 18:50', 4, 8),   -- S8  Avatar
-- screen 5 (C1 Standard, Clifton)
('2025-04-20 14:00', '2025-04-20 16:30', 5, 9),   -- S9  Tenet
('2025-04-25 20:00', '2025-04-25 22:45', 5, 10),  -- S10 Blade Runner
-- screen 6 (C2 4DX, Clifton)
('2025-05-01 15:00', '2025-05-01 17:00', 6, 1),   -- S11 Inception 4DX
('2025-05-05 18:00', '2025-05-05 20:30', 6, 3),   -- S12 Interstellar 4DX
-- screen 7 (I1 Standard, F7)
('2025-05-10 14:00', '2025-05-10 16:15', 7, 2),   -- S13 Dark Knight
('2025-05-12 19:00', '2025-05-12 21:45', 7, 5),   -- S14 Oppenheimer
-- screen 8 (I2 IMAX, F7)
('2025-05-15 20:00', '2025-05-15 22:30', 8, 4),   -- S15 Dune IMAX

-- ORPHANS: future screenings, no bookings will be made
('2026-06-01 14:00', '2026-06-01 16:30', 1, 6),   -- S16 orphan
('2026-06-02 18:00', '2026-06-02 20:15', 2, 7),   -- S17 orphan
('2026-06-05 15:00', '2026-06-05 17:45', 3, 8),   -- S18 orphan
('2026-06-10 20:00', '2026-06-10 22:00', 5, 10),  -- S19 orphan
('2026-06-15 17:00', '2026-06-15 19:30', 7, 9);   -- S20 orphan
GO

-- ============================================================
-- 8. TICKET PRICES
-- ============================================================
INSERT INTO TicketPrices (basePrice, movieID, screenID) VALUES
(850.00,  1, 1),   -- Inception / G1
(850.00,  2, 1),   -- Dark Knight / G1
(850.00,  3, 1),   -- Interstellar / G1
(1500.00, 4, 2),   -- Dune / G2 IMAX
(1500.00, 5, 2),   -- Oppenheimer / G2 IMAX
(800.00,  6, 3),   -- Parasite / D1
(800.00,  7, 3),   -- Matrix / D1
(2500.00, 8, 4),   -- Avatar / D2 VIP
(900.00,  9, 5),   -- Tenet / C1
(900.00,  10, 5),  -- Blade Runner / C1
(1800.00, 1, 6),   -- Inception / C2 4DX
(1800.00, 3, 6),   -- Interstellar / C2 4DX
(800.00,  2, 7),   -- Dark Knight / I1
(800.00,  5, 7),   -- Oppenheimer / I1
(1500.00, 4, 8);   -- Dune / I2 IMAX
GO

-- ============================================================
-- 9. BOOKINGS via sp_ProcessBooking
-- Seat IDs looked up dynamically to be immune to IDENTITY gaps
-- ============================================================
DECLARE @s1A1  INT, @s1A2  INT, @s1A3  INT, @s1A4  INT, @s1A5  INT,
        @s1B1  INT, @s1B2  INT, @s1B3  INT, @s1B4  INT,
        @s1C1  INT, @s1C2  INT, @s1C3  INT, @s1C4  INT, @s1C5  INT, @s1C6  INT,
        @s2A1  INT, @s2A2  INT, @s2A3  INT, @s2A4  INT, @s2A5  INT, @s2A6  INT,
        @s2B1  INT, @s2B2  INT, @s2B3  INT, @s2B4  INT,
        @s3A1  INT, @s3A2  INT, @s3A3  INT,
        @s3B1  INT, @s3B2  INT, @s3B3  INT, @s3B4  INT,
        @s4A1  INT, @s4A2  INT, @s4A3  INT,
        @s5A1  INT, @s5A2  INT, @s5A3  INT, @s5A4  INT,
        @s5B1  INT, @s5B2  INT, @s5B3  INT,
        @s6A1  INT, @s6A2  INT, @s6A3  INT, @s6A4  INT, @s6A5  INT,
        @s6B1  INT, @s6B2  INT, @s6B3  INT, @s6B4  INT,
        @s7A1  INT, @s7A2  INT, @s7A3  INT,
        @s7B1  INT, @s7B2  INT, @s7B3  INT, @s7B4  INT,
        @s8A1  INT, @s8A2  INT, @s8A3  INT, @s8A4  INT, @s8A5  INT;

-- Screen 1 seats
SELECT @s1A1=id FROM Seats WHERE screenID=1 AND rowLabel='A' AND seatNo=1;
SELECT @s1A2=id FROM Seats WHERE screenID=1 AND rowLabel='A' AND seatNo=2;
SELECT @s1A3=id FROM Seats WHERE screenID=1 AND rowLabel='A' AND seatNo=3;
SELECT @s1A4=id FROM Seats WHERE screenID=1 AND rowLabel='A' AND seatNo=4;
SELECT @s1A5=id FROM Seats WHERE screenID=1 AND rowLabel='A' AND seatNo=5;
SELECT @s1B1=id FROM Seats WHERE screenID=1 AND rowLabel='B' AND seatNo=1;
SELECT @s1B2=id FROM Seats WHERE screenID=1 AND rowLabel='B' AND seatNo=2;
SELECT @s1B3=id FROM Seats WHERE screenID=1 AND rowLabel='B' AND seatNo=3;
SELECT @s1B4=id FROM Seats WHERE screenID=1 AND rowLabel='B' AND seatNo=4;
SELECT @s1C1=id FROM Seats WHERE screenID=1 AND rowLabel='C' AND seatNo=1;
SELECT @s1C2=id FROM Seats WHERE screenID=1 AND rowLabel='C' AND seatNo=2;
SELECT @s1C3=id FROM Seats WHERE screenID=1 AND rowLabel='C' AND seatNo=3;
SELECT @s1C4=id FROM Seats WHERE screenID=1 AND rowLabel='C' AND seatNo=4;
SELECT @s1C5=id FROM Seats WHERE screenID=1 AND rowLabel='C' AND seatNo=5;
SELECT @s1C6=id FROM Seats WHERE screenID=1 AND rowLabel='C' AND seatNo=6;

-- Screen 2 seats
SELECT @s2A1=id FROM Seats WHERE screenID=2 AND rowLabel='A' AND seatNo=1;
SELECT @s2A2=id FROM Seats WHERE screenID=2 AND rowLabel='A' AND seatNo=2;
SELECT @s2A3=id FROM Seats WHERE screenID=2 AND rowLabel='A' AND seatNo=3;
SELECT @s2A4=id FROM Seats WHERE screenID=2 AND rowLabel='A' AND seatNo=4;
SELECT @s2A5=id FROM Seats WHERE screenID=2 AND rowLabel='A' AND seatNo=5;
SELECT @s2A6=id FROM Seats WHERE screenID=2 AND rowLabel='A' AND seatNo=6;
SELECT @s2B1=id FROM Seats WHERE screenID=2 AND rowLabel='B' AND seatNo=1;
SELECT @s2B2=id FROM Seats WHERE screenID=2 AND rowLabel='B' AND seatNo=2;
SELECT @s2B3=id FROM Seats WHERE screenID=2 AND rowLabel='B' AND seatNo=3;
SELECT @s2B4=id FROM Seats WHERE screenID=2 AND rowLabel='B' AND seatNo=4;

-- Screen 3 seats
SELECT @s3A1=id FROM Seats WHERE screenID=3 AND rowLabel='A' AND seatNo=1;
SELECT @s3A2=id FROM Seats WHERE screenID=3 AND rowLabel='A' AND seatNo=2;
SELECT @s3A3=id FROM Seats WHERE screenID=3 AND rowLabel='A' AND seatNo=3;
SELECT @s3B1=id FROM Seats WHERE screenID=3 AND rowLabel='B' AND seatNo=1;
SELECT @s3B2=id FROM Seats WHERE screenID=3 AND rowLabel='B' AND seatNo=2;
SELECT @s3B3=id FROM Seats WHERE screenID=3 AND rowLabel='B' AND seatNo=3;
SELECT @s3B4=id FROM Seats WHERE screenID=3 AND rowLabel='B' AND seatNo=4;

-- Screen 4 seats
SELECT @s4A1=id FROM Seats WHERE screenID=4 AND rowLabel='A' AND seatNo=1;
SELECT @s4A2=id FROM Seats WHERE screenID=4 AND rowLabel='A' AND seatNo=2;
SELECT @s4A3=id FROM Seats WHERE screenID=4 AND rowLabel='A' AND seatNo=3;

-- Screen 5 seats
SELECT @s5A1=id FROM Seats WHERE screenID=5 AND rowLabel='A' AND seatNo=1;
SELECT @s5A2=id FROM Seats WHERE screenID=5 AND rowLabel='A' AND seatNo=2;
SELECT @s5A3=id FROM Seats WHERE screenID=5 AND rowLabel='A' AND seatNo=3;
SELECT @s5A4=id FROM Seats WHERE screenID=5 AND rowLabel='A' AND seatNo=4;
SELECT @s5B1=id FROM Seats WHERE screenID=5 AND rowLabel='B' AND seatNo=1;
SELECT @s5B2=id FROM Seats WHERE screenID=5 AND rowLabel='B' AND seatNo=2;
SELECT @s5B3=id FROM Seats WHERE screenID=5 AND rowLabel='B' AND seatNo=3;

-- Screen 6 seats
SELECT @s6A1=id FROM Seats WHERE screenID=6 AND rowLabel='A' AND seatNo=1;
SELECT @s6A2=id FROM Seats WHERE screenID=6 AND rowLabel='A' AND seatNo=2;
SELECT @s6A3=id FROM Seats WHERE screenID=6 AND rowLabel='A' AND seatNo=3;
SELECT @s6A4=id FROM Seats WHERE screenID=6 AND rowLabel='A' AND seatNo=4;
SELECT @s6A5=id FROM Seats WHERE screenID=6 AND rowLabel='A' AND seatNo=5;
SELECT @s6B1=id FROM Seats WHERE screenID=6 AND rowLabel='B' AND seatNo=1;
SELECT @s6B2=id FROM Seats WHERE screenID=6 AND rowLabel='B' AND seatNo=2;
SELECT @s6B3=id FROM Seats WHERE screenID=6 AND rowLabel='B' AND seatNo=3;
SELECT @s6B4=id FROM Seats WHERE screenID=6 AND rowLabel='B' AND seatNo=4;

-- Screen 7 seats
SELECT @s7A1=id FROM Seats WHERE screenID=7 AND rowLabel='A' AND seatNo=1;
SELECT @s7A2=id FROM Seats WHERE screenID=7 AND rowLabel='A' AND seatNo=2;
SELECT @s7A3=id FROM Seats WHERE screenID=7 AND rowLabel='A' AND seatNo=3;
SELECT @s7B1=id FROM Seats WHERE screenID=7 AND rowLabel='B' AND seatNo=1;
SELECT @s7B2=id FROM Seats WHERE screenID=7 AND rowLabel='B' AND seatNo=2;
SELECT @s7B3=id FROM Seats WHERE screenID=7 AND rowLabel='B' AND seatNo=3;
SELECT @s7B4=id FROM Seats WHERE screenID=7 AND rowLabel='B' AND seatNo=4;

-- Screen 8 seats
SELECT @s8A1=id FROM Seats WHERE screenID=8 AND rowLabel='A' AND seatNo=1;
SELECT @s8A2=id FROM Seats WHERE screenID=8 AND rowLabel='A' AND seatNo=2;
SELECT @s8A3=id FROM Seats WHERE screenID=8 AND rowLabel='A' AND seatNo=3;
SELECT @s8A4=id FROM Seats WHERE screenID=8 AND rowLabel='A' AND seatNo=4;
SELECT @s8A5=id FROM Seats WHERE screenID=8 AND rowLabel='A' AND seatNo=5;

-- S1: Inception (screen 1)
EXEC sp_ProcessBooking 1,  1, @s1A1;
EXEC sp_ProcessBooking 2,  1, @s1A2;
EXEC sp_ProcessBooking 3,  1, @s1A3;
EXEC sp_ProcessBooking 9,  1, @s1A4;
EXEC sp_ProcessBooking 10, 1, @s1A5;

-- S2: Dark Knight (screen 1)
EXEC sp_ProcessBooking 4,  2, @s1B1;
EXEC sp_ProcessBooking 5,  2, @s1B2;
EXEC sp_ProcessBooking 6,  2, @s1B3;
EXEC sp_ProcessBooking 11, 2, @s1B4;

-- S3: Interstellar (screen 1)
EXEC sp_ProcessBooking 7,  3, @s1C1;
EXEC sp_ProcessBooking 8,  3, @s1C2;
EXEC sp_ProcessBooking 1,  3, @s1C3;
EXEC sp_ProcessBooking 2,  3, @s1C4;
EXEC sp_ProcessBooking 12, 3, @s1C5;
EXEC sp_ProcessBooking 13, 3, @s1C6;

-- S4: Dune IMAX (screen 2)
EXEC sp_ProcessBooking 1,  4, @s2A1;
EXEC sp_ProcessBooking 3,  4, @s2A2;
EXEC sp_ProcessBooking 5,  4, @s2A3;
EXEC sp_ProcessBooking 9,  4, @s2A4;
EXEC sp_ProcessBooking 14, 4, @s2A5;
EXEC sp_ProcessBooking 15, 4, @s2A6;

-- S5: Oppenheimer IMAX (screen 2)
EXEC sp_ProcessBooking 2,  5, @s2B1;
EXEC sp_ProcessBooking 4,  5, @s2B2;
EXEC sp_ProcessBooking 6,  5, @s2B3;
EXEC sp_ProcessBooking 16, 5, @s2B4;

-- S6: Parasite (screen 3)
EXEC sp_ProcessBooking 3,  6, @s3A1;
EXEC sp_ProcessBooking 7,  6, @s3A2;
EXEC sp_ProcessBooking 11, 6, @s3A3;

-- S7: Matrix (screen 3)
EXEC sp_ProcessBooking 8,  7, @s3B1;
EXEC sp_ProcessBooking 10, 7, @s3B2;
EXEC sp_ProcessBooking 12, 7, @s3B3;
EXEC sp_ProcessBooking 13, 7, @s3B4;

-- S8: Avatar VIP (screen 4)
EXEC sp_ProcessBooking 1,  8, @s4A1;
EXEC sp_ProcessBooking 5,  8, @s4A2;
EXEC sp_ProcessBooking 9,  8, @s4A3;

-- S9: Tenet (screen 5)
EXEC sp_ProcessBooking 2,  9, @s5A1;
EXEC sp_ProcessBooking 6,  9, @s5A2;
EXEC sp_ProcessBooking 14, 9, @s5A3;
EXEC sp_ProcessBooking 15, 9, @s5A4;

-- S10: Blade Runner (screen 5)
EXEC sp_ProcessBooking 3,  10, @s5B1;
EXEC sp_ProcessBooking 7,  10, @s5B2;
EXEC sp_ProcessBooking 16, 10, @s5B3;

-- S11: Inception 4DX (screen 6)
EXEC sp_ProcessBooking 4,  11, @s6A1;
EXEC sp_ProcessBooking 8,  11, @s6A2;
EXEC sp_ProcessBooking 10, 11, @s6A3;
EXEC sp_ProcessBooking 11, 11, @s6A4;
EXEC sp_ProcessBooking 12, 11, @s6A5;

-- S12: Interstellar 4DX (screen 6)
EXEC sp_ProcessBooking 1,  12, @s6B1;
EXEC sp_ProcessBooking 2,  12, @s6B2;
EXEC sp_ProcessBooking 5,  12, @s6B3;
EXEC sp_ProcessBooking 13, 12, @s6B4;

-- S13: Dark Knight (screen 7)
EXEC sp_ProcessBooking 3,  13, @s7A1;
EXEC sp_ProcessBooking 9,  13, @s7A2;
EXEC sp_ProcessBooking 14, 13, @s7A3;

-- S14: Oppenheimer (screen 7)
EXEC sp_ProcessBooking 4,  14, @s7B1;
EXEC sp_ProcessBooking 6,  14, @s7B2;
EXEC sp_ProcessBooking 15, 14, @s7B3;
EXEC sp_ProcessBooking 16, 14, @s7B4;

-- S15: Dune IMAX (screen 8)
EXEC sp_ProcessBooking 1,  15, @s8A1;
EXEC sp_ProcessBooking 7,  15, @s8A2;
EXEC sp_ProcessBooking 8,  15, @s8A3;
EXEC sp_ProcessBooking 10, 15, @s8A4;
EXEC sp_ProcessBooking 11, 15, @s8A5;
GO

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'Movies'      AS [Table], COUNT(*) AS Rows FROM Movies
UNION ALL SELECT 'Theatres',     COUNT(*) FROM Theatres
UNION ALL SELECT 'ScreenTypes',  COUNT(*) FROM ScreenTypes
UNION ALL SELECT 'Screens',      COUNT(*) FROM Screens
UNION ALL SELECT 'Seats',        COUNT(*) FROM Seats
UNION ALL SELECT 'Customers',    COUNT(*) FROM Customers
UNION ALL SELECT 'Screenings',   COUNT(*) FROM Screenings
UNION ALL SELECT 'TicketPrices', COUNT(*) FROM TicketPrices
UNION ALL SELECT 'Bookings',     COUNT(*) FROM Bookings
UNION ALL SELECT 'BookingSeats', COUNT(*) FROM BookingSeats;
GO

SELECT TOP 5 * FROM vw_GlobalRevenue;
SELECT TOP 5 * FROM vw_ScreeningOccupancy;
SELECT TOP 5 * FROM vw_TopCustomers;
SELECT TOP 5 * FROM vw_CorporateCustomers;
SELECT TOP 5 * FROM vw_OrphanScreenings;
SELECT TOP 5 * FROM vw_RevenueByScreenType;
GO