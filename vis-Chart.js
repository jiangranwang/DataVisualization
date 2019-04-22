/**
 * The space to be taken from the bottom or from the top
 */
const marginSpace = height / 4;

/**
 * Radius of each dot.
 */
const dotRadius = 1;

/**
 * a helper function to put basic elements on the chartSVG.
 * @param {svg} svg the main canvas to append basic elements
 * @param {Array} data the array of data that we would like to visualise
 */
var initialiseChart = function(svg, data) {
    var yearScale = d3.scaleLinear()
                    .domain([allYear[0], allYear[allYear.length - 1]])
                    .range([0, chartSVGWidth]);
    var xAxis = d3.axisBottom()
                    .scale(yearScale);

    var totalStudentScale = d3.scaleLog()
                    .base(10)
                    .domain([1, biggestIncomingStudent])
                    .range([chartSVGHeight, 0]);

    var colourScale = studentColourScale;

    // TODO: change the tick of the y Axis
    var yAxis = d3.axisLeft().scale(totalStudentScale);
                    //.ticks([1, 10, 100, 500, 10000, 30000]);

    svg.append("g")
        .attr("transform", "translate(0" + "," + chartSVGHeight + ")")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);

    allStateName.forEach(stateName => {
        svg.append("g").attr("id", stateName).style("Visibility", "hidden");
    })

    for (let i = 0; i < data.length; i++) {
        d3.select("#" + data[i]["State"])
            .append("circle")
                .attr("cx", yearScale(data[i]["Year"]))
                .attr("cy", totalStudentScale(data[i]["Total"]))
                .attr("r", dotRadius)
                .attr("fill", "white")
                .attr("stroke", colourScale(data[i]["Total"]))
                .attr("id", data[i]["Year"] + " " + data[i]["State"]);
        if (i < data.length - 1 && data[i]["State"] == data[i + 1]["State"]) {
            d3.select("#" + data[i]["State"])
                .append("line")
                .attr("x1", yearScale(data[i]["Year"]))
                .attr("x2", yearScale(data[i + 1]["Year"]))
                .attr("y1", totalStudentScale(data[i]["Total"]))
                .attr("y2", totalStudentScale(data[i + 1]["Total"]))
                // TODO: Linear Changing colour
                .attr("stroke", colourScale(data[i]["Total"]));
        }
    }
}

/**
 * the main function to append chart onto the svg
 * @param {String} state the name of the state to visualise
 */
var changeVisibility = function(state) {
    if (!allStateName.includes(state)) {
        throw "invalid input";
    }
    var group = document.getElementById(state);
    group.style.visibility = group.style.visibility === "visible" ? "hidden" : "visible";
}