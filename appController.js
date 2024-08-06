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


{/* ------------------------------ FETCH DATA FUNCTIONS ------------------------------ */}


//Get all Insurance
router.get('/instable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchInsTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Clients
router.get('/clienttable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchClientTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Tickets
router.get('/tickettable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchTicketTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Officers
router.get('/officertable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchOfficerTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Ticket Locations
router.get('/ticketloctable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchTicketLocTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Ticket Types
router.get('/tickettypestable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchTicketTypesTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Speedings
router.get('/speedingtable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchSpeedingTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all zones
router.get('/zonetable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchZoneTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all parking tickets
router.get('/parkingtable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchParkingTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all traffic light tickets
router.get('/trafficlighttable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchTrafficLightTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Courts
router.get('/courttable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchCourtTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Judges
router.get('/judgetable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchJudgeTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Prosecutors
router.get('/prosecutortable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchProsecutorTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Firms
router.get('/firmtable', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchFirmTableFromDb(attributes);
    res.json({data: tableContent});
});

//Get all Cases
router.get('/casetable', async (req, res) => {
    const attributes = req.query.attributes;
    const filters = req.query.filters;
    const tableContent = await appService.fetchCasesTableFromDb(attributes, filters);
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

});

{/* ------------------------------ ADVANCED QUERIES ------------------------------ */}
router.get('/joinclientcase', async (req, res) => {
    const city = req.query.city;
    const tableContent = await appService.joinClientCase(city);
    res.json({data: tableContent});
});

router.get('/viewoutcomes', async (req, res) => {
    const tableContent = await appService.groupByOutcomes();
    res.json({data: tableContent});
});

router.get('/priceperstatute', async (req, res) => {
    const tableContent = await appService.pricePerStatute();
    res.json({data: tableContent});
});

router.get('/clientnumtickets', async (req, res) => {
    const numtickets = req.query.numtickets;
    const tableContent = await appService.getRepeatClients(numtickets);
    res.json({data: tableContent});
});

router.get('/allTicketsInCity', async (req, res) => {
    const city = req.query.city;
    const tableContent = await appService.getOfficerWithAllTicketsInCity(city);
    res.json({data: tableContent});
});

module.exports = router;