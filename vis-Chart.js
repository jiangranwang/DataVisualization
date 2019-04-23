/**
 * Radius of each dot.
 */
const dotRadius = 3;

/**
 * a helper function to put basic elements on the chartSVG.
 * @param {Array} data the array of data that we would like to visualise
 */
var initialiseChart = function(data) {
    var svg = d3.select("#chartSVG");
    var yearScale = d3.scaleLinear()
                    .domain([allYear[0], allYear[allYear.length - 1]])
                    .range([0, chartSVGWidth]);
    var xAxis = d3.axisBottom()
                    .scale(yearScale);

    var totalStudentScale = d3.scaleLog()
                    .base(10)
                    .domain([1, highestIncomingStudent])
                    .range([chartSVGHeight, 0]);

    var colourScale = studentNumberToColour;

    // TODO: change the tick of the y Axis
    var yAxis = d3.axisLeft().scale(totalStudentScale);
                    //.ticks([1, 10, 100, 500, 10000, 30000]);

    // TODO: tip CSS apparence
    var theTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html((d) => {
            return d["Total"] + " students comming from " + d["State"] + " in " + d["Year"];
        });
    svg.call(theTip);
    
    svg.append("g")
        .attr("transform", "translate(0" + "," + chartSVGHeight + ")")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);
    
    var chartTitleGroup = svg.append("g").attr("id", "chartTitle");
    
    chartTitleGroup.append("text")
        .text("Year")
        .attr("transform", "translate(" + chartSVGWidth / 2 + "," + chartSVGHeight + ")");
    
    chartTitleGroup.append("text")
        .text("Number of Incoming Students")
        .attr("transform", "rotate(270)")
        .attr("transform", "translate(" + chartSVGWidth / 2 + "," + 0 + ")");

    allStateName.forEach(stateName => {
        svg.append("g").attr("id", stateName).style("Visibility", "hidden");
    })

    for (let i = 0; i < data.length; i++) {
        d3.select("#" + data[i]["State"].replace(/[^a-zA-Z]/g, ""))
            .append("circle")
                .attr("cx", yearScale(data[i]["Year"]))
                .attr("cy", totalStudentScale(data[i]["Total"]))
                .attr("r", dotRadius)
                .attr("fill", "white")
                .attr("stroke", colourScale(data[i]["Total"]))
                .attr("id", data[i]["Year"] + " " + data[i]["State"])
                .on("mouseover", (d) => {
                    theTip.show(data[i]);
                })
                .on("mouseout", () => {
                    theTip.hide(data[i]);
                });
        if (i < data.length - 1 && data[i]["State"] == data[i + 1]["State"]) {
            d3.select("#" + data[i]["State"].replace(/[^a-zA-Z]/g, ""))
                .append("line")
                .attr("x1", yearScale(data[i]["Year"]))
                .attr("x2", yearScale(data[i + 1]["Year"]))
                .attr("y1", totalStudentScale(data[i]["Total"]))
                .attr("y2", totalStudentScale(data[i + 1]["Total"]))
                // TODO: Linear Changing colour for each line
                .attr("stroke", colourScale(data[i]["Total"]));
        }
    }
}

/**
 * A helper function to change certain state's chart visibility.
 * @param {String} state the name of the state to have its visibility changed
 */
var changeVisibility = function(state) {
    if (!allStateName.includes(state)) {
        alert("Invalid operation!");
        throw "invalid input";
    }
    // equivalent to document.getElementById if we select element by d3 with .node() command
    var group = d3.select("#" + state.replace(/[^a-zA-Z]/g, "")).node();
    group.style.visibility = group.style.visibility === "visible" ? "hidden" : "visible";
}
