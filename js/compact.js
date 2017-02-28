$(document).ready(function(){

	
	function loadContents (){
		cargarDiscos();
		cargarAlabes();
		cargarNgvs();
		getBufferDiscos();
		getBufferAlabes();
		getBufferNgvs();
		getCajasVaciasDiscos();
		getCajasVaciasAlabes();
		getCajasVaciasNgvs();


	}

	function pasaPantallaIp (){
		window.location = 'http://10.1.0.52/avisos/almacen-compact-ip.html';
	}
	loadContents();

	var keepAlive = setInterval(pasaPantallaIp, 20000);


	//BOTON IMAGEN LINDE (SUMINISTRAR)
	var $body = $('body');
	$body.on('click', 'a.suministraralabe', suministrarAlabe);

	$body.on('click', 'a.suministrardisco', suministrarDisco);

	$body.on('click', 'a.suministrarngv', suministrarNgv);

	$body.on('click', 'a.limpia-ngvs', function(e){
		e.preventDefault();
		$('.limpiarvaciasngvs').dialog('open');
	});

	$body.on('click', 'a.limpia-alabes', function(e){
		e.preventDefault();
		$('.limpiarvaciasalabes').dialog('open');
	});

	$body.on('click', 'span.deshacer-discos', function(e){
		e.preventDefault();
		$('.deshacerDiscos').dialog('open');
	});	

	$body.on('click', 'span.deshacer-alabes', function(e){
		e.preventDefault();
		$('.deshacerAlabes').dialog('open');
	});	

	$body.on('click', 'a.limpia-discos', function(e){
		e.preventDefault();
		$('.limpiarvaciasdiscos').dialog('open');
	});
		

	//PULSAR ICONO SIN STOCK PARA PONER EN STOCK ALABES
	$body.on('click', 'tbody.resultadosalabes i.fa', function(){
		var id=$(this).parent().parent().data('id'); 
		//cogemos el nameplate del texto del primer td
		var nameplate=$(this).parent().parent().find('td:eq(0)').text();
		var etapa=$(this).parent().parent().find('td:eq(1)').text();
		//pasamos los atributos data al dialog
		$('.setstockalabes').data('id', id).append('<p>'+etapa + ' '+nameplate+'</p>').dialog('open');

	});	

	//PULSAR ICONO SIN STOCK PARA PONER EN STOCK DISCO
	$body.on('click', 'tbody.resultadosdiscos i.fa', function(){
		var id=$(this).parent().parent().data('id'); 
		//cogemos el nameplate del texto del primer td
		var nameplate=$(this).parent().parent().find('td:eq(0)').text();
		var etapa=$(this).parent().parent().find('td:eq(1)').text();
		//pasamos los atributos data al dialog
		$('.setstockdiscos').data('id', id).append('<p>'+etapa + ' '+nameplate+'</p>').dialog('open');

	});	

	//VACIAR UN HUECO DEL BUFFER MANUALMENTE 
	
	$('span.adddisco').on('click', function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {addisco: 1}
				})
			.done(function(){
				getBufferDiscos();
			});
	});	

	$('span.addalabes').on('click', function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {addalabes: 1}
				})
			.done(function(){
				getBufferAlabes();
			});
	});		 

	$('span.addngv').on('click', function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {addngv: 1}
				})
			.done(function(){
				getBufferNgvs();
			});
	});		

	 $('body').on('click', '.ocupadadisco',function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removedisco: 1}
				})
			.done(function(){
				getBufferDiscos();
			});
	});		

	 $('body').on('click', '.ocupadaalabes',function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removealabes: 1}
				})
			.done(function(){
				getBufferAlabes();
			});
	});	

	 $('body').on('click', '.ocupadaalabescurvico',function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removealabescurvico: 1}
				})
			.done(function(){
				getBufferAlabes();
			});
	});	 
	 $('body').on('click', '.ocupadangv',function(){
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removengv: 1}
				})
			.done(function(){
				getBufferNgvs();
			});
	});		 

	$('button.refresh').on('click', function(){
		location.reload(true);
	});	
//*************funciones**************************
	function cargarDiscos(){
		$('.resultadosdiscos').load('almacen.php', {alldiscossincarretilla: "true"});		
	}

	function cargarAlabes(){
		$('.resultadosalabes').load('almacen.php', {allalabessincarretilla: "true"});		
	}

	function cargarNgvs(){
		$('.resultadosngvs').load('almacen.php', {allngvssincarretilla: "true"});		
	}	

	function suministrarDisco(e){
		e.preventDefault();
		var id = $(this).attr('href');
		var nameplate = $(this).closest('tr').find('td:eq(0)').text();
		var etapa = $(this).closest('tr').find('td:eq(1)').text().substring(6).trim();
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {suministrardisco: true, id:id, nameplate: nameplate, etapa: etapa},
			dataType: 'json'

			})
		.done(function(data){
				console.log(nameplate);//********************************
				console.log(etapa);//***********************************************
				if (data.error===1){
					$('.bufferdiscoslleno').dialog('open');
				}
				else {
					$('.resultadosdiscos').load('almacen.php', {alldiscos: "true"});
					getBufferDiscos();
				}	
			});
		}
	function suministrarNgv(e){
		e.preventDefault();
		var id = $(this).attr('href');
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {suministrarngv: true, id:id},
			dataType: 'json'

			})
		.done(function(data){
				if (data.error===1){
					$('.bufferngvslleno').dialog('open');
				}
				else {
					$('.resultadosngvs').load('almacen.php', {allngvs: "true"});
					getBufferNgvs();
				}	
			});
		}		
	function getBufferDiscos(){
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {bufferdiscos: true},
			dataType: 'json'
		})
		.done(
			function(data){
				
				var num= parseInt(data.discos);
				var empty = 6-num;

					//Funcion que vacía el div con las imagenes de las cajas de discos del buffer y las rellena con la base de datos.
					$('.bufferdiscos').empty().html(function(){
						var botones='';
						for (var i=0; i<num; i++){
							botones+='<button class="ocupadadisco"><img src="img/box-peque-min.png" /></button>';
						}
						// for (var i2=0; i2<nopeque; i2++){
						// 	$('.bufferdiscos').append('<img src="img/box-peque-empty.png" />');
						// }

						for (var h=0; h<empty; h++){
							botones+='<button><img src="img/empty-min.png" /></button>';
						}
						return botones;								
					});

			});		
	}	

	function getBufferAlabes(){
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {bufferalabes: true},
			dataType: 'json'
		})
		.done(
			function(data){
				var numalabes= parseInt(data.alabes);
				var numcurvicos=parseInt(data.alabes_curvico);//numero de cajas con álabes que hay en el buffer
				var vacias = 6-numalabes-numcurvicos;//huecos vacios en el buffer
				//Funcion que vacía el div con las imagenes de las cajas de discos del buffer y las rellena con la base de datos.
				$('.bufferalabes').empty().html(function(){
					var elementos='';
					for (var i=0; i<numalabes; i++){
						elementos+='<button class="ocupadaalabes"><img src="img/box-blades-min.png" /></button>';
					}
					for (var h=0; h<numcurvicos; h++){
						elementos+='<button class="ocupadaalabescurvico"><img src="img/box-blades-curvicos-min.png" /></button>';
					}
					for (var j=0; j<vacias; j++){
					//evita que se dibujen más de 6 cajas si numalabes es negativo.	
						if (j===6) {
							break;
						}
						elementos+='<button><img src="img/box-blades-empty-min.png" /></button>';
					}
					if(data.alabes_curvico==0){
						elementos+='<p class="alabes-curvico-vacio"><span class="glyphicon glyphicon-exclamation-sign"></span> Juegos de álabes de cúrvicos disponibles en buffer: '+data.alabes_curvico+'</p>';
					}
					return elementos;
						
				});
		});		
	}

	function getBufferNgvs(){
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {bufferngvs: true},
			dataType: 'json'
		})
		.done(
			function(data){
				var numngvs= parseInt(data.ngvs); //numero de ngvs que hay en el buffer
				var vacias = 6-numngvs;
				//Funcion que vacía el div con las imagenes de las cajas de discos del buffer y las rellena con la base de datos.
				$('.bufferngvs').empty().html(function(){
					for (var i=0; i<numngvs; i++){
						$('.bufferngvs').append('<button class="ocupadangv"><img src="img/box-ngv-min.png" /></button>');
					}
					for (var j=0; j<vacias; j++){
						if (j===6) {break;}	//evita que se dibujen más de 6 huecos vacios en caso de que numngvs sea negativo.
						$('.bufferngvs').append('<button><img src="img/box-ngv-empty-min.png" /></button>');
					}

				});
		});		
	}				

	function suministrarAlabe(e){
		e.preventDefault();
		var id = $(this).attr('href');
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {suministraralabe: true, id:id},
			dataType: 'json'
		}).done(function(data){
			if (data.error==0){
				$('.resultadosalabes').load('almacen.php', {allalabes: "true"});
				getBufferAlabes();
			}
			else {
				$('.bufferalabeslleno').dialog('open');
			}	
		});		
	}

	function setStockAlabes (id){
    	$.post('programador.php', {sistockalabes: id}, function(){
    		cargarAlabes();
    	});

	}	

	function setStockDisco (id){
    	$.post('programador.php', {sistockdisco: id}, function(){
    		cargarDiscos();
    	});

	}	

	function getCajasVaciasDiscos () {
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {getvaciasdiscos: true},
			dataType: 'json'
		}).done(function(data){
				var numcajas = parseInt(data.vacias);
				var imagenes=$('.cajasvacias-discos').find('img').length;
				var $cajasvacias=$('.cajasvacias-discos');
				//if (numcajas > 0 && numcajas !==null && numcajas>imagenes) {
					$cajasvacias.find('img').remove(); //si el numero de cajas vacias es mayor al ya dibujado, eliminamos todas las imagenes y las insertamos una a una de nuevo.
					for (var i=0; i<numcajas; i++){
						$cajasvacias.append('<img src="img/empty-box-min.png" />');
					}
				//}
			});
	}

	function getCajasVaciasAlabes () {
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {getvaciasalabes: true},
			dataType: 'json'
		}).done(function(data){
				var numcajas = parseInt(data.vacias);
				var imagenes=$('.cajasvacias-alabes').find('img').length;				
				//if (numcajas > 0 && numcajas !==null && numcajas>imagenes) {
					$('.cajasvacias-alabes').find('img').remove();
					for (var i=0; i<numcajas; i++){
						$('.cajasvacias-alabes').append('<img src="img/empty-box-min.png" />');
					}
				//}
			});
	}

	function getCajasVaciasNgvs () {
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {getvaciasngvs: true},
			dataType: 'json'
		}).done(function(data){
				var numcajas = parseInt(data.vacias);
				var imagenes=$('.cajasvacias-ngvs').find('img').length;
				//if (numcajas > 0 && numcajas !==null && numcajas>imagenes) {
					$('.cajasvacias-ngvs').find('img').remove();
					for (var i=0; i<numcajas; i++){
						$('.cajasvacias-ngvs').append('<img src="img/empty-box-min.png" />');
					}
				//}
			});
	}	

	function limpiarCajasNgvs (){
		$.post('almacen.php', {limpiarvaciasngvs: true}, function(){getCajasVaciasNgvs();});
	}

	function limpiarCajasAlabes (){
		$.post('almacen.php', {limpiarvaciasalabes: true}, function(){getCajasVaciasAlabes();});
	}

	function limpiarCajasDiscos (){
		$.post('almacen.php', {limpiarvaciasdiscos: true}, function(){getCajasVaciasDiscos();});
	}

	function deshacerSuministroDisco () {
		$.post('almacen.php', {deshacerdisco: true}, function(){cargarDiscos(); getBufferDiscos();});
	}	

	function deshacerSuministroAlabes () {
		$.post('almacen.php', {deshaceralabes: true}, function(){cargarAlabes(); getBufferAlabes();});
	}		



//*************DIALOGS INICIALIZACIÓN*******************//

$('.bufferdiscoslleno').dialog({
	title: 'Buffer discos lleno',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function (){
			$(this).dialog('close');
		}
	}
});

$('.bufferalabeslleno').dialog({
	title: 'Buffer alabes lleno',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function (){
			$(this).dialog('close');
		}
	}
});

$('.bufferngvslleno').dialog({
	title: 'Buffer NGVS lleno',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function (){
			$(this).dialog('close');
		}
	}
});

$('.setstockalabes').dialog({
	title: 'Poner en stock',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			var id=$(this).data('id');
			setStockAlabes(id);
			$(this).dialog('close');
		}
	}
});

$('.setstockdiscos').dialog({
	title: 'Poner en stock',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			var id=$(this).data('id');
			setStockDisco(id);
			$(this).dialog('close');
		}
	}
});

$('.limpiarvaciasngvs').dialog({
	title: 'Limpiar cajas vacías NGV\'S',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			limpiarCajasNgvs();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
});

$('.limpiarvaciasalabes').dialog({
	title: 'Limpiar cajas vacías álabes',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			limpiarCajasAlabes();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
});

$('.limpiarvaciasdiscos').dialog({
	title: 'Limpiar cajas vacías discos',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			limpiarCajasDiscos();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
});

$('.deshacerDiscos').dialog({
	title: 'Deshacer Suministro Discos',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			deshacerSuministroDisco();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
});

$('.deshacerAlabes').dialog({
	title: 'Deshacer Suministro Alabes',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			deshacerSuministroAlabes();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
});

//TOOLTIP PARA EL BOTON DE AYUDA (MANUAL PDF)
$(".nolink").tooltip();





});