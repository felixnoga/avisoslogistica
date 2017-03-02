$(document).ready(function(){

	toastr.options.progressBar=true;
	//PEDIR VIA AJAX EL PRIMER SELECT (ZONA) PARA LA PANTALLA DE LOS MONTADORES

	$('select#zona').load('funciones.php', {'cargar': 'zona'});
	

	
	// MOSTRAR SELECT MOTOR CUANDO SE SELECCIONA UNA ZONA	
	
	$("body").on("change", '#zona', function() {

		mostrar_motor();

	});

	//ELIMINAR TODOS LOS SELECTS MÁS ALLÁ DEL DE MOTOR, SI SE SELECCIONA DE NUEVO OTRO MOTOR

	$('body').on("change", "#motor", function(){
				
		$('.montaje').first().nextAll('.montaje').remove();

	});

	//DIALOG CONSUMIR NGV LP1 CORRECCION NAMEPLATE

	$('#confirmconsumirngvlp1 input').on('keyup', function(){
		reemplazarNameplateIp($('#confirmconsumirngvlp1 input'));		
	});

    $('#confirmconsumirsoporte input').on('keyup', function(){
        reemplazarNameplateIp($('#confirmconsumirsoporte input'));
    });

    $('#confirmconsumircaseip').on('keyup', function(){
        reemplazarNameplateIp($('#confirmconsumircaseip input'));
    });

	//DIALOG CONSUMIR NGV IP CORRECCION NAMEPLATE

	$('#confirmconsumirngvip input').on('keyup', function(){
		reemplazarNameplateIp($('#confirmconsumirngvip input'));		
	});

	//DIALOG CONSUMIR ALABES IP CORRECCION NAMEPLATE

	$('#confirmconsumiralabeip input').on('keyup', function(){
		reemplazarNameplateIp($('#confirmconsumiralabeip input'));		
	});

	//FUNCION PARA SOLICITAR LISTA DE MOTORES DE LA BASE DE DATOS VIA AJAX
	
	function mostrar_motor(){
			
			$.ajax({
				url: "funciones.php",
				type: "POST",
				data: {pedir: "motor"},
				success: function(data){
					$('.zona').nextAll('.montaje').remove();								
					$("form.formulario").append(data);
					$('.motor').fadeIn();
					mostrar_piezas();
				}
			});			
		
	}

	//FUNCION PARA SOLICITAR LISTA DE PIEZAS DE LA BASE DE DATOS VIA AJAX (UNA VEZ SE HA SELECCIONADO EL MOTOR)
	
	function mostrar_piezas(){

		$("body").on("change", "#motor", function(){

			var puesto_id = $("select#zona").val();
			var tipo = $(this).val();
			$.ajax({
				url: "funciones.php",
				type: "POST",
				data: {motor: tipo, zona: puesto_id},
				success: function(data){
					if($('.pieza').length) {
						$('.pieza').remove();
					}
					$("form.formulario").append(data);
					$('.pieza').fadeIn();
					solicitar_nombre();
					
				}
			});	
				
		});			
	}

	//FUNCION PARA SOLICITAR EL INPUT DONDE SE INTRODUCE EL NOMBRE DEL MONTADOR QUE SOLICITA LA INSPECCIÓN (ESTE INPUT SOLO SE MOSTRARÁ SI SE HAN SELECCIONADO LA ZONA, EL MOTOR Y LA PIEZA Y SI EL INPUT NO ESTÁ EN BLANCO)
	
	function solicitar_nombre(){
		
		$("#pieza").on("change", function(){

			var part = $("select#pieza").val();
			$.ajax({
				url: "funciones.php",
				type: "POST",
				data: {pieza: part},
				success: function(data){
					var patt700=/D[EH][0-9]{4}R?$/i; //Se añade R final opcional por si hay reproceso
					var patt900=/HH[0-9]{4}R?$/i;
					var patt1000=/MG[0-9]{4}R?$/i;
					var pattxwb=/XG[0-9]{4}R?$/i;
					var patdes=/^[JSRBYNPU]{1}.{3,}/i;
					var $input;
					
					if ($('input[name="nameplate"]').length===0){
						$("form.formulario").append(data);
						$('.nameplate, .of').fadeIn();

					}
					$('body').on('keyup', 'input[name="nameplate"]', function(){
						$input =$('input[name="nameplate"]');
						if ($input.val().length>3){
							$input.on('keyup', function(){
								reemplazar($input.val(), $input);/**************/
								//si el input del nameplate coincide con los patterns, se muestra el campo nombre
								if (patt700.test($input.val()) || patt900.test($input.val()) || patt1000.test($input.val()) || pattxwb.test($input.val()) || patdes.test($input.val())){
									if (patdes.test($input.val())){
										var desarr=$input.val().toUpperCase();
										$input.val(desarr);
									}
									if ($('.nameplate').hasClass('has-error')){
										$('.nameplate').removeClass('has-error');
									}
									$('.nombre').fadeIn();		
								}
								else {
									$('.nameplate').addClass('has-error');
										if($('.nombre').length){
											$('.nombre').fadeOut();
										}
								}
							});
						}
						else {
							$('input[name="nombre"]').val('');
							$('.nombre').fadeOut();
							if ($('button').length>0){
								$('button').remove();

							}
						}

					});
					
					$('body').on('keyup', $('input[name="of"]'), function(){
						if (!/^[0-9]{9}$/.test($('input[name="of"]').val())) {
							$('input[name="of"]').parent().addClass('has-error');													
						}
						else {
							$('input[name="of"]').parent().removeClass('has-error');
							if ($('.of').find('span.error').length){
								$('.of').find('span.error').remove();
							}
						}
					});

					$('input[name="of"]').on('focus', function(){
							$(this).val(22355);
					});

					$('input[name="nombre"]').on("focusin", function(){

						if (!/^[0-9]{9}$/.test($('input[name="of"]').val())) {
							$('input[name="of"]').val('');
						}	
					});

					$('input[name="nombre"]').on("keyup", function(){

						if (!/^\d/.test($('input[name="nombre"]').val()) && $('.nonumerico').length===0){
							$('.nombre').append('<strong class="error nonumerico"> Solo se permite el número de usuario</strong>');
							$('input[name="nombre"]').val('');
						}
						else {
							if ($('.nonumerico').length!==0){
								$('.nonumerico').remove();

							}
						}

						if (!/^[0-9]{9}$/.test($('input[name="of"]').val()) && !$('.of').find('span.error').length) {
							$('input[name="of"]').val('');
							$('.of').append('<span class="error"> OF incorrecta</span>');

						}

						if ($(this).val().length>2 && $('button').length<1){
						//evitar que el botón aparezca más veces al borrar
							$('form.formulario').append('<div class="form-group"><button type="button" class="btn btn-primary btn-lg enviar">Enviar</button></div>');

						}	

						if ($(this).val().length>2 && $('button').length>0){
							$('button').fadeIn();
						}

						if ($(this).val().length<3 && $('button').length>0) {
							$('button').fadeOut();

						}

					});
				}
			});			
		});

	}



	//ENVIAR TODOS LOS DATOS VIA AJAX PARA INSERTARLOS EN LA BASE DE DATOS 

	$('body').on("click", "button.enviar", function(e){
		e.preventDefault();

		var part = $("select#pieza").val();
		var tipo = $("select#motor").val();
		var puesto_id = $("select#zona").val();
		var plate= $('input[name="nameplate"]').val();
		var mont= $('input[name="nombre"]').val();
		var of = $('input[name="of"]').val();
	
		$.ajax({
			url: "funciones.php",
			type: "POST",
			data: {eng: tipo, loc: puesto_id, part: part, montador: mont, enviado: "enviado", plate: plate, of: of},
			success: function(data){

				//Para ruedas y estático existen dos casos:
				//1. Que la inspección ya exista: se devuelve contador=1
				//2. Que la inspección no exista: NO se devuelve nada, ni data.contador ni otro json (data==undefined)
				//Por esos se chequea que data!=undefined, para evitar el error javascript si se da el 2º caso,
				//ya que al pasar por el primer if, daría error puesto que data.contador en UNDEFINED.
				//Para Discos, NgVS, Disco/Eje inicial, Case IP, 1er bearing, Turbina final con álabes, se recibe respuesta json que no es contador 
				//(para no recibir json contador y su propio json y recibir dos respuestas diferentes)

				if (data!=undefined && data.contador==1){

					toastr.warning('Este aviso ya se puso con anterioridad. Si quieres forzar el aviso, incluye al final del número de serie del módulo una "R".', 'Aviso duplicado');
					$('.zona').nextAll('.form-group').remove();
					$('#zona option:eq(0)').prop('selected', true);

				}
				else {

					toastr.success('Aviso enviado correctamente.', 'Aviso enviado');
					$('.zona').nextAll('.form-group').remove();
					$('#zona option:eq(0)').prop('selected', true);

				}
                
					
			}
		});
	});

	//ENVIAR TODOS LOS DATOS VIA AJAX AL PRESIONAR ENTER EN LUGAR DEL BOTON ENVIAR

	$('body').on("keyup", 'input[name="nombre"]', function(e) {
		if (e.which == 13 && $('input[name="nombre"]').length>0){
			var part = $("select#pieza").val();
			var tipo = $("select#motor").val();
			var puesto_id = $("select#zona").val();
			var mont= $('input[name="nombre"]').val();
			var plate= $('input[name="nameplate"]').val();
			var of = $('input[name="of"]').val();

	
			if($('input[name="nameplate"]').val().length>3 && $('input[name="nombre"]').val().length>2) {

				$.ajax({
					url: "funciones.php",
					type: "POST",
					data: {eng: tipo, loc: puesto_id, part: part, montador: mont, enviado: "enviado", plate: plate, of: of},
					success: function(data){

						if (data!=undefined && data.contador==1){
							toastr.warning('Este aviso ya se puso con anterioridad. Si quieres forzar el aviso, incluye al final del número de serie del módulo una "R".', 'Aviso duplicado');
							$('.zona').nextAll('.form-group').remove();
							$('#zona option:eq(0)').prop('selected', true);
		
						}
						else {
							toastr.success('Aviso enviado correctamente.', 'Aviso enviado');
							$('.zona').nextAll('.form-group').remove();
							$('#zona option:eq(0)').prop('selected', true);
						}
					}
				});
			}	
		}
	});

	//MANEJAR ERROR DE COMENZAR A INTRODUCIR EL NAMEPLATE EN SU CAMPO CON CARACTER NUMÉRICO EN LUGAR DE LETRA

	$(document).on("keyup", 'input.nameplate', abreError);

	function abreError (){
		
			if(/^[^A-Za-z]/.test($('input[name="nameplate"]').val())){
				$('div#error-numero').dialog({
					autoOpen: false,
					modal: true,
					closeOnEscape: true,
					title: 'Error',
					buttons: {
						'CERRAR': function(e){$(this).dialog('close'); e.preventDefault();}
					}	
				});	

				$('div#error-numero').dialog('open');

				$('input[name="nameplate"]').val('');
			}

	}

	//PREVIENE QUE AL PULSAR LA TECLA ENTER EL FORMULARIO SE ENVIE (COMPORTAMIENTO DEFAULT DE LOS NAVEGADORES)	
	//SIN ESTE EVENT HANDLER, CADA VEZ QUE SE PULSA ENTER EL FORMULARIO SE ENVIA Y SE REFRESCA LA PAGINA
	//MOSTRANDO DE NUEVO EL FORMULARIO EN LUGAR DE REDIRIGIRSE (SUCCESS AJAX) A OK.HTML

	$('form').on('submit', function(event) {

     return false;
	});
	//SOLICITAR EJE
	var $inputeje = $('input#nameplate-eje');
    $('.btn-solicitar-eje').prop('disabled', true);
	$('body').on('keyup', $inputeje, function(){
		if($inputeje.val().length>3) {
			$('.btn-solicitar-eje').prop('disabled', false);
		}
        reemplazar($inputeje.val(), $inputeje);
	});
    $('body').on('click', '.btn-solicitar-eje', function(){
    	var nameplate = $('#nameplate-eje').val();
    	$.post('almacen.php', {solicitareje:1, nameplate: nameplate})
			.done (function () {
				$('#solicitar-eje').modal('hide');
            });
	});

    //SOLICITAR CARCASA LPT
    var $inputcarcasa = $('input#nameplate-carcasa');
    $('.btn-solicitar-carcasa').prop('disabled', true);
    $('body').on('keyup', $inputcarcasa, function(){
        if($inputcarcasa.val().length>3) {
            $('.btn-solicitar-carcasa').prop('disabled', false);
        }
        reemplazar($inputcarcasa.val(), $inputcarcasa);
    });
    $('body').on('click', '.btn-solicitar-carcasa', function(){
        var nameplate = $('#nameplate-carcasa').val();
        $.post('almacen.php', {solicitarcarcasa:1, nameplate: nameplate})
            .done (function () {
                $('#solicitar-carcasa').modal('hide');
            });
    });

    //SOLICITAR TBH
    var $inputtbh = $('input#nameplate-tbh');
    $('.btn-solicitar-tbh').prop('disabled', true);
    $('body').on('keyup', $inputtbh, function(){
        if($inputtbh.val().length>3) {
            $('.btn-solicitar-tbh').prop('disabled', false);
        }
        reemplazar($inputtbh.val(), $inputtbh);
    });
    $('body').on('click', '.btn-solicitar-tbh', function(){
        var nameplate = $('#nameplate-tbh').val();
        $.post('almacen.php', {solicitartbh:1, nameplate: nameplate})
            .done (function () {
                $('#solicitar-tbh').modal('hide');
            });
    });

    //MODAL QUE MUESTRA LOS DISCOS PARA CONSUMIR
    $('body').on('click', 'a[href="consumo-disco"]', function(e){
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		if(!$('.listado-discos').is(':visible')) {
            $('.listado-discos').fadeIn();
		}    
		if($('.nameplate-listado span.error').length) {
            $('.nameplate-listado span.error').remove();
		}  		     
        $('#nameplate-listado-discos').val('');
        $.post('almacen.php', {discosparaconsumir: true})
            .done(function (data) {
                if (data.length>0) {
                    var num= data.length;

                    //Funcion que vacía el div con las imagenes de las cajas de discos del buffer y las rellena con la base de datos.
                    $('.listado-discos').html(function(){
                    	return colorearBotones('disco', data);	
                    });
                }
            });
    });

    $('body').on('click', '.listado-en-buffer', function () {
		var id = $(this).attr('id');
		$('#trabajando').modal('show');
		$.post('almacen.php', {quitarbuffer: 1, id: id})
			.done(function(data){
			$('#trabajando').modal('hide');				
                if (data.length>0) {
                    var num= data.length;                    
                }
                    $('#consumo-discos').modal('hide');
                    $('#ok-consumo-discos').modal('show');
			});
    });

    $('body').on('click', '.enviar-consumo-disco', function () {
        var nameplate = $('#nameplate-listado-discos').val();
        var etapa = $('#etapa-listado-discos').val();
		$('#trabajando').modal('show');        
        $.post('almacen.php', {quitarbufferysuministro: 1,  nameplate: nameplate, etapa: etapa})
            .done(function(data){
				$('#trabajando').modal('hide');            	
                if (data.error==0) {
                	$('#consumo-discos').modal('hide');
                	$('#ok-consumo-discos').modal('show');
                }
                else {
                	$('input#nameplate-listado-discos').val('');
                	$('.nameplate-listado').append('<span class="error">No existe este disco en programación. Por favor revisa los campos.</span>');
                	if ($('.etapa').length) {
                		$('.etapa').fadeOut();
                	}
                }
            });
    });
    $('body').on('keyup', 'input#nameplate-listado-discos', function(){

        var $input =$(this);
        $('.nameplate-listado span').remove();
        if ($input.val().length>3){
        		$('#titulo-discos-en-buffer').fadeOut();
        		$('.listado-discos').fadeOut();
                var patt700=/D[HE][0-9]{4}R?$/i; //Se añade R final opcional por si hay reproceso
                var patt900=/HH[0-9]{4}R?$/i;
                var patt1000=/MG[0-9]{4}R?$/i;
                var pattxwb=/XG[0-9]{4}R?$/i;
                var patdes=/^[JSRBYNPU]{1}.{3,}/i;
                 reemplazar($input.val(), $input);/**************/
                //si el input del nameplate coincide con los patterns, se muestra el campo nombre
                if (patt700.test($input.val()) || patt900.test($input.val()) || patt1000.test($input.val()) || pattxwb.test($input.val()) || patdes.test($input.val())){
                    $('.enviar-consumo-disco').prop('disabled', false);
                	if (patdes.test($input.val())){
                        var desarr=$input.val().toUpperCase();
                        $input.val(desarr);
                    }
                    if ($('.nameplate-listado').hasClass('has-error')){
                        $('.nameplate-listado').removeClass('has-error');
                    }

                    if (patt700.test($input.val())) {
                        $('#etapa-listado-discos').empty();
                    	for (var i=1; i<5; i++){
                            $('#etapa-listado-discos').append('<option value="'+i+'">ETAPA '+i+'</option>');
						}
					}
                    else if (patt900.test($input.val())) {
                        $('#etapa-listado-discos').empty();
                        for (var i=1; i<6; i++){
                            $('#etapa-listado-discos').append('<option value="'+i+'">ETAPA '+i+'</option>');
                        }
                    }
                    else  {
                        $('#etapa-listado-discos').empty();
                        for (var i=1; i<7; i++){
                            $('#etapa-listado-discos').append('<option value="'+i+'">ETAPA '+i+'</option>');
                        }
                    }
                    $('.etapa').fadeIn();
                }
                else {
                    $('.enviar-consumo-disco').prop('disabled', true);
                    $('.nameplate-listado').addClass('has-error');
                    if($('.etapa').length){
                        $('.etapa').fadeOut();
                    }
                }
       }
        else {
			if(!$('.listado-discos').is(':visible')) {
                $('.listado-discos').fadeIn();
			}
            if(!$('#titulo-discos-en-buffer').is(':visible')) {
                $('#titulo-discos-en-buffer').fadeIn();
            }

            if($('.etapa').length){
                $('.etapa').fadeOut();
            }
        }

    });

    //MODAL QUE MUESTRA LOS ALABES PARA CONSUMIR
    $('body').on('click', 'a[href="consumo-alabes"]', function(e){
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        $('#nameplate-listado-alabes').val('');
		if(!$('.listado-alabes').is(':visible')) {
            $('.listado-alabes').fadeIn();
		}    
		if($('.nameplate-listado-alabes span.error').length) {
            $('.nameplate-listado-alabes span.error').remove();
		}  	       
        $.post('almacen.php', {alabesparaconsumir: true})
            .done(function (data) {
                if (data.length>0) {
                    //Funcion que vacía el div con las imagenes de las cajas de discos del buffer y las rellena con la base de datos.
                    $('.listado-alabes').html(function(){
                    	return colorearBotones('alabes', data);
                    });
                }
            });
    });

    $('body').on('click', '.listado-en-buffer-alabes', function () {
        var id = $(this).attr('id');
		$('#trabajando').modal('show');        
        $.post('almacen.php', {quitarbufferalabes: 1, id: id})
            .done(function(data){
			$('#trabajando').modal('hide');            	
                    var num= data.length;
                    $('#consumo-alabes').modal('hide');
                    $('#ok-consumo-alabes').modal('show');

            });
    });

    $('body').on('click', '.enviar-consumo-alabes', function () {
        var nameplate = $('#nameplate-listado-alabes').val();
        var etapa = $('#etapa-listado-alabes').val();
		$('#trabajando').modal('show');        
        $.post('almacen.php', {quitarbufferysuministroalabes: 1,  nameplate: nameplate, etapa: etapa})
            .done(function(data){
			$('#trabajando').modal('hide');            	
                if (data.error==0) {
                    $('#consumo-alabes').modal('hide');
                    $('#ok-consumo-alabes').modal('show');
                }
                else {
                	$('input#nameplate-listado-alabes').val('');
                	$('.nameplate-listado-alabes').append('<span class="error">No existe este juego de álabes en programación. Por favor revisa los campos.</span>');
                	if ($('.etapa-alabes').length) {
                		$('.etapa-alabes').fadeOut();
                	}
                }                	

            });
    });
    $('body').on('keyup', 'input#nameplate-listado-alabes', function(){

    	$('.nameplate-listado-alabes span').remove();
        var $input =$(this);
        if ($input.val().length>3){
            $('#titulo-alabes-en-buffer').fadeOut();
            $('.listado-alabes').fadeOut();
            var patt700=/D[HE][0-9]{4}R?$/i; //Se añade R final opcional por si hay reproceso
            var patt900=/HH[0-9]{4}R?$/i;
            var patt1000=/MG[0-9]{4}R?$/i;
            var pattxwb=/XG[0-9]{4}R?$/i;
            var patdes=/^[JSRBYNPU]{1}.{3,}/i;
            reemplazar($input.val(), $input);/**************/
            //si el input del nameplate coincide con los patterns, se muestra el campo nombre
            if (patt700.test($input.val()) || patt900.test($input.val()) || patt1000.test($input.val()) || pattxwb.test($input.val()) || patdes.test($input.val())){
                $('.enviar-consumo-alabes').prop('disabled', false);
                if (patdes.test($input.val())){
                    var desarr=$input.val().toUpperCase();
                    $input.val(desarr);
                    for (var i=1; i<6; i++){
                        $('#etapa-listado-alabes').append('<option value="'+(i+45)+'">ETAPA '+i+'</option>');
                    }
                }
                if ($('.nameplate-listado-alabes').hasClass('has-error')){
                    $('.nameplate-listado-alabes').removeClass('has-error');
                }

                if (patt700.test($input.val())) {
                    $('#etapa-listado-alabes').empty();
                    for (var i=1; i<5; i++){
                        $('#etapa-listado-alabes').append('<option value="'+(i+45)+'">ETAPA '+i+'</option>');
                    }
                }
                else if (patt900.test($input.val())) {
                    $('#etapa-listado-alabes').empty();
                    for (var i=1; i<6; i++){
                        $('#etapa-listado-alabes').append('<option value="'+(i+45)+'">ETAPA '+i+'</option>');
                    }
                }
                else  {
                    $('#etapa-listado-alabes').empty();
                    for (var i=1; i<7; i++){
                        $('#etapa-listado-alabes').append('<option value="'+(i+45)+'">ETAPA '+i+'</option>');
                    }
                }
                $('.etapa-alabes').fadeIn();
            }
            else {
                $('.enviar-consumo-alabes').prop('disabled', true);
                $('.nameplate-listado-alabes').addClass('has-error');
                if($('.etapa-alabes').length){
                    $('.etapa-alabes').fadeOut();
                }
            }
        }
        else {
            if(!$('.listado-alabes').is(':visible')) {
                $('.listado-alabes').fadeIn();
            }
            if(!$('#titulo-alabes-en-buffer').is(':visible')) {
                $('#titulo-alabes-en-buffer').fadeIn();
            }

            if($('.etapa-alabes').length){
                $('.etapa-alabes').fadeOut();
            }
        }

    });

    //MODAL QUE MUESTRA LOS NGVS LPT PARA CONSUMIR
    $('body').on('click', 'a[href="consumo-ngvs"]', function(e){
    	e = $.event.fix(e);
        e.preventDefault();
        $('#nameplate-listado-ngvs').val('');
		if(!$('.listado-ngvs').is(':visible')) {
            $('.listado-ngvs').fadeIn();
		}    
		if($('.nameplate-listado-ngvs span.error').length) {
            $('.nameplate-listado-ngvs span.error').remove();
		}  	        
        $.post('almacen.php', {ngvsparaconsumir: true})
            .done(function (data) {
                if (data.length>0) {
                    //Funcion que vacía el div con las imagenes de las cajas de discos del buffer y las rellena con la base de datos.
                    $('.listado-ngvs').html(function(){
                    	return colorearBotones('ngvs', data);
                    });
                }
            });
    });

    $('body').on('click', '.listado-en-buffer-ngvs', function () {
        var id = $(this).attr('id');
		$('#trabajando').modal('show');        
        $.post('almacen.php', {quitarbufferngvs: 1, id: id})
            .done(function(data){
        			$('#trabajando').modal('hide');
                    var num= data.length;
                    $('#consumo-ngvs').modal('hide');
                    $('#ok-consumo-ngvs').modal('show');

            });
    });

    $('body').on('click', '.enviar-consumo-ngvs', function () {
        var nameplate = $('#nameplate-listado-ngvs').val();
        var etapa = $('#etapa-listado-ngvs').val();
		$('#trabajando').modal('show');        
        $.post('almacen.php', {quitarbufferysuministrongvs: 1,  nameplate: nameplate, etapa: etapa})
            .done(function(data){
			$('#trabajando').modal('hide'); 
			console.log(data);          	
                if (data.error==0) {
                    $('#consumo-ngvs').modal('hide');
                    $('#ok-consumo-ngvs').modal('show');
                }
                else if (data.error==1) {
                	$('input#nameplate-listado-ngvs').val('');
                	$('.nameplate-listado-ngvs').append('<span class="error">No existe este juego de NGV\'s en programación. Por favor revisa los campos.</span>');
                	if ($('.etapa-ngvs').length) {
                		$('.etapa-ngvs').fadeOut();
                	}                	
                }
            });
    });
    $('body').on('keyup', 'input#nameplate-listado-ngvs', function(){

        var $input =$(this);
        if ($input.val().length>3){
            $('#titulo-ngvs-en-buffer').fadeOut();
            $('.listado-ngvs').fadeOut();
            var patt700=/D[HE][0-9]{4}R?$/i; //Se añade R final opcional por si hay reproceso
            var patt900=/HH[0-9]{4}R?$/i;
            var patt1000=/MG[0-9]{4}R?$/i;
            var pattxwb=/XG[0-9]{4}R?$/i;
            var patdes=/^[JSRBYNPU]{1}.{3,}/i;
            reemplazar($input.val(), $input);/**************/
            //si el input del nameplate coincide con los patterns, se muestra el campo nombre
            if (patt700.test($input.val()) || patt900.test($input.val()) || patt1000.test($input.val()) || pattxwb.test($input.val()) || patdes.test($input.val())){
                $('.enviar-consumo-ngvs').prop('disabled', false);
                if (patdes.test($input.val())){
                    var desarr=$input.val().toUpperCase();
                    $input.val(desarr);
                    for (var i=1; i<6; i++){
                        $('#etapa-listado-ngvs').append('<option value="'+(i+45)+'">ETAPA '+i+'</option>');
                    }
                }
                if ($('.nameplate-listado-ngvs').hasClass('has-error')){
                    $('.nameplate-listado-ngvs').removeClass('has-error');
                }

                if (patt700.test($input.val())) {
                	$input.val($input.val().toUpperCase());	
                    $('#etapa-listado-ngvs').empty();
                    for (var i=1; i<5; i++){
                        $('#etapa-listado-ngvs').append('<option value="LP'+i+'">ETAPA '+i+'</option>');
                    }
                }
                else if (patt900.test($input.val())) {
                	$input.val($input.val().toUpperCase());
                    $('#etapa-listado-ngvs').empty();
                    for (var i=1; i<6; i++){
                        $('#etapa-listado-ngvs').append('<option value="LP'+i+'">ETAPA '+i+'</option>');
                    }
                }
                else  {
                	$input.val($input.val().toUpperCase());
                    $('#etapa-listado-ngvs').empty();
                    for (var i=1; i<7; i++){
                        $('#etapa-listado-ngvs').append('<option value="LP'+i+'">ETAPA '+i+'</option>');
                    }
                }
                $('.etapa-ngvs').fadeIn();
            }
            else {
                $('.enviar-consumo-ngvs').prop('disabled', true);
                $('.nameplate-listado-ngvs').addClass('has-error');
                if($('.etapa-ngvs').length){
                    $('.etapa-ngvs').fadeOut();
                }
            }
        }
        else {
            if(!$('.listado-ngvs').is(':visible')) {
                $('.listado-ngvs').fadeIn();
            }
            if(!$('#titulo-ngvs-en-buffer').is(':visible')) {
                $('#titulo-ngvs-en-buffer').fadeIn();
            }

            if($('.etapa-ngvs').length){
                $('.etapa-ngvs').fadeOut();
            }
        }

    });


    //BOTON INFO PARA DESPLEGAR LA TABLA DE INSPECCIONES PENDIENTES EN LA PANTALLA DE MONTAJE
	$('body').on ('click', 'a.info-pendientes', function(e){
		e.preventDefault();
		var $pen = $('.pendientes-montaje');
		$.ajax({
			url:'funciones.php',
			type: 'POST',
			data: {infopendientes: 1},
			success: function(data){
					$('.pendientes-montaje tbody').append(data);
					$('.background').fadeIn();
					$pen.fadeIn();
					$pen.animate({
						right: '0%'
					});

					var time=setTimeout(function(){
						$pen.animate({
						right: '-85%'
						});
						$pen.find('tbody').empty();
						$pen.fadeOut();
						$('.background').fadeOut();
					}, 20000);
					
			}
		});

	});

	//LINK CONSUMIR ALABES, NGV LP1 y NGV IP. QUITA UNA CAJA DEL BUFFER EN LA PANTALLA DE ALMACÉN EN EL CASO DE LOS ALABES.

	$('body').on ('click', 'a[href="consumo-ngvlp1"]', function(e){
		e.preventDefault();
		$('#confirmconsumirngvlp1').dialog(confirmconsumirngvlp1).dialog('open');
		$('#confirmconsumirngvlp1 input').focus();
	});		

	$('body').on ('click', 'a[href="consumo-ngvip"]', function(e){
		e.preventDefault();
		$('#confirmconsumirngvip').dialog(confirmconsumirngvip).dialog('open');
		$('#confirmconsumirngvip input').focus();
	});

    $('body').on ('click', 'a[href="consumo-soporte"]', function(e){
        e.preventDefault();
        $('#confirmconsumirsoporte').dialog(confirmconsumirsoporte).dialog('open');
        $('#confirmconsumirsoporte input').focus();
    });

    $('body').on ('click', 'a[href="consumo-caseip"]', function(e){
        e.preventDefault();
        $('#confirmconsumircaseip').dialog(confirmconsumircaseip).dialog('open');
        $('#confirmconsumircaseip input').focus();
    });

	$('body').on ('click', 'a[href="consumo-alabesip"]', function(e){
		e.preventDefault();
		$('#confirmconsumiralabeip').dialog(confirmconsumiralabeip).dialog('open');
		$('#confirmconsumiralabeip input').focus();
	});			

	function consumirAlabes(){
		var concurvicos = $('input[name="radiocurvicos"]:checked').val();//valores posibles: 'si' / 'no'
		
		$.ajax({
			url:'almacen.php',
			type: 'POST',
			dataType: 'json',
			data: {consumirAlabe: 1, curvicos: concurvicos}
		})
		.done(function(data){
			if(data.error===0){
				$('#alabeconsumido').dialog(alabeopts).dialog('open');
			}
			else {
				alert('Ocurrió un error');
			}
		})
		.fail(function(){
			alert ('Error en consumición ALABES');
		});
	}

	function consumirNgvLp1(nameplate){
		$.ajax({
			url:'almacen.php',
			type: 'POST',
			dataType: 'json',
			data: {consumirNgvLp1: true, nameplate: nameplate}
		})
		.done(function(data){
			if(data.error===0){
				$('#ngvlp1consumido').dialog(ngvlp1opts).dialog('open');
			}
			else {
				alert('Ocurrió un error');
			}
		})
		.fail(function(){
			alert ('Error en consumición NGV LP1');
		});
	}

	function consumirNgvIp(nameplate){
		$.ajax({
			url:'almacen.php',
			type: 'POST',
			dataType: 'json',
			data: {consumirNgvIp: true, nameplate: nameplate}
		})
		.done(function(data){
			if(data.error===0){
				$('#ngvipconsumido').dialog(ngvipopts).dialog('open');
			}
			else {
				alert('Ocurrió un error');
			}
		})
		.fail(function(){
			alert ('Error en consumición NGV IP');
		});
	}

    function consumirSoporte(nameplate){
        $.ajax({
            url:'almacen.php',
            type: 'POST',
            dataType: 'json',
            data: {consumirsoporte: true, nameplate: nameplate}
        })
            .done(function(data){
                if(data.error===0){
                    $('#soporteconsumido').dialog(soporteopts).dialog('open');
                }
                else {
                    alert('Ocurrió un error');
                }
            })
            .fail(function(){
                alert ('Error en consumición SOPORTE');
            });
    }

    function consumirCarcasaIp(nameplate){
        $.ajax({
            url:'almacen.php',
            type: 'POST',
            dataType: 'json',
            data: {consumircaseip: true, nameplate: nameplate}
        })
            .done(function(data){
                if(data.error===0){
                    $('#caseipconsumido').dialog(caseipopts).dialog('open');
                }
                else {
                    alert('Ocurrió un error');
                }
            })
            .fail(function(){
                alert ('Error en consumición SOPORTE');
            });
    }

	function consumirAlabeIp(nameplate){
		$.ajax({
			url:'almacen.php',
			type: 'POST',
			dataType: 'json',
			data: {consumirAlabeIp: true, nameplate: nameplate}
		})
		.done(function(data){
			if(data.error===0){
				$('#alabeconsumido').dialog(alabeipopts).dialog('open');
			}
			else {
				alert('Ocurrió un error');
			}
		})
		.fail(function(){
			alert ('Error en consumición ALABE IP');
		});
	}
	//TOOLTIP DEL BOTON INFORMACION (VER INSPECCIONES PENDIENTES DE INSPECCIÓN)

	$('.cerrar-lateral').tooltip();

	
	//BOTON CERRAR LA TABLA LATERAL DE INSPECCIONES PENDIENTES
	$('body').on('click', '.cerrar-lateral', function(){
		$('.pendientes-montaje').animate({
		right: '-85%'
		});
		$('.pendientes-montaje').find('tbody').empty();
		$('.pendientes-montaje').fadeOut();//para poner display none y no ver la barra horizontal en el navegador.
		$('.background').fadeOut();
			
		
	});

    //FUNCIONES Y EVENT HANDLERS AL PULSAR BOTON VER PARA OBTENER INFORMACIÓN DEL STATUS DOCUMENTAL DE CIERRE DE NGV'S

    $(document).on("click", "button#cierre-ngv", function (e){
        $('.dropdown-cierres li.badges-ngvs').remove();
        verCierreNgv($('input#seriengv').val());
    });

    $(document).on("keyup", 'input#seriengv', function(e) {
    	if (e.which == 13 && $('input#seriengv').length>0){
    		
    		$('.dropdown-cierres li.badges-ngvs').remove();
        	verCierreNgv($('input#seriengv').val());
    	}
    });


    $(document).on("click", ".status-cierres", function (e){
        $('input#seriengv').val('');
        if ($('.dropdown-cierres form').css('display')=='none') {
            $('.dropdown-cierres form').fadeIn();
        }
        if ($('.dropdown-cierres li.badges-ngvs').length){
            $('.dropdown-cierres li.badges-ngvs').remove();
        }
    });

    $(document).on('keyup', '#seriengv', function () {
        reemplazar($('#seriengv').val(), $('#seriengv'));
    });


	function verCierreNgv(datos){
		$.ajax({
			url: 'funciones.php',
			type: 'POST',
			data: {seriengv: datos}
		})
        .done(
			function (data) {
				

                $('.dropdown-cierres').append('<li class="badges-ngvs"></li>');
                $('.dropdown-cierres form').fadeOut();
                $('.dropdown-cierres li.badges-ngvs').append('<h4>'+datos+'</h4><hr>').hide().fadeIn();
				if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id_piezas == 14 && data[i].status == 2) {
                            $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-success"><i class="fa fa-check-square" aria-hidden="true"></i> NGV2</span>').hide().fadeIn();
                        }
                        if (data[i].id_piezas == 15 && data[i].status == 2) {
                            $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-success"><i class="fa fa-check-square" aria-hidden="true"></i> NGV3</span>').hide().fadeIn();
                        }
                        if (data[i].id_piezas == 16 && data[i].status == 2) {
                            $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-success"><i class="fa fa-check-square" aria-hidden="true"></i> NGV4</span>').hide().fadeIn();
                        }
                        if (data[i].id_piezas == 17 && data[i].status == 2) {
                            $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-success"><i class="fa fa-check-square" aria-hidden="true"></i> NGV5</span>').hide().fadeIn();
                        }
                        if (data[i].id_piezas == 18 && data[i].status == 2) {
                            $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-success"><i class="fa fa-check-square" aria-hidden="true"></i> NGV6</span>').hide().fadeIn();
                        }
                    }
                    if (!$(".dropdown-cierres li.badges-ngvs span:contains('NGV2')").length) {
                        $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-danger"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> NGV2</span>').hide().fadeIn();
                    }
                    if (!$(".dropdown-cierres li.badges-ngvs span:contains('NGV3')").length) {
                        $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-danger"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> NGV3</span>').hide().fadeIn();
                    }
                    if (!$(".dropdown-cierres li.badges-ngvs span:contains('NGV4')").length) {
                        $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-danger"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> NGV4</span>').hide().fadeIn();
                    }
                    if (!$(".dropdown-cierres li.badges-ngvs span:contains('NGV5')").length && (data[0].id_tipos_motor == 2 || data[0].id_tipos_motor == 3 || data[0].id_tipos_motor == 4 || data[0].id_tipos_motor == 5 || data[0].id_tipos_motor == 6 || data[0].id_tipos_motor == 7)) {
                        $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-danger"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> NGV5</span>').hide().fadeIn();
                    }
                    if (!$(".dropdown-cierres li.badges-ngvs span:contains('NGV6')").length && (data[0].id_tipos_motor == 3 || data[0].id_tipos_motor == 4 || data[0].id_tipos_motor == 5 || data[0].id_tipos_motor == 6 || data[0].id_tipos_motor == 7)) {
                        $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-danger"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> NGV6</span>').hide().fadeIn();
                    }
                    tinysort('li.badges-ngvs>span');
                }
                else {
                    $('.dropdown-cierres li.badges-ngvs').append('<span class="cerrado label label-warning">NO SE HAN ENCONTRADO DATOS DE ESTE MÓDULO</span>').hide().fadeIn();
                }
			}
		);
	}



	//FUNCION CORRECCION NAMEPLATES INTRODUCIDOS POR MONTADOR

	function reemplazar (value, input) {
		var t7_08	 = /^D[^H]\d+/i;
		var t7_05	 = /^D[^E]\d+/i;
		var t1000	 = /^M[^G]\d+/i;
		var t900	 = /^H[^H]\d+/i;
		var txwb	 = /^X[^G]\d+/i;
		var valor	 = value;//$('input[name="nameplate"]').val();
		var zona 	= $('select#zona');
		var $input = input;
		var valor2 ='';
		if (t7_08.test(valor) && (zona.val()==1 || zona.val()==2 ||zona.val()==4 ||zona.val()==5 || zona.val()==6 || zona.val()==7 || zona.val()==9 || zona.val().length==0)){
			if (/^D8/i.test(valor)){
				valor2 = valor.replace(/^D8/i, 'DH');
				$input.val(valor2);
			}
			else if (/^DE/i.test(valor)){
				valor2=valor.replace(/^DE/i, 'DH');
				$input.val(valor2);
			}

			else if (/^D[^H8]/i.test(valor)) {
				valor2 = valor.replace(/^D/i, 'DH');
				$input.val(valor2);
			}
		}

		else if (/^dh/.test(valor)){
			$input.val(valor.toUpperCase());
		}
		else if (t7_05.test(valor) && (zona.val()==3 || zona.val()==8)){
			if (/^D5/i.test(valor)){
				valor2 = valor.replace(/^D5/i, 'DE');
				$input.val(valor2);				
			}
			else if (/^D[^E5]/i.test(valor)){
				valor2 = valor.replace(/^D/i, 'DE');
				$input.val(valor2);
			}
	
	
		}
		else if (t1000.test(valor)){
			if(/^M8/i.test(valor)){
				valor2 = valor.replace(/^M8/i, 'MG');
				$input.val(valor2);
			}
			else if(/^M[^G8]/i.test(valor)){
				valor2 = valor.replace(/M/i, 'MG');
				$input.val(valor2);
			}
		}
		else if (/^mg/i.test(valor)) {
			$input.val(valor.toUpperCase());				
		}		
	
		else if (t900.test(valor)){
			if(/^H8/i.test(valor)){
				valor2 = valor.replace(/^H8/i, 'HH');
				$input.val(valor2);
			}
			else if(/^H[^8H]/i.test(valor)){
				valor2 = valor.replace(/^H/i, 'HH');
				$input.val(valor2);
			}
		}
		else if (/^hh/i.test(valor)) {
			$input.val(valor.toUpperCase());				
		}
	
		else if (txwb.test(valor)){
			if(/^X[^G8]/i.test(valor)){
				valor2 = valor.replace(/^X/i, 'XG');
				$input.val(valor2);
			}
			else if(/^X8/i.test(valor)){
				valor2 = valor.replace(/^X8/i, 'XG');
				$input.val(valor2);
			}
		}
		else if (/^xg/i.test(valor)) {
			$input.val(valor.toUpperCase());				
		}
		else if (/^P/i.test(valor)){
			$input.val(valor);
		}
		else {
			$input.val(valor.toUpperCase());
		}
		//zona.val()!=9
	}

	function reemplazarNameplateIp (input){
		var valor = input.val();	
		var $input = input;
		var valor2;
		//alert(valor);
		//alert(!/^D5/i.test(valor));
		if (!/^DE/i.test(valor)){
			if (/^D[^E]\d+/i.test(valor)){
				valor2=valor.replace(/^D/i, 'DE');
				$input.val(valor2);
			}
			else if (/^D5/i.test(valor)){
				valor2=valor.replace(/^D5/i, 'DE');
				$input.val(valor2);
			}
			else if(/^[^D]/i.test(valor)) {
				alert('El nameplate debe comenzar con la letra "D"');
				$input.val('');				
			}			

		}			
	}


	//DIALOGO ERROR NUMERICO NAMEPLATE
	


	//$('div#error-numero').dialog('open');
var alabeopts= {
	autoOpen: false,
	modal: true,
	title: 'Álabes consumidos',
	buttons: {
		'OK': function(){
			$(this).dialog('close');
		}
	}
};

var ngvlp1opts = {
	autoOpen: false,
	modal: true,
	title: 'NGV\'S LP1 consumidos',
	buttons: {
		'OK': function(){
			$(this).dialog('close');
		}
	}
};

var ngvipopts = {
	autoOpen: false,
	modal: true,
	title: 'NGV\'S IP consumidos',
	buttons: {
		'OK': function(){
			$(this).dialog('close');
		}
	}
};

var alabeipopts = {
	autoOpen: false,
	modal: true,
	title: 'ALABES IP consumidos',
	buttons: {
		'OK': function(){
			$(this).dialog('close');
		}
	}
};

    var soporteopts = {
        autoOpen: false,
        modal: true,
        title: 'Soporte HP/IP consumido',
        buttons: {
            'OK': function(){
                $(this).dialog('close');
            }
        }
    };

    var caseipopts = {
        autoOpen: false,
        modal: true,
        title: 'Carcasa IP consumida',
        buttons: {
            'OK': function(){
                $(this).dialog('close');
            }
        }
    };

var confirmconsumirngvlp1={
	autoOpen: false,
	modal: true,
	title: 'NGV LP1 consumidos',
	buttons: {
		'OK': function(){
			var nameplate = $(this).find('input').val();
			if (nameplate.length>5){
				consumirNgvLp1(nameplate);
				$(this).dialog('close');
			}	
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

 var confirmconsumirngvip={
	autoOpen: false,
	modal: true,
	title: 'NGV IP consumidos',
	buttons: {
		'OK': function(){
			var nameplate = $(this).find('input').val();
			if (nameplate.length>5){
				consumirNgvIp(nameplate);
				$(this).dialog('close');
			}	
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

    var confirmconsumirsoporte={
        autoOpen: false,
        modal: true,
        title: 'Soporte HP/IP',
        buttons: {
            'OK': function(){
                var nameplate = $(this).find('input').val();
                if (nameplate.length>5){
                    consumirSoporte(nameplate);
                    $(this).dialog('close');
                }
            },
            'CANCELAR': function(){
                $(this).dialog('close');
            }
        }
    };

    var confirmconsumircaseip={
        autoOpen: false,
        modal: true,
        title: 'Carcasa IP',
        buttons: {
            'OK': function(){
                var nameplate = $(this).find('input').val();
                if (nameplate.length>5){
                    consumirCarcasaIp(nameplate);
                    $(this).dialog('close');
                }
            },
            'CANCELAR': function(){
                $(this).dialog('close');
            }
        }
    };

 var confirmconsumiralabeip={
	autoOpen: false,
	modal: true,
	title: 'ALABESIP consumidos',
	buttons: {
		'OK': function(){
			var nameplate = $(this).find('input').val();
			if (nameplate.length>5){
				consumirAlabeIp(nameplate);
				$(this).dialog('close');
			}	
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

function colorearBotones (pieza, data) {
	var clase;
	if(pieza=='disco'){
		clase = 'listado-en-buffer';
	}
	else if (pieza=='alabes') {
		clase = 'listado-en-buffer-alabes';
	}
	else {
		clase='listado-en-buffer-ngvs';
	}
	
    var botones='';
	var patt700=/^D/i; 
	var patt900=/^H/i;
	var patt1000=/^M/i;
	var pattxwb=/^X/i;
	var patt7000=/^U/i;
	var pat97k=/^Y/i;
	var patten=/^N/i;	
	var patdes=/^[JSRBYNPU]/i;	
	if(pieza=='disco' || pieza=='alabes') {                    	
	    for (var i=0; i<data.length; i++){
			if (patt700.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==48) {
					botones+='<button class="btn btn-t700 '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {
					botones+='<button class="btn btn-t700 '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
			}  
			else if (patt900.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==49) {
					botones+='<button class="btn btn-success '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {
					botones+='<button class="btn btn-success '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}			
			} 			
			else if (patt1000.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==50) {	
					botones+='<button class="btn btn-danger '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {			
					botones+='<button class="btn btn-danger '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}					
			} 
			else if (pattxwb.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==50) {	
					botones+='<button class="btn btn-warning '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {			
					botones+='<button class="btn btn-warning '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
			}
			else if (patt7000.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==50) {	
					botones+='<button class="btn btn-t7000 '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {				
					botones+='<button class="btn btn-t7000 '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
			}
			else if (patten.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==50) {	
					botones+='<button class="btn btn-ten '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {				
					botones+='<button class="btn btn-ten '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
			} 
			else if (pat97k.test(data[i].nameplate)) {
				if (data[i].alabe_piezas_id_pieza==50) {	
					botones+='<button class="btn btn-97k '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
				else {				
					botones+='<button class="btn btn-97k '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
			} 				 		 	
			else {
				if (data[i].alabe_piezas_id_pieza==50) {	
					botones+='<button class="btn btn-default '+clase+'" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}	
				else {			
	            	botones+='<button class="btn btn-default '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
				}
			}	


	    }
	}
	else {
	    for (var i=0; i<data.length; i++){
			if (patt700.test(data[i].nameplate)) {
				botones+='<button class="btn btn-t700 '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa +' ' +data[i].nameplate+'</small></button>';
			}  
			else if (patt900.test(data[i].nameplate)) {
				botones+='<button class="btn btn-success '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa+' ' +data[i].nameplate+'</small></button>';
			} 			
			else if (patt1000.test(data[i].nameplate)) {
				botones+='<button class="btn btn-danger '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa+' ' +data[i].nameplate+'</small></button>';
			} 
			else if (pattxwb.test(data[i].nameplate)) {
				botones+='<button class="btn btn-warning '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa+' ' +data[i].nameplate+'</small></button>';
			}
			else if (patt7000.test(data[i].nameplate)) {
				botones+='<button class="btn btn-t7000 '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa+' ' +data[i].nameplate+'</small></button>';
			}
			else if (patten.test(data[i].nameplate)) {
				botones+='<button class="btn btn-ten '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa+' ' +data[i].nameplate+'</small></button>';
			} 
			else if (pat97k.test(data[i].nameplate)) {
				botones+='<button class="btn btn-97k '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa+' ' +data[i].nameplate+'</small></button>';
			} 				 		 	
			else {
	            botones+='<button class="btn btn-default '+clase+'" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>'+data[i].etapa +' ' +data[i].nameplate+'</small></button>';
			}	


	    }		
	}
    return botones;	

}


//***********NOTA SUPERIOR DE INFORMACIÓN *****************//
//Llamar a función mostrarAd en línea 9 (quitar comentario cuando se quiera activar)

function mostrarAd (){
	$('#ad').slideDown('slow');
	setTimeout(function(){$('#ad').fadeOut();}, 15000);
}

});