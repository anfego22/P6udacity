function printMap(){
	dia = diasConver[diaGlob]
	d3.csv('Bogota.csv', function(crimData){
		//Filter data with a specific day
		// and hour range
		crimData = crimData.filter(function(d) {
			return d.Dia == dia &&
				d.HoraInt == horaGlob;
		});
		// Map Number of homicides in each
		// location with the respective color
		function getHom(localidad){
			var hom = crimData.filter(function(d){
				return d.Localidad == localidad;})
			if(hom.length != 0){
				return colors(hom[0].Homicidios);
			} else {
				return 'snow';
			}
		}
		// Add transition when filling the
		// location
		svg.selectAll('path')
			.transition()
			.delay(100)
			.style('fill', function(d){
				return getHom(d.properties.name);
			});
	})
}


// Animate all hours of a given day
function playMap(dur){
	d3.selectAll('rect.rectangle').transition()
		.duration(300)
		.style("fill", "#333");
	// Select rectangle by id
	d3.select('rect#' + diaGlob).
		transition().duration(300)
		.style("fill", "#FFD700");
	var hour_index = 0;
	var colorHour = setInterval(function(){
		horaGlob = HoraInt[hour_index]
		d3.selectAll('rect.rectangleH').
			transition().duration(300)
			.style('fill', '#333');
		d3.selectAll('#Hora'+ hour_index)
			.transition().duration(300)
			.style('fill', '#FFD700');
		printMap();
		hour_index++;
		if(hour_index >= HoraInt.length){
			clearInterval(colorHour);
		}
	}, dur);
}

// Animate all hours of a all days
function playAll(dur){
	var days = ['Mon', 'Tue', 'Wen',
				'Thu', 'Fri', 'Sat', 'Sun'];
	day_index = 0;
	var playS = setInterval(function(){
		diaGlob = days[day_index];
		playMap(dur);
		day_index++;
		if(day_index >= days.length){
			clearInterval(playS);
		}
	}, dur*7);
}

// playMap function but with specific hour of days
function playMapEsp(dur){
	d3.selectAll('rect.rectangle').transition()
		.duration(300)
		.style("fill", "#333");
	// Select rectangle by id
	d3.select('rect#' + diaGlob).
		transition().duration(300)
		.style("fill", "#FFD700");
	var hour_index = 0;
	var especificDayHour = {'Fri' : ['[0-4)', '[20-24)'],
							'Sat' : ['[0-4)', '[4-8)', '[20-24)'],
							'Sun' : ['[0-4)']};
	var colorHour = setInterval(function(){
		horaGlob = especificDayHour[diaGlob][hour_index];
		d3.selectAll('rect.rectangleH').
			transition().duration(300)
			.style('fill', '#333');
		d3.selectAll('#Hora' + HoraConver[horaGlob])
			.transition().duration(300)
			.style('fill', '#FFD700');
		printMap();
		hour_index++;
		if(hour_index >= especificDayHour[diaGlob].length){
			clearInterval(colorHour);
		}
	}, dur);
}

// Start Animation
function startAnimation(dur){
	var dayEsp = ['Fri', 'Sat'];
	day_index = 0;
	var playS = setInterval(function(){
		diaGlob = dayEsp[day_index];
		// playMap code but with certain hours
		playMapEsp(dur)
		day_index++;
		if(day_index >= dayEsp.length){
			clearInterval(playS);
		}
	}, dur*3);
}

// Margin and initial setup of page
var padDia = 35;
var margin = {top: 10, right: 10,
			  bottom: 10, left: 10};
var height = 900 - margin.top - margin.bottom;
var width = 750 - margin.right - margin.left;
var svg = d3.select('#svgHere')
	.append('svg')
	.attr('width', width + margin.right +
		  margin.left)
	.attr('height', height + margin.top +
		  margin.bottom)
	.append('g');
var ls_w = 20, ls_h = 20;
// Intial day and hour intervals
var diaGlob = 'Mon';
var horaGlob = '[0-4)';

// Map some index i, to an hour
var HoraConver = {'[0-4)' : 0, '[4-8)' : 1, '[8-12)' : 2,
				  '[12- 16)' : 3, '[16-20)' : 4,
				  '[20-24)' : 5};
// Map text to a specific day the data
var diasConver = {Mon: 'lunes', Tue: 'martes',
				  Wen: 'miércoles', Thu:'jueves',
				  Fri: 'viernes', Sat: 'sábado',
				  Sun: 'domingo'};

var HoraInt = ['[0-4)', '[4-8)', '[8-12)',
			   '[12- 16)', '[16-20)', '[20-24)'];

// Add title to explain each buttons
d3.select('svg')
	.append('text')
	.attr('x', 150)
	.attr('y', 25)
	.attr('class', 'title')
	.text('Time of Day (Hours)');
d3.select('svg')
	.append('text')
	.attr('x', 10)
	.attr('y', 25)
	.attr('class', 'title')
	.text('Day of Week');

// Hour buttons
var hora = svg.selectAll('g')
	.data(HoraInt)
	.enter()
	.append('g')
	.attr('transform', function(d, i){
		return 'translate(150, ' +
			(i*20 + padDia) +
			')';
	});
hora.append('rect')
	.attr("width", 110)
	.attr("height", ls_h)
	.attr('class', 'rectangleH')
	.attr('dy', '.35em')
	.attr('id', function(d, i){
		return 'Hora' + i;})
	.on('click', function(d){
		d3.selectAll('rect.rectangleH').transition()
			.duration(300)
			.style("fill", "#333");
		d3.select(this).transition().duration(300)
			.style("fill", "#FFD700");
		horaGlob = d;
		printMap();
	});
hora.append('text')
	.attr('x', 20)
	.attr('y', 15)
	.attr('width', ls_w)
	.attr('heigth', ls_h)
	.attr('fill', 'white')
	.text(function(d) { 
		return d;})
	.on('click', function(d, i){
		d3.selectAll('rect.rectangleH').transition()
			.duration(300)
			.style("fill", "#333");
		d3.select('rect#Hora' + i).transition().duration(300)
			.style("fill", "#FFD700");
		horaGlob = d;
		printMap();
	});

var diasSem = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri',
			   'Sat', 'Sun'];
var dias = svg.selectAll('g.rectangle')
	.data(diasSem)
	.enter()
	.append('g')
	.attr('transform', function(d, i){
		return 'translate(0, ' +
			(i*20 + padDia) +
			')';
	});
dias.append('rect')
	.attr("width", 110)
	.attr("height", ls_h)
	.attr('class', 'rectangle')
	.attr('id', function(d){
		return d;})
	.attr('dy', '.35em')
	.on('click', function(d){
		d3.selectAll('rect.rectangle').transition()
			.duration(300)
			.style("fill", "#333");
		d3.select(this).transition().duration(300)
			.style("fill", "#FFD700");
		diaGlob = d;
		printMap();
	});
dias.append('text')
	.attr('x', 20)
	.attr('y', 15)
	.attr('width', ls_w)
	.attr('heigth', ls_h)
	.attr('fill', 'white')
	.text(function(d) { 
		return d;})
	.on('click', function(d){
		d3.selectAll('rect.rectangle').transition()
			.duration(300)
			.style("fill", "#333");
		d3.select('rect#' + d).transition().duration(300)
			.style("fill", "#FFD700");
		diaGlob = d;
		printMap();
	});

// Lables and range of colors
var homRan = [5, 10, 20, 50, 100, 150, 200];
var legend_labels = ["< 5", "(5 -10]",
					 "(10 - 20]", "(20 - 50]",
					 "(50 - 100]", "(100 - 150]",
					 "> 200"];
var colrRan = ['#ffffe0','#ffd59b','#ffa474',
			   '#f47461', '#db4551','#b81b34',
			   '#8b0000'];
var colors = d3.scale.threshold()
	.domain(homRan)
	.range(colrRan);
var legend = svg.selectAll("g.legend")
	.data(homRan)
	.enter().append("g")
	.attr("class", "legend");
legend.append("rect")
	.attr("x", width - 150)
	.attr("y", function(d, i){
		return (i*ls_h) + 30;})
	.attr("width", ls_w)
	.attr("height", ls_h)
	.style("fill", function(d, i) {
		return colors(d); })
	.style("opacity", 0.8);
legend.append("text")
	.attr("x", width-120)
	.attr("y", function(d, i){
		return (i*ls_h) + 49;})
	.text(function(d, i){
		return legend_labels[i]; });
d3.select('svg')
	.append('text')
	.attr('x', width -150)
	.attr('y', 25)
	.attr('class', 'title')
	.text('Homicides (#)');
var play = d3.select('svg')
	.append('g')
	.attr('transform', 'translate(0, 200)');
play.append('rect')
	.attr("width", 110)
	.attr("height", ls_h)
	.attr('class', 'rectangleP')
	.on('click', function(d){
		playMap(1000);
	});
play.append('text')
	.attr('x', 20)
	.attr('y', 15)
	.attr('fill', 'white')
	.attr('width', ls_w)
	.attr('heigth', ls_h)
	.text('Play');
d3.json('localidades_bogota.geojson', draw);
startAnimation(1000)
