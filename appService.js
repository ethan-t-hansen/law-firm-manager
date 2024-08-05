const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

// DB CONNECTION FUNCTIONS ----------------------------------------------------------


async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}



// FETCH FUNCTIONS --------------------------------------------------------------------------------

async function fetchInsTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM INSURANCETABLE ORDER BY ClientID',
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchClientTableFromDb(data) {
    console.log(data)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
             FROM CLIENTTABLE 
             ORDER BY ClientID`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTicketTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM TICKETTABLE ORDER BY TicketNum'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchOfficerTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM OFFICERTABLE ORDER BY OfficerID'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTicketLocTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM TICKETLOCTABLE ORDER BY City'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTicketTypesTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM TICKETTYPESTABLE ORDER BY StatuteCode'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchSpeedingTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM SPEEDINGTABLE ORDER BY TicketNum'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchZoneTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM ZONETABLE ORDER BY SpeedingZone'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchParkingTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM PARKINGTABLE ORDER BY TicketNum'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTrafficLightTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM TRAFFICLIGHTTABLE ORDER BY TicketNum'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCourtTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM COURTTABLE ORDER BY Location, Type'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchJudgeTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM JUDGETABLE ORDER BY JudgeID'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchProsecutorTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM PROSECUTORTABLE ORDER BY FirmName, ProsecutorID'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchFirmTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM FIRMTABLE ORDER BY FirmName, Clerk'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCasesTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM CASETABLE ORDER BY CaseID'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}





// CASE FUNCTIONS --------------------------------------------------------------------------------

async function insertCaseTable(data) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum, ClientID, Outcome)
            VALUES (:CaseID, :DateFiled, :HearingDate, :CourtName, :ProsecutorID, :JudgeID, :TicketNum, :ClientID, :Outcome)`,
            [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateCaseTable(key, caseAttribute, newValue) {
    return await withOracleDB(async (connection) => {

        switch (caseAttribute) {
            case "DateFiled":
                var result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET DateFiled = :newValue 
                        WHERE CaseID  = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "HearingDate":
                var result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET HearingDate = :newValue  
                        WHERE CaseID = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "CourtName":
                var result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET CourtName = :newValue 
                        WHERE CaseID = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "ProsecutorID":
                result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET ProsecutorID = :newValue 
                        WHERE CaseID = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                break;
            case "JudgeID":
                var result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET JudgeID = :newValue 
                        WHERE CaseID  = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "Outcome":
                var result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET Outcome = :newValue 
                        WHERE CaseID  = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
        }

    }).catch(() => {
        return false;
    });
}

async function deleteCase(caseID) {

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM CASETABLE
            WHERE CaseID = :value`,
            [Number(caseID)],
            { autoCommit: true }
        );
        await connection.commit();
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error(err);
        return 0;
    });
}

// TODO: *not sure about params
// TODO:                    async function select(table, textinput) 
// TODO:                    async function project(table, attributes)





// COMPLEX QUERY FUNCTIONS --------------------------------------------------------------------------------

async function joinClientCase(city) {
    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `SELECT cs.CaseID, cs.DateFiled, cs.HearingDate, cs.CourtName, cs.Outcome, c.ClientID, c.Name, c.Email, c.PhoneNum, t.TicketNum, t.City
             FROM CASETABLE cs, CLIENTTABLE c, TICKETTABLE t
             WHERE cs.ClientID = c.ClientID AND t.ticketnum = cs.ticketnum AND t.city = :city`,
            { city: city }
        );
        return result;
    }).catch(() => {
        return [];
    });
}

// aggregation
// group by outcomes. on webpage seen as a dropdown or checkbox
async function groupByOutcomes() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT Outcome, COUNT(Outcome) AS TotalTimes
            FROM CASETABLE
            GROUP BY Outcome`
        );
        return result;
    }).catch(() => {
        return false;
    });
}

// aggregation
// shows a table of clients that have a certain number of tickets, specified by user input
async function getRepeatClients(numtickets) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT Name, COUNT(TicketNum) AS NumberOfTickets
            FROM CLIENTTABLE cl, CASETABLE ca
            WHERE cl.ClientID = ca.ClientID
            GROUP BY cl.Name
            HAVING COUNT(TicketNum) > :numtickets`,
            [numtickets]
        );

        return result;
    }).catch(() => {
        return false;
    });
}

// nested aggregation 
// show average price of ticket for each statutecode group with at least one ticket in it
async function pricePerStatute() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT StatuteCode, AVG(Amount) as AverageFee FROM TICKETTABLE t1
            GROUP BY StatuteCode
            HAVING 1 < (SELECT COUNT(*)  FROM TICKETTABLE t2
            WHERE t1.StatuteCode = t2.StatuteCode) `
        );

        return result;
        // return result.rows;
    }).catch(() => {
        return [];
    });
}

// division aggregation
// find officer that gave all tickets in user-specified location
async function getOfficerWithAllTicketsInCity(city) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT o.Name as OfficerName, t.City, COUNT(t.TicketNum) as TicketsGiven
            FROM OFFICERTABLE o
            JOIN TICKETTABLE t ON o.OfficerID=t.OfficerID
            WHERE t.City = :cityone
            GROUP BY o.Name, t.City
            HAVING COUNT(DISTINCT t.TicketNum) = (
            	SELECT COUNT(*) 
            	FROM TICKETTABLE
            	WHERE City = :citytwo)`,
            [city, city]
        );
        return result;
    }).catch(() => {
        return false;
    });
}

module.exports = {

    testOracleConnection,

    fetchInsTableFromDb,
    fetchClientTableFromDb,
    fetchTicketTableFromDb,
    fetchOfficerTableFromDb,
    fetchTicketLocTableFromDb,
    fetchTicketTypesTableFromDb,
    fetchSpeedingTableFromDb,
    fetchZoneTableFromDb,
    fetchParkingTableFromDb,
    fetchTrafficLightTableFromDb,
    fetchCourtTableFromDb,
    fetchJudgeTableFromDb,
    fetchProsecutorTableFromDb,
    fetchFirmTableFromDb,
    fetchCasesTableFromDb,

    insertCaseTable,
    updateCaseTable,
    deleteCase,

    joinClientCase,
    groupByOutcomes,
    getRepeatClients,
    pricePerStatute,
    getOfficerWithAllTicketsInCity,
};