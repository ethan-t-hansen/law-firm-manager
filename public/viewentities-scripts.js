/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'Connection timed out';  // Adjust error handling if required.
        });
}

{/* ------------------------------ ALL ENTITIES ------------------------------ */ }

const headers = {
    Client: ["Client ID", "Phone Number", "Name", "Email", "Date Of Birth"],
    Case: ["Case ID", "Date Filed", "Hearing Date", "Court Name", "Prosecutor ID", "Judge ID", "Ticket Num", "Client ID", "Outcome"],
    Ticket: ["Ticket Number", "Date Issued", "Amount", "Officer ID", "City", "Statute Code"],
    Officer: ["Officer ID", "Department", "Name"],
    Insurance: ["Policy Number", "Expiry Date", "Client ID"],
    Court: ["Name", "Location", "Type"],
    Judge: ["Judge ID", "Name", "Court Name"],
    Prosecutor: ["Prosecutor ID", "Name", "Firm Name", "Court Name"],
    FirmEmployment: ["Firm", "Clerk"],
    TicketLocation: ["City", "County"],
    TicketTypes: ["Statute Code", "Ticket Type"],
    Speeding: ["Ticket Number", "Speed", "Speeding Zone"],
    ZoneLimits: ["Speeding Zone", "Limit"],
    Parking: ["Ticket Number", "Parking Zone"],
    TrafficLight: ["Ticket Number", "Photo URL"],
}

// Fetches data from the client table and displays it.
async function fetchAndDisplayEntities() {

    const tableToFetch = document.getElementById('selectTableValue').value;

    const tableHeaders = document.getElementById('tableHeaders');

    const tableElement = document.getElementById('entityTable');
    const tableBody = tableElement.querySelector('tbody');

    let routeToFetch = '';
    let headerData = [];

    switch (tableToFetch) {
        case "Client":
            headerData = headers.Client;
            routeToFetch = '/clienttable';
            break;
        case "Case":
            headerData = headers.Case;
            routeToFetch = '/casetable';
            break;
        case "Ticket":
            headerData = headers.Ticket;
            routeToFetch = '/tickettable';
            break;
        case "Insurance":
            headerData = headers.Insurance;
            routeToFetch = '/instable';
            break;
        case "Officer":
            
            headerData = headers.Officer;
            routeToFetch = '/officertable';

            break;
        case "TicketLocation":
            headerData = headers.TicketLocation;
            routeToFetch = '/ticketloctable';
            break;
        case "TicketTypes":
            headerData = headers.TicketTypes;
            routeToFetch = '/tickettypestable';
            break;
        case "Speeding":
            headerData = headers.Speeding;
            routeToFetch = '/speedingtable';
            break;
        case "ZoneLimits":
            headerData = headers.ZoneLimits;
            routeToFetch = '/zonelimitstable';
            break;
        case "Parking":
            headerData = headers.Parking;
            routeToFetch = '/parkingtable';
            break;
        case "TrafficLight":
            headerData = headers.TrafficLight;
            routeToFetch = '/trafficlighttable';
            break;
        case "Court":
            headerData = headers.Court;
            routeToFetch = '/courttable';
            break;
        case "Judge":
            headerData = headers.Judge;
            routeToFetch = '/judgetable';
            break;
        case "Prosecutor":
            headerData = headers.Prosecutor;
            routeToFetch = '/prosecutortable';
            break;
        case "FirmEmployment":
            headerData = headers.FirmEmployment;
            routeToFetch = '/firmtable';
            break;
        default:
            console.error("Invalid relation type");
    }

    const response = await fetch(routeToFetch, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (tableHeaders) {
        tableHeaders.innerHTML = '';
    }

    headerData.forEach((element, index) => {
        let headerCell = document.createElement("th")
        headerCell.textContent = element;
        tableHeaders.appendChild(headerCell)
    }
    )

    tableContent.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

{/* ------------------------------ CLIENTS ------------------------------ */ }

// // Fetches data from the client table and displays it.
// async function fetchAndDisplayClients() {
//     const tableElement = document.getElementById('clienttable');
//     const tableBody = tableElement.querySelector('tbody');

//     const response = await fetch('/clienttable', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     console.log(responseData)
//     const demotableContent = responseData.data;

//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     demotableContent.forEach(user => {
//         const row = tableBody.insertRow();
//         user.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }

// // This function resets or initializes the client table.
// async function resetClients() {
//     const response = await fetch("/initiate-clienttable", {
//         method: 'POST'
//     });
//     const responseData = await response.json();

//     if (responseData.success) {
//         const messageElement = document.getElementById('resetResultMsg');
//         messageElement.textContent = "client table initiated successfully!";
//         fetchTableData();
//     } else {
//         alert("Error initiating table!");
//     }
// }

// // Inserts new records into the client table.
// async function insertClient(event) {
//     event.preventDefault();

//     // clientid, phonenum, name, email, dateofbirth

//     const idValue = document.getElementById('insertClientId').value;
//     const phoneValue = document.getElementById('insertClientPhone').value;
//     const nameValue = document.getElementById('insertClientName').value;
//     const emailValue = document.getElementById('insertClientEmail').value;
//     const dobValue = document.getElementById('insertClientDOB').value;

//     const response = await fetch('/insert-clienttable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             clientid: idValue,
//             phonenum: phoneValue,
//             name: nameValue,
//             email: emailValue,
//             dateofbirth: dobValue,
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('insertResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Data inserted successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error inserting data";
//     }
// }

// // Updates attribute in the client table.
// async function updateClient(event) {
//     event.preventDefault();

//     const clientID = document.getElementById('updateClientID').value;
//     const clientAttribute = document.getElementById('updateClientAttribute').value;
//     const newValue = document.getElementById('updateClientValue').value;

//     console.log(clientID)
//     console.log(clientAttribute)
//     console.log(newValue)


//     const response = await fetch('/update-client', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             clientID: clientID,
//             clientAttribute: clientAttribute,
//             newValue: newValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('updateClientResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Client updated successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error updating ";
//     }
// }

function submitForm(event) {
    event.preventDefault();
    fetchAndDisplayEntities();
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    // fetchTableData();

    document.getElementById("selectTable").addEventListener('submit', submitForm);
    // document.getElementById("resetClients").addEventListener("click", resetClients);
    // document.getElementById("insertClient").addEventListener("submit", insertClient);
    // document.getElementById("updateClient").addEventListener("submit", updateClient);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayClients();
}
