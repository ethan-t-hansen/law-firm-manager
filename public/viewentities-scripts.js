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

const attributes = {
    Client: ["ClientID", "PhoneNum", "Name", "Email", "DateOfBirth"],
    Case: ["CaseID", "DateFiled", "HearingDate", "CourtName", "ProsecutorID", "JudgeID", "TicketNum", "ClientID", "Outcome"],
    Ticket: ["TicketNum", "DateIssued", "Amount", "OfficerID", "City", "StatuteCode"],
    Officer: ["OfficerID", "Department", "Name"],
    Insurance: ["PolicyNum", "ExpiryDate", "ClientID"],
    Court: ["Name", "Location", "Type"],
    Judge: ["JudgeID", "Name", "CourtName"],
    Prosecutor: ["ProsecutorID", "Name", "FirmName", "CourtName"],
    FirmEmployment: ["FirmName", "Clerk"],
    TicketLocation: ["City", "County"],
    TicketTypes: ["StatuteCode", "TicketType"],
    Speeding: ["TicketNumber", "Speed", "SpeedingZone"],
    ZoneLimits: ["SpeedingZone", "SpeedLimit"],
    Parking: ["TicketNum", "ParkingZone"],
    TrafficLight: ["TicketNum", "PhotoURL"],
}

// Fetches data from the client table and displays it.
async function fetchAndDisplayEntities(data) {

    console.log(data)

    const tableToFetch = document.getElementById('selectTableValue').value;

    const tableHeaders = document.getElementById('tableHeaders');

    const tableElement = document.getElementById('entityTable');
    const tableBody = tableElement.querySelector('tbody');

    let routeToFetch = '';
    // let headerData = [];

    switch (tableToFetch) {
        case "Insurance":
            routeToFetch = '/instable';
            break;
        case "Client":
            routeToFetch = '/clienttable';
            break;
        case "Case":
            routeToFetch = '/casetable';
            break;
        case "Ticket":
            routeToFetch = '/tickettable';
            break;
        case "Officer":
            routeToFetch = '/officertable';
            break;
        case "TicketLocation":
            routeToFetch = '/ticketloctable';
            break;
        case "TicketTypes":
            routeToFetch = '/tickettypestable';
            break;
        case "Speeding":
            routeToFetch = '/speedingtable';
            break;
        case "ZoneLimits":
            routeToFetch = '/zonetable';
            break;
        case "Parking":
            routeToFetch = '/parkingtable';
            break;
        case "TrafficLight":
            routeToFetch = '/trafficlighttable';
            break;
        case "Court":
            routeToFetch = '/courttable';
            break;
        case "Judge":
            routeToFetch = '/judgetable';
            break;
        case "Prosecutor":
            routeToFetch = '/prosecutortable';
            break;
        case "FirmEmployment":
            routeToFetch = '/firmtable';
            break;
        default:
            console.error("Invalid relation type");
    }

    const dataString = `${data.join(', ')}`;

    console.log(dataString);

    routeToFetch = routeToFetch + `?attributes=${dataString}`

    console.log(routeToFetch);

    const response = await fetch(routeToFetch, {
        method: 'GET'
    });

    const responseData = await response.json();
    const headerContent = responseData.data.metaData;
    const tableContent = responseData.data.rows;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if (tableHeaders) {
        tableHeaders.innerHTML = '';
    }

    headerContent.forEach((element, index) => {
        let headerCell = document.createElement("th")
        headerCell.textContent = element.name;
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

async function displayOptions() {

    const tableOptions = document.getElementById('tableOptions');
    const table = document.getElementById('selectTableValue').value;
    const selectionAttributes = attributes[table]

    if (tableOptions) {
        tableOptions.innerHTML = '';
    }

    selectionAttributes.forEach((element, index) => {
        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.name = 'options';
        checkbox.checked = true;
        checkbox.id = element;
        checkbox.value = element;
        let text = document.createElement("label")
        text.htmlFor = element
        text.textContent = element;
        tableOptions.appendChild(checkbox)
        tableOptions.appendChild(text)
    })

}

function fetchAttributes() {

        const formData = new FormData(document.getElementById("tableOptions"));
        const checkedValues = [];

        // Iterate over formData entries
        for (let [name, value] of formData.entries()) {
            if (name === 'options') {
                checkedValues.push(value);
            }
        }

        fetchAndDisplayEntities(checkedValues);
    
}

function submitForm(event) {
    event.preventDefault();
    fetchAttributes();
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    
    document.getElementById("selectTable").addEventListener('submit', submitForm);
    document.getElementById("selectTable").addEventListener('change', displayOptions);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayClients();
}
