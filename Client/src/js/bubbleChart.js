// Function to preprocess data for the bubble chart
function preprocessCountryData(data) {
    const countryData = d3.rollup(
        data,
        (v) => ({
            intensity: d3.mean(v, (d) => d.intensity),
            likelihood: d3.mean(v, (d) => d.likelihood),
            relevance: d3.mean(v, (d) => d.relevance),
            region: v[0].region,
            count: v.length
        }),
        (d) => d.country
    );

    const total = d3.sum(Array.from(countryData.values()), d => d.intensity);

    return {
        data: Array.from(countryData, ([country, values]) => ({
            country,
            ...values
        })),
        total
    };
}

export function renderBubbleChart(data) {
    const { data: processedData, total } = preprocessCountryData(data);

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left+100},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(processedData, (d) => d.intensity)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([1.5, 4]) 
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const size = d3.scaleLinear()
        .domain([0, d3.max(processedData, (d) => d.relevance)])
        .range([5, 20]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Append x axis and label
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Intensity");

    // Append y axis and label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("dy", "1em") // Adjust dy to move the text away from axis
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Likelihood");

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisBottom(x)
            .tickSize(height)
            .tickFormat("")
            .tickSizeOuter(0) // Remove outer ticks
        )
        .selectAll("line")
        .style("opacity", 0.1); // Adjust opacity here

    // Add gridlines for y axis with reduced opacity
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
            .tickSizeOuter(0) // Remove outer ticks
        )
        .selectAll("line")
        .style("opacity", 0.1); 

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px");

    const node = svg.append("g")
        .selectAll("circle")
        .data(processedData)
        .enter()
        .append("g")
        .attr("class", "node");

    node.append("circle")
        .attr("cx", (d) => x(d.intensity))
        .attr("cy", (d) => y(d.likelihood))
        .attr("r", (d) => size(d.relevance))
        .attr("fill", (d) => color(d.region))
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", function (event, d) {
            d3.select(this).style("stroke-width", 3);

            const percentage = ((d.intensity / total) * 100).toFixed(2);

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`
                <strong>Country:</strong> ${d.country}<br>
                <strong>Intensity:</strong> ${d.intensity.toFixed(2)}<br>
                <strong>Likelihood:</strong> ${d.likelihood.toFixed(2)}<br>
                <strong>Relevance:</strong> ${d.relevance.toFixed(2)}<br>
                <strong>Region:</strong> ${d.region}<br>
                <strong>Percentage:</strong> ${percentage}%
            `)
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function (event, d) {
            d3.select(this).style("stroke-width", 1);

            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Adjust text positioning to be centered on each circle
    node.append("text")
        .attr("x", (d) => x(d.intensity))
        .attr("y", (d) => y(d.likelihood))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("pointer-events", "none")
        .text((d) => d.country);
}
