/**
 * Margin info for mapSVG.
 */
const mapSVGMargin = new Margin(50, 50, 50, 50);

/**
 * Margin info for chartSVG.
 */
const chartSVGMargin = new Margin(50, 50, 60, 40);

/**
 * Margin-included height for both SVG canvas.
 */
const height = 720;

/**
 * Margin-excluded width of the map SVG canvas.
 */
const mapSVGWidth = 820 - mapSVGMargin.left - mapSVGMargin.right;

/**
 * Margin-excluded width of the chart SVG canvas.
 */
const chartSVGWidth = 548 - chartSVGMargin.left - chartSVGMargin.right;

/**
 * Margin-excluded height of the map SVG canvas.
 */
const mapSVGHeight = height - mapSVGMargin.top - mapSVGMargin.bottom;

/**
 * Margin-excluded height of the chart SVG canvas.
 */
const chartSVGHeight = height - chartSVGMargin.top - chartSVGMargin.bottom;

/**
 * The colour to denote 0 students.
 */
const startColour = "#eff4ff"; //"#000089";

/**
 * The colour to denote the highest number of students.
 */
const endColour = "#001f63"; //"#ffa600"; 

/**
 * Three core attributes from the data array to be used.
 */
const objectAttributeName = ["State", "Year", "Total"];

/**
 * An integer array storing all the available year.
 * Will be modified and **sorted** when the data is imported.
 */
var allYear = [];

/**
 * An string array storing all the state name.
 * Will be modified and **sorted** when the data is imported.
 */
var allStateName = [];

/**
 * Highest number of incoming students.
 * Will be changed throughout the operation.
 */
var highestIncomingStudent = 0;

/**
 * Constant for transforming students number to corresponding colour.
 * If the student number is higher than this, another colour scheme would be applied.
 * Used in @function studentNumberToColour
 */
const incomingStudentThreshold = 5000;

/**
 * A color scale for the number of students.
 * Used in @function studentNumberToColour
 */
const studentColourScale = d3.scaleLog()
  .base(10)
  .domain([1, incomingStudentThreshold])
  .range([startColour, endColour]);

/**
 * A ratio scale for the number of students.
 * Used in @function drawMap
 */
const studentRatioScale = d3.scaleLog()
  .base(10)
  .domain([1, incomingStudentThreshold])
  .range([0, 1]);

/**
 * A function to transform number of students to colour.
 * @param {Number} number number of students.
 */
var studentNumberToColour = function(number) {
  if (number < incomingStudentThreshold) {
    return studentColourScale(number);
  }
  return "red";
}

/**
 * Year variable that record the scrollbar input.
 * drawMap() should respond to this variables.
 */
var yearPrev = 0;

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
      if (!allStateName.includes(element.State.replace(/[^a-zA-Z]/g, ""))) {
        allStateName.push(element.State.replace(/[^a-zA-Z]/g, ""));
      }
      if (!allYear.includes(element.Year)) {
        allYear.push(element.Year)
      }
      if (element["Total"] > highestIncomingStudent) {
        highestIncomingStudent = element["Total"];
      }
    });
    allYear.sort();
    allStateName.sort();

    d3.select("#visualisation")
        .append("svg")
          .attr("id", "mapSVGFramework")
          .attr("width", mapSVGWidth + mapSVGMargin.left + mapSVGMargin.right)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + mapSVGMargin.left + "," + mapSVGMargin.top + ")")
          .attr("id", "mapSVG");

    d3.select("#visualisation")
        .append("svg")
          .attr("id", "chartSVGFramework")
          .attr("width", chartSVGWidth + chartSVGMargin.left + chartSVGMargin.right)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + chartSVGMargin.left + "," + chartSVGMargin.top + ")")
          .attr("id", "chartSVG");

    initialiseMap();
    drawScrollBar(data);
    initialiseChart(data);
  });
});
