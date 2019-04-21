/**
 * Margin object that defines the margin of the svg.
 */
const margin = new Margin(50, 50, 50, 50);

/**
 * The height of the svg canvas
 */
const height = 2000;

/**
 * The width of the svg canvas
 */
const width = 2000;

/**
 * The HEX value for the colour of illini blue.
 */
const illiniBlue = 0x13294B;

/**
 * The HEX value for the colour of illini orange.
 */
const illliniOrange = 0xE84A27;

/**
 * TODO: write JavaDoc
 */
const objectAttributeName = ["State", "Year", "Total"];

/**
 * An integer array storing all the available year.
 * Will be modified when the data is imported, we do not set it as constant.
 */
var allYear = [];

/**
 * An string array storing all the state name.
 * Will be modified when the data is imported, we do not set it as constant.
 */
var allStateName = [];

/**
 * JQuery starting point to start visualising data.
 */
$(function() {
  d3.csv("data.csv").then(function(data) {
    /* parse the year from string to integer */
    data.forEach(element => {
      element.Year = parseInt(element.Year);
    });
    /* For debug purpose */
    console.log(data);

    /* push all the available year in the year array */
    /* push all the state name in the stateName array */
    data.forEach(element => {
      if (!allStateName.includes(element.State)) {
        allStateName.push(element.State);
      }
      if (!allYear.includes(element.Year)) {
        allYear.push(element.Year)
      }
    });
    allYear.sort();
    allStateName.sort();

    var mapSVG = d3.select("#chart")
                    .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                    .style("width", width + margin.left + margin.right)
                    .style("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawScrollBar(mapSVG, data);

    //drawMap(mapSVG, data);
  });
});
