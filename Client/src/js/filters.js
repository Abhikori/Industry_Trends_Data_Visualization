import { initializeTable } from './dataTable.js';
let filtersApplied = false;
const filters = {
    endYear: null,
    intensity: null,
    sector: null,
    topic: null,
    region: null,
    city: null,
    country: null,
    startYear: null,
    relevance: null,
    pestle: null,
    source: null,
    likelihood: null,
};

export function initializeFilters(data) {
    const uniqueValues = {
        endYear: [...new Set(data.map(item => item.end_year))].sort(),
        intensity: [...new Set(data.map(item => item.intensity))].sort((a, b) => a - b),
        sector: [...new Set(data.map(item => item.sector))].sort(),
        topic: [...new Set(data.map(item => item.topic))].sort(),
        region: [...new Set(data.map(item => item.region))].sort(),
        city: [...new Set(data.map(item => item.city))].sort(),
        country: [...new Set(data.map(item => item.country))].sort(),
        startYear: [...new Set(data.map(item => item.start_year))].sort(),
        relevance: [...new Set(data.map(item => item.relevance))].sort((a, b) => a - b),
        pestle: [...new Set(data.map(item => item.pestle))].sort(),
        source: [...new Set(data.map(item => item.source))].sort(),
        likelihood: [...new Set(data.map(item => item.likelihood))].sort((a, b) => a - b),
    };

    for (const [filter, values] of Object.entries(uniqueValues)) {
        const select = document.getElementById(`${filter}Filter`);
        if (!select) {
            console.error(`Element with ID ${filter}Filter not found.`);
            continue;
        }

        // Clear existing options
        select.innerHTML = '';

        // Add default blank option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Choose...';
        select.appendChild(defaultOption);

        // Add other options
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            select.appendChild(option);
        });
    }
}

export function applyFilters(data) {
    filters.endYear = document.getElementById('endYearFilter')?.value || '';
    filters.intensity = document.getElementById('intensityFilter')?.value || '';
    filters.sector = document.getElementById('sectorFilter')?.value || '';
    filters.topic = document.getElementById('topicFilter')?.value || '';
    filters.region = document.getElementById('regionFilter')?.value || '';
    filters.city = document.getElementById('cityFilter')?.value || '';
    filters.country = document.getElementById('countryFilter')?.value || '';
    filters.startYear = document.getElementById('startYearFilter')?.value || '';
    filters.relevance = document.getElementById('relevanceFilter')?.value || '';
    filters.pestle = document.getElementById('pestleFilter')?.value || '';
    filters.source = document.getElementById('sourceFilter')?.value || '';
    filters.likelihood = document.getElementById('likelihoodFilter')?.value || '';

    const anyFilterSelected = Object.values(filters).some(value => value !== '');

    if (!anyFilterSelected && filtersApplied) {
        alert('Please select at least one filter criteria.');
        return;
    }

    const filteredData = data.filter(item => {
        return (filters.endYear === '' || item.end_year == filters.endYear) &&
               (filters.intensity === '' || item.intensity == filters.intensity) &&
               (filters.sector === '' || item.sector === filters.sector) &&
               (filters.topic === '' || item.topic === filters.topic) &&
               (filters.region === '' || item.region === filters.region) &&
               (filters.city === '' || item.city === filters.city) &&
               (filters.country === '' || item.country === filters.country) &&
               (filters.startYear === '' || item.start_year == filters.startYear) &&
               (filters.relevance === '' || item.relevance == filters.relevance) &&
               (filters.pestle === '' || item.pestle === filters.pestle) &&
               (filters.source === '' || item.source === filters.source) &&
               (filters.likelihood === '' || item.likelihood == filters.likelihood);
    });
    filtersApplied = anyFilterSelected;
    initializeTable(filteredData);
}

export function resetFilters() {
    document.querySelectorAll('#filters select').forEach(select => {
        select.value = '';
    });

    applyFilters(window.tableData); // Apply filters again to reset the table
}
