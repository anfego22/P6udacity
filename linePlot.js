//Initial setting
var padDia = 35;
var marginL = {top: 25, right: 10,
			  bottom: 40, left: 40};
var heightL = 600 - marginL.top - marginL.bottom;
var widthL = 950 - marginL.right - marginL.left;
var linechart = d3.select('#svgLineP')
	.append('svg')
	.attr('width', widthL + marginL.right +
		  marginL.left)
	.attr('height', heightL + marginL.top +
		  marginL.bottom)
	.append('g')
	.attr("transform", "translate(" + marginL.left + "," +
		  marginL.top + ")");

d3.csv('TotalHom.csv', function(error, dataset){
	var xTicks = 5;
	var yTicks = 5;
	var formatt = d3.time.format('%Y-%m-%d').parse;
	var xMax = d3.max(dataset, function(d){
		return formatt(d.Fecha);});
	var xMin = d3.min(dataset, function(d){
		return formatt(d.Fecha);});
	var yMax = d3.max(dataset, function(d){
		return +d.Homicidios;});
	// Scalers first
	var xScale = d3.time.scale()
		.domain([xMin, xMax])
		.range([0, widthL]);
	var yScale = d3.scale.linear()
		.domain([0, yMax])
		.range([heightL, 0]);
	// Adding the axis :)
	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickFormat(d3.time.format('%Y-%m'))
		.tickPadding(7)
		.ticks(xTicks);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(yTicks);

	// Line

	var line = d3.svg.line()
		.x(function(d) {
			return xScale(formatt(d.Fecha)); })
		.y(function(d) { return yScale(+d.Homicidios); });
	
	linechart.append('g')
		.attr('class', 'xaxis')
		.attr('transform', 'translate(0,' + heightL + ')')
		.call(xAxis);

	linechart.append('g')
		.attr('class', 'yaxis')
		.call(yAxis);
	
	linechart.append('svg:path')
		.attr('d', line(dataset))
		.attr('class', 'line')
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'none');
		
	linechart.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return +xScale(formatt(d.Fecha));
		})
		.attr("cy", function(d){
			return +yScale(d.Homicidios);}
			 )
		.attr("r", 4);
	
	d3.select('#svgLineP').select('svg')
		.append('text')
		.attr('x', 25)
		.attr('y', 15)
		.attr('class', 'title')
		.text('Homicides (#)');

});

