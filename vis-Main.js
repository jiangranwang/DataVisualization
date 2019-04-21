/**
 * The height of the whole svg canvases
 */
const totalHeight = 780;

/**
 * The width of the whole svg canvases
 */
const totalWidth = 1380;

/**
 * The distance between the chartSVG and the mapSVG
 */
const innerGap = 50;

/**
 * The distance between the left border of chartSVG and the left border of window
 * The two svg canvases is always at the middle of the document
 */
const mapSVGTransform = (window.innerWidth - totalWidth) / 2;

/**
 * The width of the map SVG canvas
 */
const mapSVGWidth = totalWidth * 2 / 3;

/**
 * The width of the chart SVG canvas
 */
const chartSVGWidth = totalWidth - mapSVGWidth - innerGap;

/**
 * The HEX value for the colour of illini blue.
 */
const illiniBlue = 0x13294B;

/**
 * The HEX value for the colour of illini orange.
 */
const illliniOrange = 0xE84A27;

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
 * Smallest number of incoming students
 * value will be changed throughout the operation
 */
var smallestIncomingStudent = 30000;

/**
 * JQuery starting point to start visualising data.
 */
$(function() {
  d3.csv("data.csv").then(function(data) {
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
      if (element["Total"] < smallestIncomingStudent) {
        smallestIncomingStudent = element["Total"];
      }
    });
    allYear.sort();
    allStateName.sort();

    console.log(allYear);
    console.log(allStateName);
    console.log(biggestIncomingStudent);
    console.log(smallestIncomingStudent);
    console.table(data);

    var mapSVG = d3.select("#map")
                    .append("svg")
                      .attr("width", mapSVGWidth)
                      .attr("height", totalHeight)
                    .append("g")
                      .attr("transform", "translate(" + mapSVGTransform + "," + 0 + ")")
    /* Debug purpose */
    mapSVG.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", totalHeight)
            .attr("stroke", "black");

    var chartSVG = d3.select("#map")
                      .append("svg")
                        .attr("width", chartSVGWidth)
                        .attr("height", totalHeight)
                      .append("g")
                        .attr("transform", "translate(" + innerGap + "," + 0 + ")")

    /* Debug purpose */
    chartSVG.append("line")
              .attr("x1", 0)
              .attr("x2", 0)
              .attr("y1", 0)
              .attr("y2", totalHeight)
              .attr("stroke", "red")
    
    initialiseChart(chartSVG, data);
    drawScrollBar(mapSVG, data);
    drawMap(mapSVG, data);
  });
});