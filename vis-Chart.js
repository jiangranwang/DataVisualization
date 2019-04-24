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

    /* ---------- Scales and Axis ---------- */
    var yearScale = d3.scaleLinear()
                    .domain([allYear[0], allYear[allYear.length - 1]])
                    .range([0, chartSVGWidth]);
    var xAxis = d3.axisBottom()
                    .scale(yearScale);
    var totalStudentScale = d3.scaleLog()
                    .base(10)
                    .domain([1, highestIncomingStudent])
                    .range([chartSVGHeight, 0]);
    var yAxis = d3.axisLeft().scale(totalStudentScale).ticks(100).tickFormat(d3.format(",.2r"));
    svg.append("g")
        .attr("transform", "translate(0" + "," + chartSVGHeight + ")")
        .call(xAxis);
    svg.append("g")
        .call(yAxis);

    /* ---------- Dashed line on chart ---------- */
    d3.select("#chartSVG").append("line")
    .attr("id", "dashedLine")
    .attr("stroke-width", 0.5)
    .attr("stroke", "black")
    .attr("opacity", 0.4)
    .attr("x1", yearScale(allYear[0]))
    .attr("x2", yearScale(allYear[0]))
    .attr("y1", 0)
    .attr("y2", chartSVGHeight);
    
    /* ---------- Tip for each dots ---------- */
    var dotTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html((d) => {
            return "<div style='text-align: center;margin-left:auto; margin-right:auto;'><big>" + d["State"] + "<br><small><br>" +
                  "<div class='row' style='text-align: center; margin-left:auto; margin-right:auto;'>" +
                  "<div class='col-6' style='border-right: 1px solid white;'>" +
                    '<span style="font-size: 22px;">' + d["Year"] + '</span><br>' +
                    '<span style="font-size: 15px; text-align: center;">year</span><br>' +
                  "</div>" +
                  "<div class='col-6'>" +
                    '<span style="font-size: 22px;"><u>' + d["Total"] + '</u></span><br>' +
                    '<span style="font-size: 15px;">students</span><br>' +
                  "</div>"
        });
    svg.call(dotTip);
    
    /* ---------- Axis Caption ---------- */
    var chartTitleGroup = svg.append("g").attr("id", "chartTitle");
    var xTitleTransform = chartSVGHeight + 40;
    chartTitleGroup.append("text")
        .text("Year")
        .attr("transform", "translate(" + chartSVGWidth / 2 + "," + xTitleTransform + ")");
    chartTitleGroup.append("text")
        .text("Number of Incoming Students in log 10")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + -50 + "," + chartSVGHeight / 2 + ")" + "rotate(90)");
    
    /* ---------- Group Creation for Chart Elements ---------- */
    allStateName.forEach(stateName => {
        svg.append("g").attr("id", stateName).style("Visibility", "hidden");
    })

    /* ---------- Append Elements on SVG ---------- */
    for (let i = 0; i < data.length; i++) {
        d3.select("#" + data[i]["State"].replace(/[^a-zA-Z]/g, ""))
            .append("circle")
                .attr("cx", yearScale(data[i]["Year"]))
                .attr("cy", totalStudentScale(data[i]["Total"]))
                .attr("r", dotRadius)
                .attr("fill", "white")
                .attr("stroke", studentNumberToColour(data[i]["Total"]))
                .attr("id", data[i]["Year"] + " " + data[i]["State"])
                .on("mouseover", () => {
                    dotTip.show(data[i]);
                })
                .on("mouseout", () => {
                    dotTip.hide(data[i]);
                })
                .on("click", () => {
                    changeVisibility(data[i]["State"].replace(/[^a-zA-Z]/g, ""));
                    dotTip.hide(data[i]);
                });
        if (i < data.length - 1 && data[i]["State"] == data[i + 1]["State"]) {
            d3.select("#" + data[i]["State"].replace(/[^a-zA-Z]/g, ""))
                .append("line")
                .on("click", () => {
                    changeVisibility(data[i]["State"].replace(/[^a-zA-Z]/g, ""));
                })
                .attr("stroke-width", 2)
                .attr("x1", yearScale(data[i]["Year"]))
                .attr("x2", yearScale(data[i + 1]["Year"]))
                .attr("y1", totalStudentScale(data[i]["Total"]))
                .attr("y2", totalStudentScale(data[i + 1]["Total"]))
                .attr("stroke", studentNumberToColour(data[i]["Total"]));
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

/**
 * A helper function to update the position of the dashed grid.
 * @param {Number} year the current year we are displaying
 */
var dashedGrid = function(year) {
    var yearScale = d3.scaleLinear()
    .domain([allYear[0], allYear[allYear.length - 1]])
    .range([0, chartSVGWidth]);
    d3.select("#dashedLine")
    .transition()
    .attr("x1", yearScale(year))
    .attr("x2", yearScale(year))
}