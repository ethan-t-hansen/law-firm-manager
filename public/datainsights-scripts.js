
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



async function fetchAndDisplayData(responseData) {

    const tableHeaders = document.getElementById('tableHeaders');

    const tableElement = document.getElementById('dataTable');
    const tableBody = tableElement.querySelector('tbody');

    const tableContent = responseData.data.rows;
    const headerContent = responseData.data.metaData;

    // Always clear old, already fetched data before new fetching process.
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

    if (!tableBody) {
        tableBody.innerHTML = 'No data available.';
    }

}

async function getAvgPrice(e) {

    e.preventDefault();

    const response = await fetch('/priceperstatute', {
        method: 'GET'
    });

    const responseData = await response.json();
    fetchAndDisplayData(responseData);

    const messageElement = document.getElementById('avgPriceMsg');

    if (responseData.data) {
        messageElement.textContent = "Data retrieved successfully!";
    } else {
        messageElement.textContent = "Error retrieving data";
    }

}

async function getClientCase(e) {

    e.preventDefault();

    const city = document.getElementById('joinClientCaseCity').value;

    const response = await fetch(`/joinclientcase?city=${city}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    fetchAndDisplayData(responseData);

    const messageElement = document.getElementById('joinClientCaseMsg');

    if (responseData.data) {
        messageElement.textContent = "Data retrieved successfully!";
    } else {
        messageElement.textContent = "Error retrieving data";
    }

}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    document.getElementById("avgPrice").addEventListener("click", getAvgPrice);
    document.getElementById("joinClientCase").addEventListener("submit", getClientCase);
};

function fetchTableData() {
    fetchAndDisplayCases();
}

