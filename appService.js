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

async function initInsTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE INSURANCETABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        const result = await connection.execute(
            `CREATE TABLE INSURANCETABLE(
            PolicyNum INT,
	        ExpiryDate DATE NOT NULL,
	        ClientID INT,
	        FOREIGN KEY (ClientID) REFERENCES Client(ClientID)
		    ON UPDATE CASCADE,
	        PRIMARY KEY (PolicyNum, ClientID)
            )`
        );
        return true;
    }).catch(() => {
        return false;
    });
}


async function initClientTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CLIENTTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        const result = await connection.execute(
            `CREATE TABLE CLIENTTABLE(
            ClientID INT PRIMARY KEY,
	        PhoneNum CHAR(10) NOT NULL,
	        Name VARCHAR(30) NOT NULL,
	        Email VARCHAR(30) NOT NULL,
	        DateOfBirth DATE,
            UNIQUE(Email))`
        );
        return true;
    }).catch(() => {
        return false;
    });
}
async function initOfficerTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE OFFICERTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        const result = await connection.execute(
            `CREATE TABLE OFFICERTABLE(
	        OfficerID INT PRIMARY KEY,
	        Department VARCHAR(30) NOT NULL,
	        Name VARCHAR(30) NOT NULL
            )`
        );
        return true;
    }).catch(() => {
        return false;
    });
}

async function initTicketTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE TICKETTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }
        const result = await connection.execute(
            `CREATE TABLE TICKETTABLE(
	        	TicketNum INT PRIMARY KEY,
	            DateIssued DATE NOT NULL,
	            Amount DECIMAL(12,2) NOT NULL,
	            OfficerID INT NOT NULL,
	            CaseID INT,
	            City VARCHAR(30),
	            StatuteCode INT,
	            FOREIGN KEY (OfficerID) REFERENCES Officer(OfficerID)
		        ON UPDATE CASCADE,
                FOREIGN KEY (CaseID) REFERENCES Case(CaseID)
		        ON UPDATE CASCADE,
                FOREIGN KEY (City) REFERENCES TicketLocation(City)
		        ON UPDATE CASCADE,
                FOREIGN KEY (StatuteCode) REFERENCES TicketTypes(StatuteCode)
		        ON UPDATE CASCADE)
                )`
        );
        return true;
    }).catch(() => {
        return false;
    });
}


async function initTicketLocTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE TICKETLOCTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE TICKETLOCTABLE(
               City VARCHAR(30) PRIMARY KEY,
              County VARCHAR(30) NOT NULL
            )`
        );
        return true;
    }).catch(() => {
        return false;
    });
}

async function initTicketTypesTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE TICKETTYPESTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE TICKETTYPESTABLE(
            StatuteCode INT PRIMARY KEY,
            TicketType VARCHAR(10)
            )`
        );
        return true;
    }).catch(() => {
        return false;
    });
}


async function initSpeedingTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE SPEEDINGTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE SPEEDINGTABLE(
                TicketNum INT PRIMARY KEY,
                TicketType VARCHAR(10),
                SpeedingZone VARCHAR(30),
                FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum),
                FOREIGN KEY (SpeedingZone) REFERENCES ZONETABLE(SpeedingZone)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initZoneTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE ZONETABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE ZONETABLE(
                SpeedingZone VARCHAR(30) PRIMARY KEY,
                SpeedLimit INT
            )   
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initParkingTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PARKINGTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE PARKINGTABLE (
                TicketNum INT PRIMARY KEY,
                ParkingZone VARCHAR(30),
                FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum),

            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initTrafficLightTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE TRAFFICLIGHTTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE TRAFFICLIGHTTABLE (
                TicketNum INT PRIMARY KEY,
                PhotoURL VARCHAR(50),
                FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum),
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initCourtTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE COURTTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE COURTTABLE (
                CourtName VARCHAR(30) PRIMARY KEY,
                Location VARCHAR(30) NOT NULL,
                Type VARCHAR(30)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initJudgeTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE JUDGETABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE JUDGETABLE (
                JudgeID INT PRIMARY KEY,
                Name VARCHAR(30),
                CourtName VARCHAR(30),
                FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initProsecutorTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PROSECUTORTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE PROSECUTORTABLE (
                ProsecutorID INT PRIMARY KEY,
                Name VARCHAR(30),
                CourtName VARCHAR(30),
                FirmName VARCHAR(30),
                FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName),
                FOREIGN KEY (FirmName) REFERENCES FIRMTABLE(FirmName)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initFirmEmploymentTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE FIRMTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE FIRMTABLE (
                FirmName VARCHAR(30) PRIMARY KEY,
                Clerk VARCHAR(30)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
async function initCaseTable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CASETABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE CASETABLE (
                CaseID INT PRIMARY KEY,
                DateFiled DATE,
                HearingDate DATE,
                CourtName VARCHAR(30),
                ProsecutorID INT,
                JudgeID INT,
                TicketNum INT NOT NULL,
                ClientID INT NOT NULL,
                Outcome VARCHAR(25),
                FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName)
                    ON UPDATE CASCADE,
                FOREIGN KEY (ProsecutorID) REFERENCES PROSECUTORTABLE(ProsecutorID)
                    ON UPDATE CASCADE,
                FOREIGN KEY (JudgeID) REFERENCES JUDGETABLE(JudgeID)
                    ON UPDATE CASCADE,
                FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum)
                    ON UPDATE CASCADE,
                FOREIGN KEY (ClientID) REFERENCES CLIENTTABLE(ClientID)
                    ON UPDATE CASCADE,
                UNIQUE(TicketNum)
            )
        `);
        return true;
    }).catch(() => {
        return false;
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
        const result = await connection.execute(
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
    }).catch(() => {
        return false;
    });
}

async function updateCaseTable(caseID, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        // Construct the SQL query dynamically
        const query = `UPDATE CASETABLE SET ${attribute} = :newValue WHERE CaseID = :caseID`;

        // Execute the query with the provided values
        const result = await connection.execute(
            query,
            { newValue, caseID },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function deleteCase(caseID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            DELETE FROM CASETABLE
            WHERE CaseID = :caseID
        `, [recipeID]);
        await connection.commit();
        return result.rowsAffected;
    }).catch((err) => {
        console.error(err);
        return 0;
    });
}

async function countDemoTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,

    // fetchInsTableFromDb,
    fetchClientTableFromDb,
    // fetchAllTablesFromDb,

    initInsTable,
    initClientTable,
    initOfficerTable,
    initTicketTable,
    initTicketLocTable,
    initTicketTypesTable,
    initSpeedingTable,
    initZoneTable,
    initParkingTable,
    initTrafficLightTable,
    initCourtTable,
    initJudgeTable,
    initProsecutorTable,
    initFirmEmploymentTable,
    initCaseTable,
    
    
    insertClientTable,
    insertCaseTable,

 
    updateClientTable,
    updateCaseTable,

    // countDemoTable,

    deleteCase
};