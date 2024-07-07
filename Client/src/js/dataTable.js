const rowsPerPage = 10;
let currentPage = 1;
let tableData = [];
function getValueOrNil(value) {
    if (value === null || value === undefined || value === '') {
        return 'nil';
    }
    return value;
}
export function initializeTable(data) {
    tableData = data;
    renderTable();
    setupPagination();
}

function renderTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = tableData.slice(startIndex, endIndex);

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>${getValueOrNil(item.end_year)}</td>
            <td>${getValueOrNil(item.intensity)}</td>
            <td>${getValueOrNil(item.sector)}</td>
            <td>${getValueOrNil(item.topic)}</td>
            <td>${getValueOrNil(item.insight)}</td>
            <td>${getValueOrNil(item.region)}</td>
            <td>${getValueOrNil(item.start_year)}</td>
            <td>${getValueOrNil(item.relevance)}</td>
            <td>${getValueOrNil(item.pestle)}</td>
            <td>${getValueOrNil(item.source)}</td>
            <td>${getValueOrNil(item.likelihood)}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePageInfo();
}

function setupPagination() {
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage * rowsPerPage < tableData.length) {
            currentPage++;
            renderTable();
        }
    });
}

function updatePageInfo() {
    const pageInfo = document.getElementById('pageInfo');
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}
