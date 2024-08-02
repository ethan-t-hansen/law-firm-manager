-- Drop tables if they exist
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE INSURANCETABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CLIENTTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE OFFICERTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TICKETTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TICKETLOCTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TICKETTYPESTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE SPEEDINGTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE ZONETABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PARKINGTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE TRAFFICLIGHTTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE COURTTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE JUDGETABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE PROSECUTORTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE FIRMTABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE CASETABLE CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Create tables
CREATE TABLE CLIENTTABLE(
    ClientID INT PRIMARY KEY,
    PhoneNum CHAR(10) NOT NULL,
    Name VARCHAR(30) NOT NULL,
    Email VARCHAR(30) NOT NULL,
    DateOfBirth VARCHAR(30),
    UNIQUE(Email)
);

CREATE TABLE OFFICERTABLE(
    OfficerID INT PRIMARY KEY,
    Department VARCHAR(30) NOT NULL,
    Name VARCHAR(30) NOT NULL
);

CREATE TABLE COURTTABLE(
    CourtName VARCHAR(30) PRIMARY KEY,
    Location VARCHAR(30) NOT NULL,
    Type VARCHAR(30)
);

CREATE TABLE JUDGETABLE(
    JudgeID INT PRIMARY KEY,
    Name VARCHAR(30),
    CourtName VARCHAR(30),
    FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName)
);

CREATE TABLE FIRMTABLE(
    FirmName VARCHAR(30) PRIMARY KEY,
    Clerk VARCHAR(30)
);

CREATE TABLE PROSECUTORTABLE(
    ProsecutorID INT PRIMARY KEY,
    Name VARCHAR(30),
    CourtName VARCHAR(30),
    FirmName VARCHAR(30),
    FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName),
    FOREIGN KEY (FirmName) REFERENCES FIRMTABLE(FirmName)
);

CREATE TABLE INSURANCETABLE(
    PolicyNum INT,
    ExpiryDate Varchar(30) NOT NULL,
    ClientID INT,
    FOREIGN KEY (ClientID) REFERENCES CLIENTTABLE(ClientID) ON DELETE CASCADE,
    PRIMARY KEY (PolicyNum, ClientID)
);


CREATE TABLE TICKETLOCTABLE(
    City VARCHAR(30) PRIMARY KEY,
    County VARCHAR(30) NOT NULL
);

CREATE TABLE TICKETTYPESTABLE(
    StatuteCode INT PRIMARY KEY,
    TicketType VARCHAR(15)
);

CREATE TABLE TICKETTABLE(
    TicketNum INT PRIMARY KEY,
    DateIssued Varchar(30) NOT NULL,
    Amount DECIMAL(12,2) NOT NULL,
    OfficerID INT NOT NULL,
    City VARCHAR(30),
    StatuteCode INT,
    FOREIGN KEY (OfficerID) REFERENCES OFFICERTABLE(OfficerID)  ON DELETE CASCADE,
    FOREIGN KEY (City) REFERENCES TICKETLOCTABLE(City) ON DELETE CASCADE,
    FOREIGN KEY (StatuteCode) REFERENCES TICKETTYPESTABLE(StatuteCode) ON DELETE CASCADE
);

CREATE TABLE ZONETABLE(
    SpeedingZone VARCHAR(30) PRIMARY KEY,
    SpeedLimit INT
);

CREATE TABLE SPEEDINGTABLE(
    TicketNum INT PRIMARY KEY,
    TicketType VARCHAR(15),
    SpeedingZone VARCHAR(30),
    FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum),
    FOREIGN KEY (SpeedingZone) REFERENCES ZONETABLE(SpeedingZone)
);

CREATE TABLE PARKINGTABLE(
    TicketNum INT PRIMARY KEY,
    ParkingZone VARCHAR(30),
    FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum)
);

CREATE TABLE TRAFFICLIGHTTABLE(
    TicketNum INT PRIMARY KEY,
    PhotoURL VARCHAR(50),
    FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum)
);

CREATE TABLE CASETABLE(
    CaseID INT PRIMARY KEY,
    DateFiled Varchar(30),
    HearingDate Varchar(30),
    CourtName VARCHAR(30),
    ProsecutorID INT,
    JudgeID INT,
    TicketNum INT NOT NULL,
    ClientID INT NOT NULL,
    Outcome VARCHAR(25),
    FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName) ON DELETE CASCADE,
    FOREIGN KEY (ProsecutorID) REFERENCES PROSECUTORTABLE(ProsecutorID) ON DELETE CASCADE,
    FOREIGN KEY (JudgeID) REFERENCES JUDGETABLE(JudgeID) ON DELETE CASCADE,
    FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum) ON DELETE CASCADE,
    FOREIGN KEY (ClientID) REFERENCES CLIENTTABLE(ClientID) ON DELETE CASCADE,
    UNIQUE(TicketNum)
);


-- Insert data into tables

INSERT INTO CLIENTTABLE (ClientID, PhoneNum, Name, Email, DateOfBirth)
VALUES (1, '6043219876', 'John Doe', 'johndoe@example.com', '1990-05-15');

INSERT INTO CLIENTTABLE (ClientID, PhoneNum, Name, Email, DateOfBirth)
VALUES    (2, '6045551234', 'Jane Smith', 'janesmith@example.com', '1985-09-20');

INSERT INTO CLIENTTABLE (ClientID, PhoneNum, Name, Email, DateOfBirth)
VALUES   (3, '6047894567', 'Michael Johnson', 'michaeljohnson@example.com',  '1982-07-10');

INSERT INTO CLIENTTABLE (ClientID, PhoneNum, Name, Email, DateOfBirth)
VALUES (4, '6042345678', 'Sarah Brown', 'sarahbrown@example.com',  '1995-02-28');

INSERT INTO CLIENTTABLE (ClientID, PhoneNum, Name, Email, DateOfBirth)
VALUES (5, '6048765432', 'David Wilson', 'davidwilson@example.com', '1988-11-03');

INSERT INTO INSURANCETABLE (PolicyNum, ExpiryDate, ClientID)
VALUES (201, '2024-09-04', 1);

INSERT INTO INSURANCETABLE (PolicyNum, ExpiryDate, ClientID)
VALUES  (202, '2027-03-29', 2);

INSERT INTO INSURANCETABLE (PolicyNum, ExpiryDate, ClientID)
VALUES (203, '2028-07-15', 3);

INSERT INTO INSURANCETABLE (PolicyNum, ExpiryDate, ClientID)
VALUES (204, '2025-10-12', 4);

INSERT INTO INSURANCETABLE (PolicyNum, ExpiryDate, ClientID)
VALUES (205, '2026-01-17', 5);

INSERT INTO OFFICERTABLE (OfficerID, Department, Name)
VALUES  (1, 'Traffic Control', 'Alice Jones');

INSERT INTO OFFICERTABLE (OfficerID, Department, Name)
VALUES (2, 'Highway Patrol', 'Benjamin Lee');

INSERT INTO OFFICERTABLE (OfficerID, Department, Name)
VALUES (3, 'Patrol', 'Olivia Martinez');

INSERT INTO OFFICERTABLE (OfficerID, Department, Name)
VALUES (4, 'Public Safety', 'Ethan Taylor');

INSERT INTO OFFICERTABLE (OfficerID, Department, Name)
VALUES (5, 'Traffic Control', 'Sophia Clark');

INSERT INTO TICKETLOCTABLE (City, County)
VALUES ('Seattle', 'King County');

INSERT INTO TICKETLOCTABLE (City, County)
VALUES ('Tacoma', 'Pierce County');

INSERT INTO TICKETLOCTABLE (City, County)
VALUES ('Bellingham', 'Whatcom County');

INSERT INTO TICKETLOCTABLE (City, County)
VALUES ('Vancouver', 'Clark County');

INSERT INTO TICKETLOCTABLE (City, County)
VALUES ('Spokane', 'Spokane County');

INSERT INTO TICKETTYPESTABLE (StatuteCode, TicketType)
VALUES (123, 'Speeding');

INSERT INTO TICKETTYPESTABLE (StatuteCode, TicketType)
VALUES (125, 'Speeding');

INSERT INTO TICKETTYPESTABLE (StatuteCode, TicketType)
VALUES (127, 'Parking');

INSERT INTO TICKETTYPESTABLE (StatuteCode, TicketType)
VALUES (128, 'Parking');

INSERT INTO TICKETTYPESTABLE (StatuteCode, TicketType)
VALUES (129, 'TrafficLight');

INSERT INTO ZONETABLE (SpeedingZone, SpeedLimit)
VALUES ('Highway', 90);

INSERT INTO ZONETABLE (SpeedingZone, SpeedLimit)
VALUES ('Residential', 40);

INSERT INTO ZONETABLE (SpeedingZone, SpeedLimit)
VALUES ('Construction Zone', 50);

INSERT INTO ZONETABLE (SpeedingZone, SpeedLimit)
VALUES ('School Zone', 30);

INSERT INTO ZONETABLE (SpeedingZone, SpeedLimit)
VALUES ('Highway, Crew Working', 70);

-- Correct TICKETTABLE data
INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (1, '2024-07-21', 150.00, 1, 'Seattle', 123);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (2, '2024-07-20', 100.00, 2, 'Seattle', 125);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (6, '2024-07-19', 200.00, 3, 'Tacoma', 127);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (7, '2024-07-18', 120.00, 4, 'Bellingham', 128);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (8, '2024-07-18', 120.00, 4, 'Bellingham', 128);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (9, '2024-07-18', 120.00, 4, 'Bellingham', 128);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (10, '2024-07-17', 180.00, 5, 'Vancouver', 129);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (11, '2024-07-17', 180.00, 5, 'Vancouver', 129);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (12, '2024-07-17', 180.00, 5, 'Vancouver', 129);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (13, '2024-07-17', 180.00, 5, 'Vancouver', 129);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (14, '2024-07-17', 180.00, 5, 'Vancouver', 129);

INSERT INTO TICKETTABLE (TicketNum, DateIssued, Amount, OfficerID, City, StatuteCode)
VALUES (15, '2024-07-17', 180.00, 5, 'Vancouver', 129);


INSERT INTO PARKINGTABLE (TicketNum, ParkingZone)
VALUES (6, 'Residents Only');

INSERT INTO PARKINGTABLE (TicketNum, ParkingZone)
VALUES (7, 'Disability');

INSERT INTO PARKINGTABLE (TicketNum, ParkingZone)
VALUES (8, 'Private Lot');

INSERT INTO PARKINGTABLE (TicketNum, ParkingZone)
VALUES (9, 'Passenger');

INSERT INTO PARKINGTABLE (TicketNum, ParkingZone)
VALUES (10, 'Metered');

INSERT INTO TRAFFICLIGHTTABLE (TicketNum, PhotoURL)
VALUES    (11, 'https://example.com/photo1.jpg');

INSERT INTO TRAFFICLIGHTTABLE (TicketNum, PhotoURL)
VALUES  (12, 'https://example.com/photo2.jpg');

INSERT INTO TRAFFICLIGHTTABLE (TicketNum, PhotoURL)
VALUES (13, 'https://example.com/photo3.jpg');

INSERT INTO TRAFFICLIGHTTABLE (TicketNum, PhotoURL)
VALUES (14, 'https://example.com/photo4.jpg');

INSERT INTO TRAFFICLIGHTTABLE (TicketNum, PhotoURL)
VALUES (15, 'https://example.com/photo5.jpg');

INSERT INTO COURTTABLE (CourtName, Location, Type)
VALUES ('King County Courthouse', 'Seattle', 'Civil');

INSERT INTO COURTTABLE (CourtName, Location, Type)
VALUES ('Joel W. Solomon Courthouse', 'Seattle', 'Civil');

INSERT INTO COURTTABLE (CourtName, Location, Type)
VALUES ('Frank R. Lautenberg Courthouse', 'Seattle', 'Civil');

INSERT INTO COURTTABLE (CourtName, Location, Type)
VALUES('Byron White Courthouse', 'Seattle', 'Civil');

INSERT INTO COURTTABLE (CourtName, Location, Type)
VALUES ('Richard C. Lee Courthouse', 'Seattle', 'Civil');

INSERT INTO JUDGETABLE (JudgeID, Name, CourtName)
VALUES (1, 'Greg Johnson', 'King County Courthouse');

INSERT INTO JUDGETABLE (JudgeID, Name, CourtName)
VALUES (2, 'Jordan Lopez', 'Joel W. Solomon Courthouse');

INSERT INTO JUDGETABLE (JudgeID, Name, CourtName)
VALUES (3, 'Bryan Smith', 'Frank R. Lautenberg Courthouse');

INSERT INTO JUDGETABLE (JudgeID, Name, CourtName)
VALUES (4, 'Jack Williams', 'Byron White Courthouse');

INSERT INTO JUDGETABLE (JudgeID, Name, CourtName)
VALUES (5, 'Nate Garcia', 'Richard C. Lee Courthouse');

INSERT INTO FIRMTABLE (FirmName, Clerk)
VALUES ('Taylor and Associates', 'Emma White');

INSERT INTO FIRMTABLE (FirmName, Clerk)
VALUES('Rodriguez Law Firm', 'Alexander Brown');

INSERT INTO FIRMTABLE (FirmName, Clerk)
VALUES ('Nguyen Legal Services', 'Isabella Garcia');

INSERT INTO FIRMTABLE (FirmName, Clerk)
VALUES ('Adams and Partners', 'Jacob Martinez');

INSERT INTO FIRMTABLE (FirmName, Clerk)
VALUES ('Harris Law Group', 'Sophie Thompson');

INSERT INTO PROSECUTORTABLE (ProsecutorID, Name, FirmName, CourtName)
VALUES (1, 'Mark Taylor', 'Taylor and Associates', 'King County Courthouse');


INSERT INTO PROSECUTORTABLE (ProsecutorID, Name, FirmName, CourtName)
VALUES (2, 'Lisa Rodriguez', 'Rodriguez Law Firm', 'Joel W. Solomon Courthouse');


INSERT INTO PROSECUTORTABLE (ProsecutorID, Name, FirmName, CourtName)
VALUES (3, 'Peter Nguyen', 'Nguyen Legal Services', 'Frank R. Lautenberg Courthouse');


INSERT INTO PROSECUTORTABLE (ProsecutorID, Name, FirmName, CourtName)
VALUES (4, 'Jennifer Adams', 'Adams and Partners', 'Byron White Courthouse');


INSERT INTO PROSECUTORTABLE (ProsecutorID, Name, FirmName, CourtName)
VALUES (5, 'Daniel Harris', 'Harris Law Group', 'Richard C. Lee Courthouse');

-- add more cases so that outcome aggregation makes sense
INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum, ClientID, Outcome)
VALUES (101, '2024-01-25', '2024-08-10', 'King County Courthouse', 1, 1, 1, 1, 'dismissed');

INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum, ClientID, Outcome)
VALUES (102, '2024-03-05', '2024-09-12', 'Joel W. Solomon Courthouse', 2, 2, 2, 2, 'reduced');

INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum, ClientID, Outcome)
VALUES (103, '2024-04-16', '2025-01-25', 'Frank R. Lautenberg Courthouse', 3, 3, 6, 3, 'dismissed');

INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum, ClientID, Outcome)
VALUES (104, '2024-05-18', '2024-12-03', 'Byron White Courthouse', 4, 4, 7, 4, 'deferred');

INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum, ClientID, Outcome)
VALUES (105, '2024-07-08', '2025-02-27', 'Richard C. Lee Courthouse', 5, 5, 11, 5, 'reduced');
