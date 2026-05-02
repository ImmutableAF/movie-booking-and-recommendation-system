USE TestDB;
GO

-- 3. VIEW: Live Occupancy
CREATE VIEW vw_ScreeningOccupancy AS
SELECT 
    s.id AS ScreeningID, m.name AS Movie, t.location AS Theatre, sc.screenName, 
    s.startTime, sc.seatCap AS Capacity,
    COUNT(bs.seatID) AS BookedSeats,
    (sc.seatCap - COUNT(bs.seatID)) AS AvailableSeats,
    CAST((COUNT(bs.seatID) * 100.0 / sc.seatCap) AS DECIMAL(5,2)) AS OccupancyRate
FROM Screenings s
JOIN Movies m ON s.movieID = m.id
JOIN Screens sc ON s.screenID = sc.id
JOIN Theatres t ON sc.theatreID = t.id
LEFT JOIN BookingSeats bs ON s.id = bs.screeningID
GROUP BY s.id, m.name, t.location, sc.screenName, s.startTime, sc.seatCap;
GO

-- 4. VIEW: Global Revenue
CREATE VIEW vw_GlobalRevenue AS
SELECT 
    m.name AS MovieName, t.location AS TheatreLocation,
    COUNT(DISTINCT b.id) AS TotalTransactions, SUM(b.total) AS GrossRevenue
FROM Bookings b
JOIN Screenings s ON b.screeningID = s.id
JOIN Movies m ON s.movieID = m.id
JOIN Screens sc ON s.screenID = sc.id
JOIN Theatres t ON sc.theatreID = t.id
GROUP BY m.name, t.location;
GO

-- 5. PROCEDURE: Secure Seat Booking
CREATE PROCEDURE sp_ProcessBooking
    @CustomerID INT,
    @ScreeningID INT,
    @SeatID INT 
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        IF EXISTS (SELECT 1 FROM BookingSeats WHERE screeningID = @ScreeningID AND seatID = @SeatID)
            THROW 50001, 'Seat is already booked for this screening.', 1;

        DECLARE @PriceID INT, @Price DECIMAL(8,2);
        SELECT @PriceID = tp.id, @Price = tp.basePrice
        FROM TicketPrices tp
        JOIN Screenings s ON tp.movieID = s.movieID AND tp.screenID = s.screenID
        WHERE s.id = @ScreeningID;

        DECLARE @NewBookingID INT;
        INSERT INTO Bookings (total, customerID, screeningID, priceID)
        VALUES (@Price, @CustomerID, @ScreeningID, @PriceID);
        SET @NewBookingID = SCOPE_IDENTITY();

        INSERT INTO BookingSeats (bookingID, seatID, screeningID)
        VALUES (@NewBookingID, @SeatID, @ScreeningID);

        COMMIT TRANSACTION;
        SELECT @NewBookingID AS SuccessBookingID;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 6. PROCEDURE: Cancel Booking
CREATE PROCEDURE sp_CancelBooking @BookingID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM Bookings WHERE id = @BookingID;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 7. VIEW: Top Customers
CREATE VIEW vw_TopCustomers AS
WITH CustomerTheatreSpends AS (
    SELECT 
        c.id, c.name, t.location, SUM(b.total) as TotalSpent,
        RANK() OVER(PARTITION BY t.location ORDER BY SUM(b.total) DESC) as Rank
    FROM Customers c
    JOIN Bookings b ON c.id = b.customerID
    JOIN Screenings s ON b.screeningID = s.id
    JOIN Screens sc ON s.screenID = sc.id
    JOIN Theatres t ON sc.theatreID = t.id
    GROUP BY c.id, c.name, t.location
)
SELECT name, location, TotalSpent FROM CustomerTheatreSpends WHERE Rank = 1;
GO

-- 8. PROCEDURE: Available Seats
CREATE PROCEDURE sp_GetAvailableSeats @ScreeningID INT
AS
BEGIN
    SELECT s.id, s.rowLabel, s.seatNo
    FROM Seats s
    JOIN Screenings scr ON s.screenID = scr.screenID
    WHERE scr.id = @ScreeningID
    AND NOT EXISTS (
        SELECT 1 FROM BookingSeats bs 
        WHERE bs.screeningID = @ScreeningID AND bs.seatID = s.id
    );
END;
GO

-- 9. VIEW: High Demand Screenings
CREATE VIEW vw_HighDemandScreenings AS
SELECT screeningID, COUNT(seatID) AS SeatsSold
FROM BookingSeats
GROUP BY screeningID
HAVING COUNT(seatID) > (
    SELECT AVG(SoldCounts) FROM (
        SELECT COUNT(seatID) as SoldCounts FROM BookingSeats GROUP BY screeningID
    ) as SubQ
);
GO

-- 10. VIEW: Revenue by Screen Type
CREATE VIEW vw_RevenueByScreenType AS
SELECT 
    ISNULL(st.typeName, 'GRAND TOTAL') AS ScreenType, SUM(b.total) AS Revenue
FROM Bookings b
JOIN Screenings s ON b.screeningID = s.id
JOIN Screens sc ON s.screenID = sc.id
JOIN ScreenTypes st ON sc.typeID = st.id
GROUP BY ROLLUP(st.typeName);
GO

-- 11. PROCEDURE: Customer History
CREATE PROCEDURE sp_GetCustomerHistory @CustomerID INT
AS
BEGIN
    SELECT 
        b.id AS BookingRef, m.name AS Movie, s.startTime, t.location, bs.seatID, b.total
    FROM Bookings b
    JOIN Screenings s ON b.screeningID = s.id
    JOIN Movies m ON s.movieID = m.id
    JOIN Theatres t ON s.screenID = (SELECT screenID FROM Screens WHERE id = s.screenID)
    JOIN BookingSeats bs ON b.id = bs.bookingID
    WHERE b.customerID = @CustomerID
    ORDER BY s.startTime DESC;
END;
GO

-- 12. FUNCTION: Surge Pricing
CREATE FUNCTION fn_CalculateSurgePrice (@BasePrice DECIMAL(8,2), @ScreeningDate DATETIME2)
RETURNS DECIMAL(8,2)
AS
BEGIN
    DECLARE @FinalPrice DECIMAL(8,2) = @BasePrice;
    IF DATEPART(dw, @ScreeningDate) IN (1, 7)
        SET @FinalPrice = @BasePrice * 1.20;
    RETURN @FinalPrice;
END;
GO

-- 13. VIEW: Orphan Screenings
CREATE VIEW vw_OrphanScreenings AS
SELECT m.name, s.startTime, sc.screenName
FROM Screenings s
JOIN Movies m ON s.movieID = m.id
JOIN Screens sc ON s.screenID = sc.id
LEFT JOIN Bookings b ON s.id = b.screeningID
WHERE b.id IS NULL AND s.startTime > GETDATE();
GO

-- 14. VIEW: Corporate Customers
CREATE VIEW vw_CorporateCustomers AS
SELECT DISTINCT c1.name AS Cust1, c2.name AS Cust2, SUBSTRING(c1.email, CHARINDEX('@', c1.email), LEN(c1.email)) AS Domain
FROM Customers c1
JOIN Customers c2 ON SUBSTRING(c1.email, CHARINDEX('@', c1.email), LEN(c1.email)) = SUBSTRING(c2.email, CHARINDEX('@', c2.email), LEN(c2.email))
WHERE c1.id < c2.id;
GO

-- 15. PROCEDURE: Initialize Screen Seats
CREATE PROCEDURE sp_InitializeScreenSeats
    @ScreenID INT, @Rows INT, @SeatsPerRow INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @CurrentRow INT = 1;
    WHILE @CurrentRow <= @Rows
    BEGIN
        DECLARE @RowLabel NVARCHAR(3) = CHAR(64 + @CurrentRow);
        INSERT INTO SeatRows (screenID, rowLabel) VALUES (@ScreenID, @RowLabel);
        
        DECLARE @CurrentSeat INT = 1;
        WHILE @CurrentSeat <= @SeatsPerRow
        BEGIN
            INSERT INTO Seats (screenID, rowLabel, seatNo) VALUES (@ScreenID, @RowLabel, @CurrentSeat);
            SET @CurrentSeat = @CurrentSeat + 1;
        END
        SET @CurrentRow = @CurrentRow + 1;
    END
END;
GO