/**
 * Margin info for mapSVG
 */
const mapSVGMargin = new Margin(50, 50, 50, 50);

/**
 * Margin info for chartSVG
 */
const chartSVGMargin = new Margin(50, 50, 50, 50);

/**
 * Margin-included height for both SVG canvas
 */
const height = 720;

/**
 * Margin-excluded width of the map SVG canvas
 */
const mapSVGWidth = 900 - mapSVGMargin.left - mapSVGMargin.right;

/**
 * Margin-excluded width of the chart SVG canvas
 */
const chartSVGWidth = 600 - chartSVGMargin.left - chartSVGMargin.right;

/**
 * Margin-excluded height of the map SVG canvas
 */
const mapSVGHeight = height - mapSVGMargin.top - mapSVGMargin.bottom;

/**
 * Margin-excluded height of the chart SVG canvas
 */
const chartSVGHeight = height - chartSVGMargin.top - chartSVGMargin.bottom;

const startColour = "#EEEF63"; //"#eff4ff";
const endColour = "#B25E4F"; //"#001f63";

/**
 * Three core attributes from the data array to be used.
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
 * Biggest number of incoming students
 * value will be changed throughout the operation
 */
var biggestIncomingStudent = 0;

/**
 * A color scale for the number of students
 */
var studentColourScale = d3.scaleLog()
  .domain([1, 30000])
  .range([startColour, endColour])

/**
 * JQuery starting point to start visualising data.
 */
$(function() {
  d3.csv("data-modified.csv").then(function(data) {
    /* parse the year and the total number of incoming student from string to integer */
    /* push all the available year in the year array */
    /* push all the state name in the stateName array */
    data.forEach(element => {
      element.Year = parseInt(element.Year);
      element.Total = parseInt(element.Total);
      if (!allStateName.includes(element.State)) {
        allStateName.push(element.State);
      }
      if (!allYear.includes(element.Year)) {
        allYear.push(element.Year)
      }
      if (element["Total"] > biggestIncomingStudent) {
        biggestIncomingStudent = element["Total"];
      }
    });
    allYear.sort();
    allStateName.sort();

    var mapSVG = d3.select("#map")
                    .append("svg")
                      .attr("width", mapSVGWidth + mapSVGMargin.left + mapSVGMargin.right)
                      .attr("height", height)
                    .append("g")
                      .attr("transform", "translate(" + mapSVGMargin.left + "," + mapSVGMargin.top + ")")

    var chartSVG = d3.select("#map")
                      .append("svg")
                        .attr("width", chartSVGWidth + chartSVGMargin.left + chartSVGMargin.right)
                        .attr("height", height)
                      .append("g")
                        .attr("transform", "translate(" + chartSVGMargin.left + "," + chartSVGMargin.top + ")")
    initialiseMap(mapSVG);
    initialiseChart(chartSVG, data);
    drawScrollBar(mapSVG, data);
    drawMap(allYear[0], mapSVG, data);
  });
});