//Initial setting
var padDia = 35;
var marginL = {top: 40, right: 10,
			  bottom: 40, left: 50};
var heightL = 600 - marginL.top - marginL.bottom;
var widthL = 950 - marginL.right - marginL.left;
var lineByWeap = d3.select('#svgLineByWeap')
	.append('svg')
	.attr('width', widthL + marginL.right +
		  marginL.left)
	.attr('height', heightL + marginL.top +
		  marginL.bottom)
	.append('g')
	.attr("transform", "translate(" + marginL.left + "," +
		  marginL.top + ")");

d3.csv('TotalHomByWep.csv', function(error, dataset){
	var Other = dataset.filter(function(d){
		return d.Arma == 'OTHER';})
	var Fire = dataset.filter(function(d){
		return d.Arma == 'ARMA DE FUEGO';})
	var White = dataset.filter(function(d){
		return d.Arma == 'ARMA BLANCA';})
	
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
		.interpolate('basis')
		.x(function(d) {
			return xScale(formatt(d.Fecha)); })
		.y(function(d) { return yScale(+d.Homicidios); });
	
	lineByWeap.append('g')
		.attr('class', 'xaxis')
		.attr('transform', 'translate(0,' + heightL + ')')
		.call(xAxis);
	
	lineByWeap.append('g')
		.attr('class', 'yaxis')
		.call(yAxis);
	
	lineByWeap.append('svg:path')
		.attr('d', line(White))
		.attr('class', 'line')
		.attr('stroke', 'steelblue')
	lineByWeap.append('svg:path')
		.attr('d', line(Fire))
		.attr('class', 'line')
		.attr('stroke', 'red')
	lineByWeap.append('svg:path')
		.attr('d', line(Other))
		.attr('class', 'line')
		.attr('stroke', 'gray')
		
	d3.select('#svgLineByWeap').select('svg')
		.append('text')
		.attr('x', 0)
		.attr('y', 20)
		.attr('class', 'title')
		.text('Homicides (#)');
	
	var legendWeap = ['Firearms', 'Knives', 'Others'];
	var colorR = ['red', 'steelblue', 'gray'];
	var colorsWeap = d3.scale.ordinal()
		.domain(legendWeap)
		.range(colorR);
	var legendL = d3.select('#svgLineByWeap').select('svg')
		.selectAll('g.legend')
		.data(legendWeap)
		.enter()
		.append('g');
	legendL.append('rect')
		.attr('x', widthL - 50)
		.attr('y', function(d, i){
			return((i*20) + 30);})
		.style('fill', function(d, i){
			return colorsWeap(d);})
		.attr('width', 20)
		.attr('height', 20);
	legendL.append('text')
		.attr('x', widthL - 25)
		.attr('y', function(d, i){
			return((i*20) + 45);})
		.text(function(d, i){
			return d;})
});
