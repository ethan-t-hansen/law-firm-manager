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

async function fetchAllTablesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM INSURANCETABLE',
            'SELECT * FROM CLIENTTABLE',
            'SELECT * FROM OFFICERTABLE',
            'SELECT * FROM TICKETTABLE',
            'SELECT * FROM TICKETLOCTABLE',
            'SELECT * FROM TICKETTYPESTABLE',
            'SELECT * FROM SPEEDINGTABLE',
            'SELECT * FROM ZONETABLE',
            'SELECT * FROM PARKINGTABLE',
            'SELECT * FROM TRAFFICLIGHTTABLE',
            'SELECT * FROM COURTTABLE',
            'SELECT * FROM JUDGETABLE',
            'SELECT * FROM PROSECUTORTABLE',
            'SELECT * FROM FIRMTABLE',
            'SELECT * FROM CASETABLE'
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// OG init demotable fn
// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

async function initSpeedingtable() {
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

async function initZonetable() {
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
async function initParkingtable() {
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
async function initTrafficLighttable() {
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
async function initCourttable() {
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
async function initJudgetable() {
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
async function initProsecutortable() {
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
async function initFirmEmploymenttable() {
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
async function initCasetable() {
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
                FOREIGN KEY (CourtName) REFERENCES COURTTABLE(CourtName)
                    ON UPDATE CASCADE,
                FOREIGN KEY (ProsecutorID) REFERENCES PROSECUTORTABLE(ProsecutorID)
                    ON UPDATE CASCADE,
                FOREIGN KEY (JudgeID) REFERENCES JUDGETABLE(JudgeID)
                    ON UPDATE CASCADE,
                FOREIGN KEY (TicketNum) REFERENCES TICKETTABLE(TicketNum)
                    ON UPDATE CASCADE,
                UNIQUE(TicketNum)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// OG insert demotable fn
// async function insertDemotable(id, name) {
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
async function insertSpeedingtable(TicketNum, TicketType, SpeedingZone) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO SPEEDINGTABLE (TicketNum, TicketType, SpeedingZone) 
            VALUES (:TicketNum, :TicketType, :SpeedingZone)`,
            [TicketNum, TicketType, SpeedingZone],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertZonetable(SpeedingZone, SpeedLimit) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ZONETABLE (SpeedingZone, SpeedLimit) 
            VALUES (:SpeedingZone, :SpeedLimit)`,
            [SpeedingZone, SpeedLimit],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertParkingtable(TicketNum, ParkingZone) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PARKINGTABLE (TicketNum, ParkingZone) 
            VALUES (:TicketNum, :ParkingZone)`,
            [TicketNum, ParkingZone],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertTrafficLighttable(TicketNum, PhotoURL) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO TRAFFICLIGHTTABLE (TicketNum, PhotoURL) 
            VALUES (:TicketNum, :PhotoURL)`,
            [TicketNum, PhotoURL],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertCourttable(CourtName, Location, Type) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO COURTTABLE (CourtName, Location, Type) 
            VALUES (:CourtName, :Location, :Type)`,
            [CourtName, Location, Type],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertJudgetable(JudgeID, Name, CourtName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO JUDGETABLE (JudgeID, Name, CourtName) 
            VALUES (:JudgeID, :Name, :CourtName)`,
            [JudgeID, Name, CourtName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertProsecutortable(ProsecutorID, Name, FirmName, CourtName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PROSECUTORTABLE (ProsecutorID, Name, FirmName, CourtName) 
            VALUES (:ProsecutorID, :Name, :FirmName, :CourtName)`,
            [ProsecutorID, Name, FirmName, CourtName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertFirmEmploymenttable(Name, Clerk) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO FIRMTABLE (Name, Clerk) 
            VALUES (:Name, :Clerk)`,
            [Name, Clerk],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertCasetable(CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID, TicketNum) {
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

// OG update demotable fn
// async function updateNameDemotable(oldName, newName) {
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

async function updateParkingtable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PARKIINGTABLE 
            SET attribute=:newValue 
            where TicketNum=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateTrafficLighttable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE TRAFFICLIGHTTABLE 
            SET attribute=:newValue 
            where TicketNum=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateCourttable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE COURTTTABLE 
            SET attribute=:newValue 
            where CourtName=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateJudgetable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE JUDGETABLE 
            SET attribute=:newValue 
            where JudgeID=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateProsecutortable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PROSECUTORTABLE 
            SET attribute=:newValue 
            where ProsecutorID=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateFirmtable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE FIRMTABLE 
            SET attribute=:newValue 
            where FirmName=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateCasetable(key, attribute, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE CASETABLE 
            SET attribute=:newValue 
            where CaseID=:key`,
            [key, attribute, newValue],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable
};