/**
 * Margin object that defines the margin of the svg.
 */
const margin = new Margin(50, 50, 50, 50);

$(function() {
  d3.csv("data/data.csv").then(function(data) {
    visualise(data);
  });
});

/**
 * 
 * @param {Object} data the data we would like to visualise
 */
var visualise = function(data) {

};