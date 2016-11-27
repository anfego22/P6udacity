var marginB = {top: 10, right: 10,
			  bottom: 25, left: 10};
var heightB = 500 - margin.top - margin.bottom;
var widthB = 850 - margin.right - margin.left;


// Create scales for the bar graph
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, widthB], .1);
var x1 = d3.scale.ordinal();
var y = d3.scale.linear()
    .range([heightB, 0]);

// Scale for 19 localidades!!
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56",
			"#d0743c"]);

// Making the line axis of the bar
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
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

 
d3.csv("totalHomW.csv", function(error, data) {
	if (error) throw error;
	// This filter is done already in totalHomW.csv
	//data = data.filter(function(d){ return d.TotalHom > 93;})
	debugger;
	var LocalidName = d3.keys(data[0]).filter(function(k){
		return k != 'Localidad';});
	
	data.forEach(function(d) {
		d.ages = LocalidName.map(function(name) {
			return {name: name, value: +d[name]}; });
	});
	x0.domain(data.map(function(d) { return d.Localidad; }));
	x1.domain(LocalidName).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(data, function(d) {
		return d3.max(d.ages, function(d) { return d.value; }); })]);
	
	svgBar.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + heightB + ")")
		.call(xAxis);

	svgBar.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Homicides");

	var state = svgBar.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) {
			return "translate(" + x0(d.Localidad) + ",0)"; });

	state.selectAll("rect")
		.data(function(d) { return d.ages; })
		.enter().append("rect")
		.attr("width", x1.rangeBand())
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return heightB - y(d.value); })
		.style("fill", function(d) { return color(d.name); });

	
	var legend = svgBar.selectAll(".legend")
		.data(LocalidName.slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
});
