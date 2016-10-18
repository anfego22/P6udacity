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
