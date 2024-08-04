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
async function fetchAndDisplayEntities(data) {

    // console.log(data)

    const tableToFetch = document.getElementById('selectTableValue').value;

    const tableHeaders = document.getElementById('tableHeaders');

    const tableElement = document.getElementById('entityTable');
    const tableBody = tableElement.querySelector('tbody');

    let routeToFetch = '';
    let headerData = [];

    switch (tableToFetch) {
        case "Client":
            headerData = attributes.Client;
            routeToFetch = '/clienttable';
            break;
        case "Case":
            headerData = attributes.Case;
            routeToFetch = '/casetable';
            break;
        case "Ticket":
            headerData = attributes.Ticket;
            routeToFetch = '/tickettable';
            break;
        case "Insurance":
            headerData = attributes.Insurance;
            routeToFetch = '/instable';
            break;
        case "Officer":
            
            headerData = attributes.Officer;
            routeToFetch = '/officertable';

            break;
        case "TicketLocation":
            headerData = attributes.TicketLocation;
            routeToFetch = '/ticketloctable';
            break;
        case "TicketTypes":
            headerData = attributes.TicketTypes;
            routeToFetch = '/tickettypestable';
            break;
        case "Speeding":
            headerData = attributes.Speeding;
            routeToFetch = '/speedingtable';
            break;
        case "ZoneLimits":
            headerData = attributes.ZoneLimits;
            routeToFetch = '/zonelimitstable';
            break;
        case "Parking":
            headerData = attributes.Parking;
            routeToFetch = '/parkingtable';
            break;
        case "TrafficLight":
            headerData = attributes.TrafficLight;
            routeToFetch = '/trafficlighttable';
            break;
        case "Court":
            headerData = attributes.Court;
            routeToFetch = '/courttable';
            break;
        case "Judge":
            headerData = attributes.Judge;
            routeToFetch = '/judgetable';
            break;
        case "Prosecutor":
            headerData = attributes.Prosecutor;
            routeToFetch = '/prosecutortable';
            break;
        case "FirmEmployment":
            headerData = attributes.FirmEmployment;
            routeToFetch = '/firmtable';
            break;
        default:
            console.error("Invalid relation type");
    }

    // const dataString = data.join(', ');

    // routeToFetch = routeToFetch + `?attributes=${(dataString)}`

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

function fetchAttributes(event) {
        event.preventDefault();

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
    fetchAndDisplayEntities(null);
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    // fetchTableData();

    document.getElementById("selectTable").addEventListener('submit', submitForm);
    document.getElementById("selectTable").addEventListener('change', displayOptions);
    

    document.getElementById("tableOptions").addEventListener('change', fetchAttributes);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayClients();
}
