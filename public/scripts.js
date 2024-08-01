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
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

{/* ------------------------------ CLIENTS ------------------------------ */}

// Fetches data from the client table and displays it.
async function fetchAndDisplayClients() {
    const tableElement = document.getElementById('clienttable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/clienttable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the client table.
async function resetClients() {
    const response = await fetch("/initiate-clienttable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "client table initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

function formatDateForOracle(dateStr) {
    // Convert the date string (YYYY-MM-DD) to Oracle's expected format (DD-MON-YYYY)
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    const month = date.toLocaleString('en-us', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Inserts new records into the demotable.
async function insertClient(event) {
    event.preventDefault();

    // clientid, phonenum, name, email, dateofbirth

    const idValue = document.getElementById('insertClientId').value;
    const phoneValue = document.getElementById('insertClientPhone').value;
    const nameValue = document.getElementById('insertClientName').value;
    const emailValue = document.getElementById('insertClientEmail').value;
    const dobValue = document.getElementById('insertClientDOB').value;

    const response = await fetch('/insert-clienttable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clientid: idValue,
            phonenum: phoneValue,
            name: nameValue,
            email: emailValue,
            dateofbirth: formatDateForOracle(dobValue),
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data";
    }
}

// Updates attribute in the demotable.
async function updateClient(event) {
    event.preventDefault();

    const clientID = document.getElementById('updateClientID').value;
    const clientAttribute = document.getElementById('updateClientAttribute').value;
    const newValue = document.getElementById('updateClientValue').value;

    console.log(clientID)
    console.log(clientAttribute)
    console.log(newValue)


    const response = await fetch('/update-client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clientID: clientID,
            clientAttribute: clientAttribute,
            newValue: newValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateClientResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Client updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating ";
    }
}




{/* ------------------------------ [ENTITY NAME] ------------------------------ */}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in table: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetClients").addEventListener("click", resetClients);
    document.getElementById("insertClient").addEventListener("submit", insertClient);
    document.getElementById("updateClient").addEventListener("submit", updateClient);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayClients();
}
