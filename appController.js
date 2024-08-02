const express = require('express');
const appService = require('./appService.js');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// TODO: finish breaking apart fetch function so can create all tables
// router.get('/demotable', async (req, res) => {
//     const tableContent = await appService.fetchAllTablesFromDb();
//     res.json({data: tableContent});
// });

{/* ------------------------------ CLIENTS ------------------------------ */}

//Initiate client table
router.post("/initiate-clienttable", async (req, res) => {
    const initiateResult = await appService.initClientTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//Get all Clients
router.get('/clienttable', async (req, res) => {
    const tableContent = await appService.fetchClientTableFromDb();
    // console.log(tableContent);
    res.json({data: tableContent});
});

// Insert Client Table
router.post("/insert-clienttable", async (req, res) => {
    const { clientid, phonenum, name, email, dateofbirth } = req.body;
    const date = dateofbirth ? dateofbirth : null;
    const insertResult = await appService.insertClientTable(clientid, phonenum, name, email, date);

    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Update Client Table
router.post("/update-client", async (req, res) => {

    const { clientID, clientAttribute, newValue } = req.body;

    if (!clientID) {
        return res.status(400).json({ success: false, message: "Client ID is required." });
    }

    try {

        const updateResult = await appService.updateClientTable(parseInt(clientID), clientAttribute, newValue)
        if (updateResult) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "No client found for client ID: " + clientID});
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


{/* ------------------------------ [ENTITY NAME] ------------------------------ */}


//Get all Insurance
router.get('/instable', async (req, res) => {
    const tableContent = await appService.fetchInsTableFromDb();
    res.json({data: tableContent});
});

//Get all Tickets
router.get('/tickettable', async (req, res) => {
    const tableContent = await appService.fetchTicketTableFromDb();
    res.json({data: tableContent});
});

//Get all Cases
router.get('/casetable', async (req, res) => {
    const tableContent = await appService.fetchCasesTableFromDb();
    res.json({data: tableContent});
});





{/* ------------------------------ CASE ------------------------------ */}

//Init case table
router.post("/initiate-casetable", async (req, res) => {
    const initiateResult = await appService.initCasetable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// router.post("/insert-demotable", async (req, res) => {
//     const { id, name } = req.body;
//     const insertResult = await appService.insertDemotable(id, name);
//     if (insertResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });


// CREATE a new case
// TODO: check how insert only some attributes
// router.post("/insert-casetable", async (req, res) => {
//     const {CaseID, CourtName, TicketNum} = req.body;
//     const insertResult = await appService.insertDemotable(CaseID,  CourtName, TicketNum);
//     if (insertResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

router.post("/insert-casetable", async (req, res) => {
    const { CaseID, CourtName, TicketNum } = req.body;
    if (!CaseID || !CourtName || !TicketNum) {
        return res.status(400).json({ success: false, message: "CaseID, CourtName, and TicketNum are required." });
    }
    const insertData = {
        CaseID,
        CourtName,
        TicketNum
    };
    try {
        const insertResult = await appService.insertDemotable(insertData);
        if (insertResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// router.post("/update-name-demotable", async (req, res) => {
//     const { oldName, newName } = req.body;
//     const updateResult = await appService.updateNameDemotable(oldName, newName);
//     if (updateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// UPDATE Case
router.post("/update-case", async (req, res) => {
    const { CaseID, DateFiled, HearingDate, CourtName, ProsecutorID, JudgeID } = req.body;

    if (!CaseID) {
        return res.status(400).json({ success: false, message: "CaseID is required." });
    }

    const updateData = {};
    if (DateFiled) updateData.DateFiled = DateFiled;
    if (HearingDate) updateData.HearingDate = HearingDate;
    if (CourtName) updateData.CourtName = CourtName;
    if (ProsecutorID) updateData.ProsecutorID = ProsecutorID;
    if (JudgeID) updateData.JudgeID = JudgeID;

    try {
        const updateResult = await appService.updateCase(CaseID, updateData);
        if (updateResult.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "No case found with the provided CaseID." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});




// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });


module.exports = router;