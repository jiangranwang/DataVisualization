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
 * JQuery starting point to start visualising data.
 */
$(function() {
  d3.csv("data.csv").then(function(data) {
    console.log(data);
    
    var svg = d3.select("#mapVisualiser")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawMap(svg, data);
    drawChart(svg, data);
    drawScrollBar(svg, data);
  });
});