// Create scales for the bar graph
var y0 = d3.scale.ordinal()
    .rangeRoundBands([0, heightB], .1);
var y1 = d3.scale.ordinal();
var x = d3.scale.linear()
    .range([0, widthB]);

var color = d3.scale.ordinal()
    .range(["#0000FF", "#DC143C", "#006400",
			"#FF8C00", "#FFD700", "#00FF00"]);

// Making the line axis of the bar
var yAxis = d3.svg.axis()
    .scale(y0)
    .orient("left");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format(".2s"));

// Create svg element under the svgBar tag

var svgBar = d3.select('#svgBar')
	.append('svg')
	.attr('width', widthB + marginB.right +
		  marginB.left)
	.attr('height', heightB + marginB.top +
		  marginB.bottom)
	.append('g')
    .attr("transform", "translate(" + marginB.left + "," +
		  marginB.top + ")");

// Space the groups
var groupSpacing = 6;

d3.csv("totalHomW.csv", function(error, data) {
	if (error) throw error;
	// This filter is done already in totalHomW.csv
	//data = data.filter(function(d){ return d.TotalHom > 93;})
	var LocalidName = d3.keys(data[0]).filter(function(k){
		return k != 'Localidad';});
	
	data.forEach(function(d) {
		d.ages = LocalidName.map(function(name) {
			return {name: name, value: +d[name]}; });
	});
	y0.domain(data.map(function(d) { return d.Localidad; }));
	y1.domain(LocalidName).rangeRoundBands([0, y0.rangeBand()]);
	x.domain([0, d3.max(data, function(d) {
		return d3.max(d.ages, function(d) { return d.value; }); })]);
	
	svgBar.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + heightB + ")")
		.call(xAxis);
	
	svgBar.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end");

	svgBar.append('text')
		.attr('class', 'title')
		.attr('x', 0)
		.attr('y', -15)
		.text('Homicides above the 3rd quantile of the sample');

	var state = svgBar.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) {
			return "translate(0," + y0(d.Localidad) + ")"; });

	debugger;
	state.selectAll("rect")
		.data(function(d) { return d.ages; })
		.enter().append("rect")
		.attr("height", y1.rangeBand())
		.attr("y", function(d) { return y1(d.name); })
		//.attr("x", function(d) { return x(d.value); })
		.attr("width", function(d) { return x(d.value); })
		.style("fill", function(d) { return color(d.name); });

	var legend = svgBar.selectAll(".legend")
		.data(LocalidName.slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", widthB - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", widthB - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
});
