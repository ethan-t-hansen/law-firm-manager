const express = require('express');
const appService = require('./appService.js');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('Connected to Oracle');
    } else {
        res.send('Unable to connect to Oracle');
    }
});

// TODO: finish breaking apart fetch function so can create all tables
// router.get('/demotable', async (req, res) => {
//     const tableContent = await appService.fetchAllTablesFromDb();
//     res.json({data: tableContent});
// });

{/* ------------------------------ CLIENTS ------------------------------ */}


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


{/* ------------------------------ FETCH DATA FUNCTIONS ------------------------------ */}


//Get all Insurance
router.get('/instable', async (req, res) => {
    const tableContent = await appService.fetchInsTableFromDb();
    res.json({data: tableContent});
});

//Get all Clients
router.get('/clienttable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchClientTableFromDb(attributes);
    // console.log(tableContent);
    res.json({data: tableContent});
});

//Get all Tickets
router.get('/tickettable', async (req, res) => {
    const tableContent = await appService.fetchTicketTableFromDb();
    res.json({data: tableContent});
});

//Get all Officers
router.get('/officertable', async (req, res) => {
    const tableContent = await appService.fetchOfficerTableFromDb();
    res.json({data: tableContent});
});

//Get all Ticket Locations
router.get('/ticketloctable', async (req, res) => {
    const tableContent = await appService.fetchTicketLocTableFromDb();
    res.json({data: tableContent});
});

//Get all Ticket Types
router.get('/tickettypestable', async (req, res) => {
    const tableContent = await appService.fetchTicketTypesTableFromDb();
    res.json({data: tableContent});
});

//Get all Speedings
router.get('/speedingtable', async (req, res) => {
    const tableContent = await appService.fetchSpeedingTableFromDb();
    res.json({data: tableContent});
});

//Get all zones
router.get('/zonetable', async (req, res) => {
    const tableContent = await appService.fetchZoneTableFromDb();
    res.json({data: tableContent});
});

//Get all parking tickets
router.get('/parkingtable', async (req, res) => {
    const tableContent = await appService.fetchParkingTableFromDb();
    res.json({data: tableContent});
});

//Get all traffic light tickets
router.get('/trafficlighttable', async (req, res) => {
    const tableContent = await appService.fetchTrafficLightTableFromDb();
    res.json({data: tableContent});
});

//Get all Courts
router.get('/courttable', async (req, res) => {
    const tableContent = await appService.fetchCourtTableFromDb();
    res.json({data: tableContent});
});

//Get all Judges
router.get('/judgetable', async (req, res) => {
    const tableContent = await appService.fetchJudgeTableFromDb();
    res.json({data: tableContent});
});

//Get all Prosecutors
router.get('/prosecutortable', async (req, res) => {
    const tableContent = await appService.fetchProsecutorTableFromDb();
    res.json({data: tableContent});
});

//Get all Firms
router.get('/firmtable', async (req, res) => {
    const tableContent = await appService.fetchFirmTableFromDb();
    res.json({data: tableContent});
});

//Get all Cases
router.get('/casetable', async (req, res) => {
    const tableContent = await appService.fetchCasesTableFromDb();
    res.json({data: tableContent, success: true});
});

{/* ------------------------------ CASE ------------------------------ */}

router.post("/insert-casetable", async (req, res) => {
    const { caseid, datefiled, hearingdate, courtname, prosecutorid, judgeid, ticketnum, clientid, outcome } = req.body;
    if (!caseid || !ticketnum || !clientid) {
        return res.status(400).json({ success: false, message: "CaseID, ClientID, and TicketNum are required." });
    }
    const data = [caseid, datefiled, hearingdate, courtname, prosecutorid, judgeid, ticketnum, clientid, outcome]
    try {
        const insertResult = await appService.insertCaseTable(data);
        if (insertResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE Case
router.post("/update-case", async (req, res) => {
    
    const { caseID, caseAttribute, newValue } = req.body;

    if (!caseID) {
        return res.status(400).json({ success: false, message: "Case ID is required." });
    }

    try {
        const updateResult = await appService.updateCaseTable(caseID, caseAttribute, newValue);
        if (updateResult) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "No case found with the provided CaseID." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE Case
router.post("/delete-case", async (req, res) => {
    const { caseid } = req.body;

    console.log(caseid)
    
    try {
        const deleteResult = await appService.deleteCase(caseid);
        if (deleteResult) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "No case found with the provided CaseID." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

})

router.post("/join-client-ticket", async (req, res) => { 

    const city = req.body

    console.log("Joining where city is " + city)
});


module.exports = router;