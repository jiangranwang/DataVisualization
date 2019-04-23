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
        
    var dotTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html((d) => {
            if (d["Total"] <= 1) {
                return "<u>" + d["Total"] + "</u> student comming from <u>" + d["State"] + "</u> in <u>" + d["Year"] + "</u>.";
            }
            return "<u>" + d["Total"] + "</u> students comming from <u>" + d["State"] + "</u> in <u>" + d["Year"] + "</u>.";
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
    
    /* ---------- Linear Gradient for Line Stroke ---------- */
    // var defs = svg.append("defs");
    // var linearGradient = defs.append("linearGradient")
    //         .attr("id", "linear-gradient");
    // linearGradient
    //         .attr("x1", "0%")
    //         .attr("y1", "0%")
    //         .attr("x2", "100%")
    //         .attr("y2", "0%");
    // linearGradient.selectAll("stop")
    //         .data( colourScale.range() )
    //         .enter().append("stop")
    //         .attr("offset", (i) => { return i/(colorScale.range().length-1); })
    //         .attr("stop-color", (d) => { return d; });
    
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
                // TODO: Linear Changing colour for each line
                .attr("stroke", studentNumberToColour(data[i]["Total"]));
                /*() => {
                    return "url(#" + "linear-gradient" + d.department.replace(/[^a-zA-Z]/g, "") + ")"
                });*/
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
