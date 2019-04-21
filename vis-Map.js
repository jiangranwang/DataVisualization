/**
 * The main function to append map onto the svg we created
 * @param {int} currYear the year we would like to display on the map
 * @param {svg} svg the main canvas to append map onto
 * @param {Array} data the array of data that we would like to visualise
 */
var drawMap = function (currYear, svg, data) {
	var projection = d3.geoAlbersUsa()
					   //.translate([totalWidth/2-250, totalHeight/2-100])
					   .scale([mapSVGWidth]);

	var path = d3.geoPath()
				 .projection(projection);

	d3.json("us-states.json").then(function(json) {
		for (var i = 0; i < data.length; i++) {
      		if (data[i].Year != currYear) {
        		continue;
     		}
      		var dataState = data[i].State;
      		var dataTotal = data[i].Total;
      		for (var j = 0; j < json.features.length; j++) {
      			var jsonState = json.features[j].properties.name;
        		if (jsonState == dataState) {
          			json.features[j].properties.total = dataTotal;
          			break;
       			}
      		}
        }
        
		svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
                .style("stroke", "white")
                .style("stroke-width", "1")
                .style("fill", function(d) {
                    var value = d.properties.total;
                    if (value < 500)
                        return studentColourScale(value);
                    else {
                        return "red";
                    }
                })
                .on("mouseover", function(d,i) {
                    d3.select(this)
                    .attr("opacity", 0.7)
                })
                .on("mouseout", function(d,i) {
                    d3.select(this)
                    .attr("opacity", 1)
                });
 	});
};