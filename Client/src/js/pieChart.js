function preprocessSectorData(data) {
    const sectorCounts = d3.rollup(
        data,
        (v) => v.length,
        (d) => d.sector
    );

    return Array.from(sectorCounts, ([sector, count]) => ({ sector, count }));
}
export function renderPieChart(data) {
    const processedData = preprocessSectorData(data);

    const width = 750;
    const height = 500;
    const radius = Math.min(width-50, height-50) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    d3.select("#pieChart").select("svg").remove();

    const svg = d3
        .select("#pieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const total = d3.sum(processedData.map((d) => d.count));
    svg.append("text")
        .attr("x", 20)
        .attr("y", -230)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Sector Distribution");

    const g = svg
        .selectAll(".arc")
        .data(pie(processedData))
        .enter()
        .append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", (d) => color(d.data.sector));

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px");

    g.on("mouseover", function (event, d) {
        d3.select(this).select("path").style("fill", "orange");

        const percentage = ((d.data.count / total) * 100).toFixed(2);

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
            .html(`Sector: ${d.data.sector}<br>Percentage: ${percentage}%`)
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 28 + "px");
    }).on("mouseout", function (event, d) {
        d3.select(this).select("path").style("fill", color(d.data.sector));

        tooltip.transition().duration(500).style("opacity", 0);
    });
}



// Function to preprocess data for the PESTLE pie chart
function preprocessPestleData(data) {
    const pestleCounts = d3.rollup(
        data,
        (v) => v.length,
        (d) => d.pestle
    );

    return Array.from(pestleCounts, ([pestle, count]) => ({ pestle, count }));
}
// Function to render the pie chart for PESTLE analysis
export function renderPestlePieChart(data) {
    const processedData = preprocessPestleData(data);

    const width = 750;
    const height = 500;
    const radius = Math.min(width - 50, height - 50) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    d3.select("#pestlePieChart").select("svg").remove();

    const svg = d3
        .select("#pestlePieChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const total = d3.sum(processedData.map((d) => d.count));

    svg.append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("PESTLE Distribution");

    const g = svg
        .selectAll(".arc")
        .data(pie(processedData))
        .enter()
        .append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", (d) => color(d.data.pestle));

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px");

    g.on("mouseover", function (event, d) {
        d3.select(this).select("path").style("fill", "orange");

        const percentage = ((d.data.count / total) * 100).toFixed(2);

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
            .html(`PESTLE: ${d.data.pestle}<br>Percentage: ${percentage}%`)
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 28 + "px");
    }).on("mouseout", function (event, d) {
        d3.select(this).select("path").style("fill", color(d.data.pestle));

        tooltip.transition().duration(500).style("opacity", 0);
    });
}
