/**
 * The main function to append map onto the svg we created
 * @param {int} year the year we would like to display on the map
 * @param {svg} svg the main canvas to append map onto
 * @param {Object} data the array of data that we would like to visualise
 */
var drawMap = function (year, svg, data) {
	var projection = d3.geoAlbersUsa()
					   .translate([totalWidth/2-250, totalHeight/2-100])
					   .scale([1000]);

	var path = d3.geoPath()
				 .projection(projection);

	d3.json("us-states.json").then(function(json) {
		svg.selectAll("path")
		   .data(json.features)
    	   .enter()
    	   .append("path")
   		   .attr("d", path)
 		   .style("stroke", "#fff")
 		   .style("stroke-width", "1")
 		   .style("fill", "red");
 	});
};