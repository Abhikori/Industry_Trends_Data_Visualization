// Function to preprocess data
function preprocessData(data) {
    let totalIntensity = 0, totalLikelihood = 0, totalRelevance = 0;
    let intensityCount = 0, likelihoodCount = 0, relevanceCount = 0;

    data.forEach(d => {
        if (d.intensity) {
            totalIntensity += d.intensity;
            intensityCount++;
        }
        if (d.likelihood) {
            totalLikelihood += d.likelihood;
            likelihoodCount++;
        }
        if (d.relevance) {
            totalRelevance += d.relevance;
            relevanceCount++;
        }
    });

    const avgIntensity = intensityCount ? totalIntensity / intensityCount : 0;
    const avgLikelihood = likelihoodCount ? totalLikelihood / likelihoodCount : 0;
    const avgRelevance = relevanceCount ? totalRelevance / relevanceCount : 0;

    return [
        { category: "Intensity", value: avgIntensity },
        { category: "Likelihood", value: avgLikelihood },
        { category: "Relevance", value: avgRelevance }
    ];
}

// Function to render the bar chart
export function renderBarChart(data) {
    const processedData = preprocessData(data);
    const margin = { top: 40, right: 20, bottom: 100, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(processedData.map(d => d.category))
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(10);

    d3.select("#barChart").select("svg").remove();

    

    const svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top-65)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Average Intensity, Likelihood, and Relevance");

    x.domain(processedData.map(d => d.category));
    y.domain([0, d3.max(processedData, d => d.value)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", "-.100em")
        .attr("transform", "rotate(0)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", -20)
        .attr("x", 20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    svg.selectAll(".bar")
        .data(processedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.category))
        .on('mouseover', function (event, d) {
            d3.select(this)
                .style("fill", "orange");

            svg.append("text")
                .attr("class", "tooltip")
                .attr("x", parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 2)
                .attr("y", parseFloat(d3.select(this).attr("y")) - 10)
                .attr("text-anchor", "middle")
                .text(`${d.category}: ${d.value.toFixed(2)}`);
        })
        .on('mouseout', function (event, d) {
            
            d3.select(this)
                .style("fill", color(`${d.category}`));
            svg.select(".tooltip").remove();
        });
}



function preprocessEndYearData(data) {
    const endYearCounts = d3.rollup(
        data,
        v => v.length,
        d => d.end_year
    );

    return Array.from(endYearCounts, ([end_year, count]) => ({ end_year, count }))
                .sort((a, b) => b.count - a.count);
}
export function renderEndYearBarChart(data) {
    const processedData = preprocessEndYearData(data);
    
    const margin = { top: 40, right: 20, bottom: 100, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10) // Use a color scale from D3
        .domain(processedData.map(d => d.end_year));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(10);

    d3.select("#endYearBarChart").select("svg").remove();

    const svg = d3.select("#endYearBarChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top - 65)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Count by End Year");

    x.domain(processedData.map(d => d.end_year));
    y.domain([0, d3.max(processedData, d => d.count)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", "-.100em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", -20)
        .attr("x", 20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

    svg.selectAll(".bar")
        .data(processedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.end_year))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count))
        .attr("fill", d => color(d.end_year)) // Assign different colors to each bar
        .on('mouseover', function (event, d) {
            d3.select(this)
                .style("fill", "orange");

            svg.append("text")
                .attr("class", "tooltip")
                .attr("x", parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 2)
                .attr("y", parseFloat(d3.select(this).attr("y")) - 10)
                .attr("text-anchor", "middle")
                .text(`${d.end_year}: ${d.count}`);
        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .style("fill", color(d.end_year)); // Reassign the original color on mouseout
            svg.select(".tooltip").remove();
        });
}
