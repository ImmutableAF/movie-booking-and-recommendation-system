USE master;
GO

IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'TestDB')
BEGIN
    ALTER DATABASE TestDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE TestDB;
END
GO

CREATE DATABASE TestDB;
GO
USE TestDB;
GO

CREATE TABLE Movies(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(32) NOT NULL,
    releaseYear SMALLINT CHECK (releaseYear >= 1888 AND releaseYear <= YEAR(GETDATE()))
);

CREATE TABLE Theatres(
    id INT IDENTITY(1,1) PRIMARY KEY,
    location NVARCHAR(64) NOT NULL
);

CREATE TABLE ScreenTypes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    typeName NVARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE Screens(
    id INT IDENTITY(1,1) PRIMARY KEY,
    screenName NVARCHAR(16) NOT NULL,
    seatCap INT NOT NULL,
    seatsPerRow INT NOT NULL DEFAULT 20,
    theatreID INT NOT NULL,
    typeID INT NOT NULL,
    CONSTRAINT FK_Screens_Theatres FOREIGN KEY (theatreID) REFERENCES Theatres(id),
    CONSTRAINT FK_Screens_ScreenTypes FOREIGN KEY (typeID) REFERENCES ScreenTypes(id)
);

CREATE TABLE Screenings(
    id INT IDENTITY(1,1) PRIMARY KEY,
    startTime DATETIME2(0) NOT NULL,
    endTime DATETIME2(0) NOT NULL,
    screenID INT NOT NULL,
    movieID INT NOT NULL,
    CONSTRAINT CK_Screening_Time_Valid CHECK (endTime > startTime),
    CONSTRAINT FK_Screenings_Screen FOREIGN KEY(screenID) REFERENCES Screens(id),
    CONSTRAINT FK_Screenings_Movie FOREIGN KEY(movieID) REFERENCES Movies(id)
);

CREATE TABLE SeatRows (
    rowLabel NVARCHAR(3) NOT NULL,
    screenID INT NOT NULL,
    CONSTRAINT PK_SeatRows PRIMARY KEY (screenID, rowLabel),
    CONSTRAINT FK_SeatRows FOREIGN KEY (screenID) REFERENCES Screens(id)
);

CREATE TABLE Seats (
    id INT IDENTITY PRIMARY KEY NOT NULL,
    screenID INT NOT NULL,
    rowLabel NVARCHAR(3) NOT NULL,
    seatNo INT NOT NULL,
    CONSTRAINT UQ_Seat UNIQUE(screenID, rowLabel, seatNo),
    CONSTRAINT FK_Seats_SeatRows FOREIGN KEY (screenID, rowLabel) REFERENCES SeatRows(screenID, rowLabel)
);

CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(32) NOT NULL,
    email VARCHAR(255),
    phoneNumber VARCHAR(20),
    CONSTRAINT CK_Contact_Exists CHECK (email IS NOT NULL OR phoneNumber IS NOT NULL),
    CONSTRAINT CK_Email_Valid CHECK (email IS NULL OR email LIKE '%_@__%.__%'),
    CONSTRAINT CK_Phone_Valid CHECK (phoneNumber IS NULL OR (LEN(phoneNumber) >= 7 AND phoneNumber NOT LIKE '%[^0-9]%'))
);

CREATE TABLE TicketPrices (
    id INT IDENTITY PRIMARY KEY,
    basePrice DECIMAL(8,2) NOT NULL,
    movieID INT NOT NULL,
    screenID INT NOT NULL,
    CONSTRAINT FK_TicketPrices_Movies FOREIGN KEY(movieID) REFERENCES Movies(id),
    CONSTRAINT FK_TicketPrices_Screen FOREIGN KEY(screenID) REFERENCES Screens(id),
    CONSTRAINT UQ_TicketPrice UNIQUE(screenID, movieID)
);

CREATE TABLE Bookings(
    id INT IDENTITY PRIMARY KEY,
    total DECIMAL(8,2) NOT NULL,
    customerID INT NOT NULL,
    screeningID INT NOT NULL,
    priceID INT NOT NULL,
    CONSTRAINT FK_Bookings_Customers FOREIGN KEY (customerID) REFERENCES Customers(id),
    CONSTRAINT FK_Bookings_Screenings FOREIGN KEY (screeningID) REFERENCES Screenings(id),
    CONSTRAINT FK_Bookings_TicketPrices FOREIGN KEY (priceID) REFERENCES TicketPrices(id)
);

CREATE TABLE BookingSeats(
    id INT IDENTITY PRIMARY KEY,
    bookingID INT NOT NULL,
    seatID INT NOT NULL,
    screeningID INT NOT NULL,
    CONSTRAINT UQ_Screening_Seat UNIQUE(screeningID, seatID),
    CONSTRAINT FK_BookingSeats_Screenings FOREIGN KEY (screeningID) REFERENCES Screenings(id),
    CONSTRAINT FK_BookingsSeats_Seats FOREIGN KEY (seatID) REFERENCES Seats(id),
    CONSTRAINT FK_BookingSeats_Bookings FOREIGN KEY (bookingID) REFERENCES Bookings(id) ON DELETE CASCADE
);
GO

-- 1. TRIGGER: Enforce Screening ID match on BookingSeats
CREATE TRIGGER TR_BookingSeat_ScreeningMatch
ON BookingSeats
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        INNER JOIN Bookings b ON i.bookingID = b.id
        WHERE i.screeningID != b.screeningID
    )
    BEGIN
        RAISERROR('screeningID in BookingSeats must match the screeningID in Bookings', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 2. TRIGGER: Prevent Overlapping Screenings
CREATE TRIGGER TR_Screenings_PreventOverlap
ON Screenings
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN Screenings s ON i.screenID = s.screenID AND i.id != s.id
        WHERE i.startTime < s.endTime AND i.endTime > s.startTime
    )
    BEGIN
        RAISERROR('Screening time overlaps with an existing screening on this screen.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO