USE TestDB;
GO

PRINT '--- EXECUTING SUCCESSFUL TRANSACTIONS ---';
-- Test 5: Process a valid booking (Customer 2, Screening 2, Seat 6)
EXEC sp_ProcessBooking @CustomerID = 2, @ScreeningID = 2, @SeatID = 6;
GO

-- Test 6: Cancel the booking we just made
-- Assuming the previous insert created Booking ID 2
EXEC sp_CancelBooking @BookingID = 2;
GO

-- Test 8 & 11: Get Customer History and Available Seats
EXEC sp_GetCustomerHistory @CustomerID = 1;
EXEC sp_GetAvailableSeats @ScreeningID = 1;
GO

-- Test 15: Run the structural loop to init seats for Screen 4
EXEC sp_InitializeScreenSeats @ScreenID = 4, @Rows = 5, @SeatsPerRow = 10;
GO

PRINT '--- EXECUTING VIEWS & SCALARS ---';
SELECT * FROM vw_ScreeningOccupancy;
SELECT * FROM vw_GlobalRevenue;
SELECT * FROM vw_TopCustomers;
SELECT * FROM vw_HighDemandScreenings;
SELECT * FROM vw_RevenueByScreenType;
SELECT * FROM vw_OrphanScreenings;
SELECT * FROM vw_CorporateCustomers;
SELECT dbo.fn_CalculateSurgePrice(1000, '2026-03-29');
GO

PRINT '--- TESTING DML TRIGGERS (EXPECTED FAILURES) ---';
BEGIN TRY
    -- Test 3 (Trigger 1): Attempt to link a seat to the wrong screening
    -- Booking 1 belongs to Screening 1. We attempt to insert Screening 2.
    INSERT INTO BookingSeats (bookingID, seatID, screeningID) VALUES (1, 2, 2);
END TRY
BEGIN CATCH
    PRINT 'Trigger 1 Successfully Blocked: ' + ERROR_MESSAGE();
END CATCH
GO

BEGIN TRY
    -- Test 4 (Trigger 2): Attempt to create overlapping screening
    -- Screen 1 already has a screening from 10:00 to 12:30.
    INSERT INTO Screenings (startTime, endTime, screenID, movieID) 
    VALUES ('2026-03-29 11:00', '2026-03-29 13:30', 1, 2);
END TRY
BEGIN CATCH
    PRINT 'Trigger 2 Successfully Blocked: ' + ERROR_MESSAGE();
END CATCH
GO

SELECT COLUMN_NAME, TABLE_NAME 
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('Movies','Customers','Screenings','Screens','Theatres','ScreenTypes')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

SELECT TOP 0 * FROM vw_GlobalRevenue;
SELECT TOP 0 * FROM vw_ScreeningOccupancy;
SELECT TOP 0 * FROM vw_TopCustomers;
SELECT TOP 0 * FROM vw_CorporateCustomers;
SELECT TOP 0 * FROM vw_OrphanScreenings;
SELECT TOP 0 * FROM vw_RevenueByScreenType;
EXEC sp_GetAvailableSeats @ScreeningID=1;
EXEC sp_GetCustomerHistory @CustomerID=1;