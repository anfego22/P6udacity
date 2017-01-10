//Initial setting
var padDia = 35;
var marginB = {top: 40, right: 10,
			   bottom: 40, left: 150};
var heightB = 600 - marginB.top - marginB.bottom;
var widthB = 950 - marginB.right - marginB.left;
var barByWeap = d3.select('#svgHomByWeapHour')
	.append('svg')
	.attr('width', widthB + marginB.right +
		  marginB.left)
	.attr('height', heightB + marginB.top +
		  marginB.bottom)
	.append('g')
	.attr("transform", "translate(" + marginB.left + "," +
		  marginB.top + ")");

// Create scales for the bar graph
var y0W = d3.scale.ordinal()
    .rangeRoundBands([0, heightB], .1);
var y1W = d3.scale.ordinal();
var xW = d3.scale.linear()
    .range([0, widthB]);

var color = d3.scale.ordinal()
    .range(["red", 'steelblue']);

// Making the line axis of the bar
var yAxisW = d3.svg.axis()
    .scale(y0W)
    .orient("left");

var xAxisW = d3.svg.axis()
    .scale(xW)
    .orient("bottom")
    .tickFormat(d3.format(".2s"));


d3.csv("homByGunHourW.csv", function(error, data) {
	if (error) throw error;
	debugger;
	var armaName = d3.keys(data[0]).filter(function(k){
		return k != 'HoraInt';});
	data.forEach(function(d) {
		d.ages = armaName.map(function(name) {
			return {name: name, value: +d[name]}; });
	});
	y0W.domain(data.map(function(d) { return d.HoraInt; }));
	y1W.domain(armaName).rangeRoundBands([0, y0W.rangeBand()]);
	xW.domain([0, d3.max(data, function(d) {
		return d3.max(d.ages, function(d) { return d.value; }); })]);
	
	barByWeap.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + heightB + ")")
		.call(xAxisW);
	
	barByWeap.append("g")
		.attr("class", "y axis")
		.call(yAxisW)
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end");

	barByWeap.append('text')
		.attr('class', 'title')
		.attr('x', -100)
		.attr('y', -15)
		.text('Hour of Day');

	barByWeap.append('text')
		.attr('class', 'title')
		.attr('x', widthB-110)
		.attr('y', heightB+40)
		.text('Homicides (#)');
	
	var horaInt = barByWeap.selectAll(".horaInt")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) {
			return "translate(0," + y0W(d.HoraInt) + ")"; });

	debugger;
	horaInt.selectAll("rect")
		.data(function(d) { return d.ages; })
		.enter().append("rect")
		.attr("height", y1W.rangeBand())
		.attr("y", function(d) { return y1W(d.name); })
	//.attr("x", function(d) { return x(d.value); })
		.attr("width", function(d) { return xW(d.value); })
		.style("fill", function(d) { return color(d.name); });

	var legend = barByWeap.selectAll(".legend")
		.data(armaName.slice().reverse())
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
