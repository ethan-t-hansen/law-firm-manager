
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
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

{/* ------------------------------ ALL ENTITIES ------------------------------ */ }

// Fetches data from the client table and displays it.
async function fetchAndDisplayCases(filters) {

    const tableHeaders = document.getElementById('tableHeaders');

    const tableElement = document.getElementById('entityTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/casetable?attributes=*&filters=${filters}`, {
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

    const messageElement = document.getElementById('refetchResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data retrieved successfully!";
    } else {
        messageElement.textContent = "Error retrieving data";
    }
}

// Selects based on filters
async function filterCase(event) {
    event.preventDefault();

    var filterString = document.getElementById('userInput').value;

    var messageElement = document.getElementById('filterResultMsg');

    if (filterString.includes("AND") || filterString.includes("OR") || filterString.includes(" = ")) {
        
        messageElement.textContent = "Error: Do not include SQL code in filter.";
        return;
    }

    messageElement.textContent = "";

    // Convert to SQL string
    var filters = filterString.replace(/==/g, '=')
        .replace(/&&/g, 'AND')
        .replace(/\|\|/g, 'OR');

    fetchAndDisplayCases(filters);
}

// Inserts new records into the case table.
async function insertCase(event) {
    event.preventDefault();

    const caseid = document.getElementById('insertCaseID').value;
    const datefiled = document.getElementById('insertDateFiled').value;
    const hearingdate = document.getElementById('insertHearingDate').value;
    const courtname = document.getElementById('insertCourtName').value;
    const prosecutorid = document.getElementById('insertProsecutorID').value;
    const judgeid = document.getElementById('insertJudgeID').value;
    const ticketnum = document.getElementById('insertTicketNum').value;
    const clientid = document.getElementById('insertClientID').value;
    const outcome = document.getElementById('insertOutcome').value;

    const response = await fetch('/insert-casetable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caseid: caseid,
            datefiled: datefiled,
            hearingdate: hearingdate,
            courtname: courtname,
            prosecutorid: prosecutorid,
            judgeid: judgeid,
            ticketnum: ticketnum,
            clientid: clientid,
            outcome: outcome
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting case";
    }
}

// // Updates attribute in the case table.
async function updateCase(event) {
    event.preventDefault();

    const caseID = document.getElementById('updateCaseID').value;
    const caseAttribute = document.getElementById('updateCaseAttribute').value;
    const newValue = document.getElementById('updateCaseValue').value;

    const response = await fetch('/update-case', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caseID: caseID,
            caseAttribute: caseAttribute,
            newValue: newValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateCaseResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Case updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating case " + response.message;
    }
}

// Removes case from DB
async function deleteCase(event) {

    event.preventDefault();

    const caseid = document.getElementById('deleteCaseID').value;

    // console.log(caseid)

    const response = await fetch('/delete-case', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caseid: caseid
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Case deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting case: ";
    }

}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData()
    document.getElementById("refetchCases").addEventListener("click", fetchTableData);
    document.getElementById("insertCase").addEventListener("submit", insertCase);
    document.getElementById("deleteCase").addEventListener("submit", deleteCase)
    document.getElementById("updateCase").addEventListener("submit", updateCase);
    document.getElementById("filterTable").addEventListener("submit", filterCase);
};

function fetchTableData() {
    fetchAndDisplayCases('');
}

