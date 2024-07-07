import { renderBarChart, renderEndYearBarChart } from './barChart.js';
import { renderBubbleChart } from './bubbleChart.js';
import { renderPieChart, renderPestlePieChart } from './pieChart.js';
import { applyFilters, initializeFilters, resetFilters } from './filters.js';
import { initializeTable } from './dataTable.js';

document.addEventListener('DOMContentLoaded', function() {
    fetch('api.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderBarChart(data);
            renderEndYearBarChart(data);
            renderPieChart(data);
            renderPestlePieChart(data);
            renderBubbleChart(data);
            initializeTable(data);
            initializeFilters(data);

            // Event listener for Apply Filters button
            const applyFiltersBtn = document.getElementById('applyFiltersBtn');
            if (applyFiltersBtn) {
                applyFiltersBtn.addEventListener('click', () => {
                    applyFilters(data);
                });
            } else {
                console.error('Apply Filters button not found.');
            }

            // Event listener for Reset Filters button
            const resetFiltersBtn = document.getElementById('resetFiltersBtn');
            if (resetFiltersBtn) {
                resetFiltersBtn.addEventListener('click', () => {
                    resetFilters();
                    applyFilters(data); // Apply filters again to reset the table
                });
            } else {
                console.error('Reset Filters button not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle error scenario (e.g., display a message to the user)
        });
});
