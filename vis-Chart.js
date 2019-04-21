
/**
 * a helper function to put basic elements on it.
 * @param {svg} svg the main canvas to append basic elements
 * @param {Array} data the array of data that we would like to visualise
 */
var initialiseChart = function(svg, data) {
    var xScale = d3.scaleLinear()
                    .domain([allYear[0], allYear[allYear.length - 1]])
                    .range([0, chartSVGWidth]);
    var xAxis = d3.axisBottom()
                    .scale(xScale);

    var yScale = d3.scaleLinear().domain([0, biggestIncomingStudent]).range([totalHeight - 10, 10]);

    var yAxis = d3.axisLeft().scale(yScale);

    svg.append("g")
        //.attr("id", "xAxis")
        .call(xAxis);
    
    svg.append("g")
        //.attr("id", "yAxis")
        .call(yAxis);   

    allStateName.forEach(element => {
        svg.append("g")
            .attr("id", element);
        /*data.forEach(element => {
            
        });*/
    });
}

/**
 * the main function to append chart onto the svg
 * @param {string} state the name of the state to visualise
 * @param {svg} svg the main canvas to append chart onto
 * @param {Array} data the array of data that we would like to visualise
 */
var drawChart = function(state, svg, data) {

}