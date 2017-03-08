$(document).ready(function(){

	//VARIABLES GLOBALES	
	var bloquear = false;
	var contador=0;
	
	//FECHA EN TITULO H1
	var d =new Date();
	var dia = d.getDate();
	var mes = d.getMonth()+1;
	var year = d.getFullYear();
	if (mes<10){
		mes = '0'+mes;
	}

	if (dia<10){
		dia = '0'+dia;
	}	
	$('h1').append(' <small><i class="fa fa-calendar"></i>&nbsp' +dia+'/'+mes+'/'+year + '</small>');	

	//CARGA DATOS DE INSPECCIONES SIN INICIAR O INICIADAS (PERO NO FINALIZADAS) VIA AJAX

	function nofinalizadas (){
		$('tbody.tabla1').load('funciones.php', {tabla:1});
	}

	nofinalizadas();

	//DESHACER AL PULSAR EL ICONO EN INSPECCIONES PENDIENTES O INICIADAS

	$('body').on('click','a.deshacer', function(e){
		e.preventDefault();
		var elemento = $(this).attr('href');
		var inspector = $.trim($(this).parent().parent().find('td:eq(7)').text());
		$('div#des').find('span#inspector').text(inspector);
		

		function deshacer (){
			$.ajax({
			url: "funciones.php",
			data: {deshacer_id: elemento },
			dataType: 'json',
			type:"POST",
			 success: function(data){
			 	if (data.eliminado===1) {
			 		$('tbody.tabla1').empty();
			 		$('tbody.tabla1').load('funciones.php', {tabla:1});
			 	}
			 }
			});
		}

		$('div#des').dialog ({
			autoOpen: false,
			modal: true,
			title: 'Deshacer inicio de inspección',
			buttons: {
				'DESHACER': function(){
					$(this).dialog('close');
					deshacer();
					},
				'CANCELAR': function(){ $(this).dialog('close');}
			}
		});
		$('div#des').dialog('open');


	});


	//CARGA DATOS DE INSPECCIONES FINALIZADAS VIA AJAX

	function finalizadas (){
		$('tbody.tabla2').load('funciones.php', {tabla:2}, function(){
			if($('.panel-heading h4 span.label').length>0) {
				$('.panel-heading h4 span.label').remove();
				}
			$('.panel-heading h4').append('<span class="label label-default fecha-finalizadas" id="labelfecha">' +dia+'/'+mes+'/'+year + '</span>');

		});	
	}
	finalizadas();
	//CARGAR INSPECTORES DE LA BASE DE DATOS

	$('select#inspectores').load('funciones.php', {select_inspectores: true});



	//REFRESCO CADA 60 SEGUNDOS DE INSPECCIONES FINALIZADAS Y NO FINALIZADAS

	setInterval(function(){
		$('div.cargando').css('opacity', '.8').fadeIn(200, function(){
			$('div.cargando').fadeOut(2000);
		});
		//Si la variable bloquear está en false (no se han cargado inspecciones finalizadas de otras fechas), refrecar también las no finalizadas.
		//Si es true, es que alguien está consultando otras fechas y mejor no refrescar las no finalizadas. Se suma 1 a un contador cada 60 seg. hasta llegar a 9.
		//Cuando bloquear es verdadero y el contador llega a 9, se resetea a 0, se pone bloquear a false y se refrescan normalmente las finalizadas.
		if (!bloquear) {
			finalizadas();
		}	
		else {
			if (contador===9){
				contador=0;
				bloquear=false;
				finalizadas();
			}
			else {
				contador++;
			}
		}
		nofinalizadas();
		//$('tbody.tabla1').load('funciones.php', {'tabla':1});
		//$('tbody.tabla2').load('funciones.php', {'tabla':2});
		

	}, 60000);

	
	//BOTON INICIAR
	
	$('body').on('click', 'a.iniciar', function(e){

		e.preventDefault();
		var btn =$(this);
		var id=$(this).attr('href');
		var inspector=$('div#inspector select').val();

		//peticion inicial AJAX para ver si la inspección está ocupada
		$.ajax({
			url:"funciones.php",
			type:"POST",
			data: {id:id},
			dataType: 'json'
		}).done(function(data){
			if(data.ocupado==1) {
					$("div#ocupado").dialog({
						autoOpen: false,
						modal: true,
						title: 'Inspección no disponible',
						buttons: {
						"Cerrar": function () {
							$(this).dialog("close");
							location.reload();
							}
						}
					});
				$('div#ocupado').dialog('open');
			}

			else {
				
				$('div#inspector').dialog ({
					autoOpen: false,
					modal: true,
					title: 'Seleccionar inspector',
					buttons: {
						'OK': function(){

							var inspector =$('div#inspector select').val();
							
							if (inspector!=='' && inspector !==null) {	
								$.ajax({
									url: "funciones.php",
									type: "POST",
									data: {inspector: inspector, id: id}
								}).done(function(){
	
									$('div#inspector').dialog("close");
									location.reload();
								});
							}
							else {
								$('#div#inspector button').prop('disabled', true);
							}
						}
					}
				});
				$('div#inspector').dialog('open');


			}

		});


	});

	//BOTÓN FINALIZAR QUE ABRE DIALOG DE CONFIRMACIÓN Y FINALIZA LA INSPECCIÓN

	$('body').on('click', 'a.finalizar', function(e){
		e.preventDefault();
		var id=$(this).attr('href');
		var pieza=$(this).parent().parent().find('td:eq(1)').text();
	
		$('div#finalizar').dialog({
			autoOpen: false,
			modal: true,
			title: 'Finalizar inspección',
			buttons: {
				'OK': function (){
					$.ajax({
						url: 'funciones.php',
						type:'POST',
						data: {id:id, finalizar: true}
					}).done(function(){
						$('div#finalizar').dialog('close');
						location.reload();					
					});

				}
			}

		});

		$('div#finalizar').append ('<p>' + pieza + '</p>').dialog('open');
	
	});

// CONSULTAR OTRAS FECHAS

	//AL PRESIONAR EL BOTON 'VER OTRA FECHA', EL BOTÓN DESAPARECE Y APARECE UN DIV (.OTRAFECHA) CON UN INPUT PARA SELECCIONAR FECHA Y EL BOTON IR

	$('body').on('click', 'button.activaCalendario', function(e){
		e.preventDefault();
		$(this).fadeOut('normal', function(){
			$('div.otrafecha').fadeIn('normal');
		});
	});

	//DATEPICKER PARA INPUT (#CAMPOFECHA) 

	$('#campofecha').datepicker({
		dateFormat: "dd/mm/yy",
		maxDate: 0,
		monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
		dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ],
		firstDay: 1
	});

	//BOTON IR DEL INPUT SELECCIONAR FECHA

	$('body').on('click', 'button.verfecha', function(e){

		var fecha=$('input#campofecha').val();
		if (fecha!=='' && fecha!==null){
			//bloqueamos en caso de que se seleccione una fecha distinta a la actual para ver inspecciones no finalizadas.
			if (fecha!=dia+'/'+mes+'/'+year){
				bloquear=true;
			}
			$('tbody.tabla2').html('');
			$('tbody.tabla2').load('funciones.php', {tabla:'fecha', fecha:fecha});
			if($('.panel-heading h4 span.label').length>0) {
				$('.panel-heading h4 span.label').remove();
			}
			$('.panel-heading h4').append('<span class="label label-default fecha-finalizadas" id="labelfecha">'+fecha+'</span>');
			$('input#campofecha').val('');
			$('div.otrafecha').fadeOut('normal', function(){
				$('button.activaCalendario').fadeIn('slow');
			});


		}
		e.preventDefault();
	});


	

	//CAMBIAR ICONO COLLAPSIBLE EN HIDDEN O SHOWN

	$('#collapseOne').on('hidden.bs.collapse', function () {
		$('h4 a span').removeClass("glyphicon glyphicon-chevron-up").addClass("glyphicon glyphicon-chevron-down");
	});	

	$('#collapseOne').on('shown.bs.collapse', function () {
		$('h4 a span').removeClass("glyphicon glyphicon-chevron-down").addClass("glyphicon glyphicon-chevron-up");
	});	

	//BOTON EXPORTAR A EXCEL Y PDF
	
	$('body').on('click', 'a#excel', function(e){
		e.preventDefault();
		var fecha = $('span.fecha-finalizadas').text();
		var pagina_actual = location.href;
		window.open('./funciones/exportarexcel.php?fecha='+fecha, '', 'width=500, height=500', 'menubar=no', 'location=no', 'toolbar=no');
	
	});
	
	$('body').on('click', 'a#pdf', function(e){
		e.preventDefault();
		var fecha = $('span.fecha-finalizadas').text();
		var pagina_actual = location.href;
		window.open('./funciones/exportarPDF.php?fecha='+fecha, '', 'width=1000, height=700');
	
	});
	
	//DIALOGO DE INFORMACIÓN DE VERSIÓN
	
	$('div#dialog_version').dialog({
			autoOpen: false,
			modal: true,
			width: 500,
			title: 'Información',
			buttons: {
				'OK': function (){
					$(this).dialog('close');
	
				}
			}
	
		});
	
	$('body').on('click', 'a#version', function(e){
		e.preventDefault();
		$('div#dialog_version').dialog('open');
	});





});