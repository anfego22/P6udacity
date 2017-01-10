function draw(error, geo_data){
	if (error) throw error;
	// Filter the data first!
	// Sumapaz area isn't necessary
	geo_data.features =
		geo_data.features.
		filter(function(d) {
			return d.properties.name != 'Sumapaz';
		});
	var center = d3.geo.centroid(geo_data)
	var scale  = 100;
	var offset = [width/2, height/2];
	var projection = d3.geo.mercator()
		.scale(scale)
		.center(center)
		.translate(offset);
	// create the path
	var path = d3.geo.path().projection(projection);
	// using the path determine the bounds of the
	// current map and use 
	// these to determine better values for the
	// scale and translation
	var bounds  = path.bounds(geo_data);
	var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
	var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
	var scale   = (hscale < vscale) ? hscale : vscale;
	var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
				   height - (bounds[0][1] + bounds[1][1])/2];
	// new projection
	projection = d3.geo.mercator().center(center)
		.scale(scale).translate(offset);
	path = path.projection(projection);
	// add a rectangle to see the bound of the svg
	svg.append("rect").attr('width', width)
		.attr('height', height)
		.style('stroke', 'black').style('fill', 'none');
	svg.selectAll("path")
		.data(geo_data.features)
		.enter().append("path")
		.attr("d", path)
		.attr('stroke-width', 0.5)
		.attr('stroke', 'gray')
		.attr('fill', 'none')
		.attr('id', function(d){
			return d.properties.name;});
		
	function reduceProj(d){
		var coord = d.geometry.coordinates[0][0];
		var mLon = d3.mean(coord, function(d){
			return d[0];});
		var mLat = d3.mean(coord, function(d){
			return d[1];});
		return [mLon, mLat];
	};
	
	svg.selectAll(".place-label")
		.data(geo_data.features)
		.enter().append("text")
		.attr("class", "place-label")
		.attr("transform", function(d) {
			return "translate(" +
				projection(reduceProj(d)) + ")";})
		.attr("dx", "-2em")
		.attr('dy', '0.35em')
		.text(function(d) {
			if(d.properties.name != 'La Candelaria'){
				return d.properties.name;
			}
		});

};
