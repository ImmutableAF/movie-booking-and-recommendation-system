USE master;
GO

IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'CinemaDB')
BEGIN
    ALTER DATABASE CinemaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CinemaDB;
END
GO

CREATE DATABASE CinemaDB;
GO

USE CinemaDB;
GO

CREATE TABLE Movies(
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(64) NOT NULL,
    releaseYear SMALLINT NOT NULL
);

CREATE TABLE Theatres(
    id INT IDENTITY PRIMARY KEY,
    location NVARCHAR(128) NOT NULL
);

CREATE TABLE ScreenTypes(
    id INT IDENTITY PRIMARY KEY,
    typeName NVARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE Screens(
    id INT IDENTITY PRIMARY KEY,
    screenName NVARCHAR(32) NOT NULL,
    seatsPerRow INT NOT NULL DEFAULT 20,
    theatreID INT NOT NULL,
    typeID INT NOT NULL,

    CONSTRAINT FK_Screens_Theatres
        FOREIGN KEY (theatreID) REFERENCES Theatres(id),

    CONSTRAINT FK_Screens_Types
        FOREIGN KEY (typeID) REFERENCES ScreenTypes(id),

    CONSTRAINT UQ_Screen UNIQUE(theatreID, screenName)
);

CREATE TABLE SeatRows(
    screenID INT NOT NULL,
    rowLabel NVARCHAR(3) NOT NULL,

    CONSTRAINT PK_SeatRows
        PRIMARY KEY(screenID, rowLabel),

    CONSTRAINT FK_SeatRows_Screens
        FOREIGN KEY(screenID) REFERENCES Screens(id)
);

CREATE TABLE Seats(
    id INT IDENTITY PRIMARY KEY,
    screenID INT NOT NULL,
    rowLabel NVARCHAR(3) NOT NULL,
    seatNo INT NOT NULL,

    CONSTRAINT FK_Seats_SeatRows
        FOREIGN KEY(screenID, rowLabel)
        REFERENCES SeatRows(screenID, rowLabel),

    CONSTRAINT UQ_Seat UNIQUE(screenID, rowLabel, seatNo)
);

CREATE TABLE Screenings(
    id INT IDENTITY PRIMARY KEY,
    screenID INT NOT NULL,
    movieID INT NOT NULL,
    startTime DATETIME2(0) NOT NULL,
    endTime DATETIME2(0) NOT NULL,
    ticketPrice DECIMAL(8,2) NOT NULL,

    CONSTRAINT CK_Time CHECK (endTime > startTime),

    CONSTRAINT FK_Screenings_Screens
        FOREIGN KEY(screenID) REFERENCES Screens(id),

    CONSTRAINT FK_Screenings_Movies
        FOREIGN KEY(movieID) REFERENCES Movies(id)
);

-- prevents overlapping screenings
CREATE TRIGGER TR_NoOverlappingScreenings
ON Screenings
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM Screenings s
        JOIN inserted i
            ON s.screenID = i.screenID
           AND s.id <> i.id
           AND s.startTime < i.endTime
           AND s.endTime > i.startTime
    )
    BEGIN
        RAISERROR('Overlapping screenings on same screen.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TABLE Customers(
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(64) NOT NULL,
    email VARCHAR(255),
    phoneNumber VARCHAR(20),

    CONSTRAINT CK_Contact
        CHECK (email IS NOT NULL OR phoneNumber IS NOT NULL)
);

CREATE TABLE Bookings(
    id INT IDENTITY PRIMARY KEY,
    customerID INT NOT NULL,
    screeningID INT NOT NULL,
    bookingTime DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Bookings_Customers
        FOREIGN KEY(customerID) REFERENCES Customers(id),

    CONSTRAINT FK_Bookings_Screenings
        FOREIGN KEY(screeningID) REFERENCES Screenings(id)
);

CREATE TABLE BookingSeats(
    id INT IDENTITY PRIMARY KEY,
    bookingID INT NOT NULL,
    seatID INT NOT NULL,

    CONSTRAINT FK_BookingSeats_Bookings
        FOREIGN KEY(bookingID) REFERENCES Bookings(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_BookingSeats_Seats
        FOREIGN KEY(seatID) REFERENCES Seats(id),

    CONSTRAINT UQ_Seat_Per_Booking UNIQUE(bookingID, seatID)
);
GO

-- prevents double booking of same seat in same screening
CREATE TRIGGER TR_PreventDoubleSeatBooking
ON BookingSeats
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM BookingSeats bs
        JOIN Bookings b ON bs.bookingID = b.id
        JOIN inserted i ON bs.seatID = i.seatID
        JOIN Bookings b2 ON i.bookingID = b2.id
        WHERE b.screeningID = b2.screeningID
          AND bs.id <> i.id
    )
    BEGIN
        RAISERROR('Seat already booked for this screening.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO
