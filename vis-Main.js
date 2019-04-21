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

/**
 * The HEX value for the colour of illini blue.
 */
const illiniBlue = 0x13294B;

/**
 * The HEX value for the colour of illini orange.
 */
const illliniOrange = 0xE84A27;

/**
 * A color scale for the number of students
 */
var studentColourScale = d3.scaleLinear()
  .domain([0, 500])
  .range(["#eff4ff", "#001f63"])

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
    });
    allYear.sort();
    allStateName.sort();

    console.log(allYear);
    console.log(allStateName);
    console.log(biggestIncomingStudent);
    console.table(data);

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

    var legendPosX = 500;
    var legendPosY = 600;
    var defs = mapSVG.append("defs");
    var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");
    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    linearGradient.selectAll("stop")
      .data( studentColourScale.range() )
      .enter().append("stop")
      .attr("offset", function(i) { return i/(studentColourScale.range().length-1); })
      .attr("stop-color", function(d) { return d; });
    mapSVG.append("rect")
      .attr("x", legendPosX)
      .attr("y", legendPosY)
      .attr("width", 300)
      .attr("height", 20)
      .style("fill", "url(#linear-gradient)");
    mapSVG.append("text")
      .attr("x", legendPosX)
      .attr("y", legendPosY+35)
      .text("0");
    mapSVG.append("text")
      .attr("x", legendPosX+280)
      .attr("y", legendPosY+35)
      .text("500 Students");
    mapSVG.append("text")
      .attr("x", legendPosX+140)
      .attr("y", legendPosY+35)
      .text("250");
    mapSVG.append("rect")
      .attr("x", legendPosX+125)
      .attr("y", legendPosY-50)
      .attr("width", 50)
      .attr("height", 20)
      .style("fill", "red");
    mapSVG.append("text")
      .attr("x", legendPosX+100)
      .attr("y", legendPosY-15)
      .text("30000 Students");

    
    initialiseChart(chartSVG, data);
    drawScrollBar(mapSVG, data);
    drawMap(allYear[0], mapSVG, data);
  });
});