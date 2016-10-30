function printMap(){
	diasConver = {Mon: 'lunes', Tue: 'martes',
				  Wen: 'miércoles', Thu:'jueves',
				  Fri: 'viernes', Sat: 'sábado',
				  Sun: 'domingo'}
	dia = diasConver[diaGlob]
	d3.csv('Bogota.csv', function(crimData){
		crimData = crimData.filter(function(d) {
			return d.Dia == dia &&
				d.HoraInt == horaGlob;
		});
		function getHom(localidad){
			var hom = crimData.filter(function(d){
				return d.Localidad == localidad;})
			if(hom.length != 0){
				return colors(hom[0].Homicidios);
			} else {
				return 'snow';
			}
		}
		svg.selectAll('path')
			.transition()
			.delay(100)
			.style('fill', function(d){
				return getHom(d.properties.name);
			});
	})
}

function playMap(dur){
	d3.selectAll('rect.rectangle').transition()
		.duration(300)
		.style("fill", "#333");
	d3.select('rect#' + diaGlob).
		transition().duration(300)
		.style("fill", "#FFD700");
	var hour_index = 0;
	var colorHour = setInterval(function(){
		horaGlob = HoraInt[hour_index]
		d3.selectAll('rect.rectangleH').
			transition().duration(300)
			.style('fill', '#333');
		d3.selectAll('#' +'Hora'+ hour_index)
			.transition().duration(300)
			.style('fill', '#FFD700');
		printMap();
		hour_index++;
		if(hour_index >= HoraInt.length){
			clearInterval(colorHour);
		}
	}, dur);
}

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
	}, dur*7 + 50);
}
