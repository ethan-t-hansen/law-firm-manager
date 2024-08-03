
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


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
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


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// ----------------------------------------------------------



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

async function fetchClientTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM CLIENTTABLE ORDER BY ClientID'
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

// OG insert demoTable fn
// async function insertDemoTable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

async function insertCaseTable(CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CASETABLE (CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum) 
            VALUES (:CaseID, :DateFiled, :HearingDate, :CourtName, :ProsecutorID, :JudgeID, :TicketNum)`,
            [CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertClientTable(ClientID, PhoneNum, Name, Email, DateOfBirth) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CLIENTTABLE(ClientID, PhoneNum, Name, Email, DateOfBirth) 
            VALUES (:ClientID, :PhoneNum, :Name, :Email, :DateOfBirth)`,
            [ClientID, PhoneNum, Name, Email, DateOfBirth],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


// OG update demoTable fn
// async function updateNameDemoTable(oldName, newName) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
//             [newName, oldName],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }


async function updateClientTable(key, clientAttribute, newValue) {
    
    return await withOracleDB(async (connection) => {

        let result = '';

        switch (clientAttribute) {
            case "PhoneNum":
                result = await connection.execute(
                    `UPDATE CLIENTTABLE 
                        SET PhoneNum = :newValue 
                        WHERE ClientID = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "Name":
                result = await connection.execute(
                    `UPDATE CLIENTTABLE 
                    SET Name = :newValue 
                    WHERE ClientID = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "Email":
                result = await connection.execute(
                    `UPDATE CLIENTTABLE 
                        SET Email = :newValue 
                        WHERE ClientID = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "DateOfBirth":
                result = await connection.execute(
                    `UPDATE CLIENTTABLE 
                        SET DateOfBirth = :newValue 
                        WHERE ClientID = :key`,
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

async function updateCaseTable(key, caseAttribute, newValue) {
    return await withOracleDB(async (connection) => {

        let result = '';

        switch (caseAttribute) {
            case "DateFiled":
                result = await connection.execute(
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
                result = await connection.execute(
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
                result = await connection.execute(
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
                return result.rowsAffected && result.rowsAffected > 0;
            case "JudgeID":
                result = await connection.execute(
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
            case "TicketNum":
                result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET TicketNum = :newValue 
                        WHERE CaseID  = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "ClientID":
                result = await connection.execute(
                    `UPDATE CASETABLE  
                        SET ClientID = :newValue 
                        WHERE CaseID  = :key`,
                    {
                        newValue: newValue,
                        key: key
                    },
                    { autoCommit: true }
                );
                return result.rowsAffected && result.rowsAffected > 0;
            case "Outcome":
                result = await connection.execute(
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
            WHERE CaseID = :caseID`,
            {CaseID: caseID } // Bind parameter
        );
        await connection.commit();
        return result.rowsAffected;
    }).catch((err) => {
        console.error(err);
        return 0;
    });
}

// TODO: *not sure about params
// TODO:                    async function select(table, textinput) 
// TODO:                    async function project(table, attributes)

async function joinClientTicket(clientID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM CASETABLE cs, CLIENTTABLE c WHERE cs.ClientID = c.ClientID AND c.CLIENTID = clientID'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// TODO aggregation:        async function countOutcomes(courtName) 
// TODO having aggregation: async function repeatcustomers(numtickets)
// TODO                     async function nestedaggregation(?)
// TODO                     async function division(?)


// async function countDemoTable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }

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

    insertClientTable,
    updateClientTable,
};