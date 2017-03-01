$(document).ready(function(){
    toastr.options.progressBar = true;
    setInterval(function(){location.reload();}, 300000);

	$('.resultados').load('programador.php', {todos: "true"});
	$('.programador-tipos').load('programador.php', {programador_tipos_motor: "pedir"});
	$('.suministrados').load('programador.php', {suministradosProgramador: true});

    //$('.subir-faltantes').ajaxForm();

    //TOOLTIP DEL BOTON AÑADIR PARTE

    $( ".add-part" ).tooltip();	  

    //BOTON AÑADIR PARTE
    $('body').on('click', '.enviar-programador', addProgramador);

    //DISABLE SELECCIÓN ETAPA AL SELECCIONAR CHECKBOX AÑADIR TODAS LAS ETAPAS DE UN NAMEPLATE
    $('body').on('click', '#add_todas', disableSeleccionEtapa);

    //BOTÓN (ESQUINA VERDE) PARA QUITAR PIEZA DE SUMINISTRO
    $('body').on('click', 'img.suministrado', function(event){
        event.stopPropagation();
        var id= $(this).closest('div.row').attr('id');
        var nameplate= $(this).siblings('h5').text();
        var parte= $(this).siblings('h6').text();
        $('#quitarsuministro').data({id: id, nameplate: nameplate, parte: parte}) ;
 
      
        if ($('#quitarsuministro').find('p.quitarsuministro').length){
            $('p.quitarsuministro').remove();
        }      
        $('#quitarsuministro').prepend('<p class="quitarsuministro">'+parte+' '+nameplate+'</p>').dialog('open');

    });

    //BOTÓN REFRESCAR

    $('button.refresh-programador').on('click', function(){
        location.reload(true);
    }); 

    $('button.home-programador').on('click', function(){
        location.href='index.html';
    });    

    //DIALOG AÑADIR PARTE PRESIÓN ENTER EN LUGAR DE OK

    $('body').on('keyup', '.dialog-programador', function(e){
        if(e.which===13) {
            addProgramador();
        }
    });

    //Corrección nameplate según se escribe.
    $('body').on('keyup', '#nameplate-programador', reemplazar);

    //Borrar una programación
    $('body').on('click', 'button.eliminar-programa', function(){
    	var id=$(this).closest('div.row').attr('id');
    	var nameplate = $(this).parent().parent().find('.alabe h5').text();
    	var etapa = $(this).parent().parent().find('.alabe h6').text().substring(7,10);
        //Si el disco o el alabe o ambos ya han sido suministrados, avisar antes de borrar de que ya se han suministrado.
        if($(this).closest('div.row').find('img.suministrado').length){
            $('#yasuministrado').data({'id': id, 'nameplate': nameplate, 'etapa': etapa}).dialog('open');
        }
        else {
    	   $('#borrarprograma').find('.etapaborrar').remove().end().prepend('<p class="etapaborrar">'+nameplate+' '+etapa+'</p>').data('id', id).dialog('open');
        }   
    });

    //DIALOG BORRAR PROGRAMA

    var $borrar = $('#borrarprograma');
    $borrar.dialog({
    	title: 'Borrar juego',
    	autoOpen: false,
    	modal: true,
    	minWidth: 400,
    	buttons: {
    		'ELIMINAR': function(){
    			var id = $(this).data('id');
    			eliminarPrograma(id);
    			$(this).dialog('close');
    		},
    		'CANCELAR': function(){$(this).dialog('close');}
    	}
    });       

    function eliminarPrograma(id){
    	$.ajax({
    		method: 'POST',
    		url: 'programador.php',
    		data: {id: id, borrarprograma: true}
    	}).done(function(){$('.resultados').load('programador.php', {todos: "true"});});
    }
    

    
    //SORTABLE LISTADO DISCOS Y ALABES

    $('.resultados').sortable({
        scrollSensitivity: 50,
    	update: function(event, ui){
    		var items =$(this).sortable('toArray');
     		$.ajax({
    			method: 'POST',
    			data: {items: items},
    			url: 'programador.php'
    		}).done(function(data){
    			
    		});
    	}
    });

    //DIALOG NO STOCK ALABES / ALABES NO DISPONIBLES
    var $na = $('#nostockalabes');
    var $np = $('#noavailablealabes');
    var $npa = $('#noavailablenostockalabes');
    $('#nostockalabes').dialog({
    	title: 'Sin stock de álabes',
    	autoOpen: false,
        minWidth: 500,
    	modal: true
    });

    $('#noavailablealabes').dialog({
        title: 'Alabes no disponibles',
        autoOpen: false,
        minWidth: 500,
        modal: true
    });  

    $('#noavailablenostockalabes').dialog({
        title: 'Alabes no disponibles o sin stock',
        autoOpen: false,
        minWidth: 500,
        modal: true
    });       
    //PONER NO AVAILABLE ALABES / NO STOCK ALABES / NOSTOCKNOAVAILABLE ALABES
    $('body').on('click', '.alabe', function(){
        if ($(this).find('.nostock').length && !$(this).find('.noavailable').length) {
            var id=$(this).parent().attr('id');
            var nameplate = $(this).find('h5').text();
            if ($np.find('.nameplate-alabes').length>0){
                $('.nameplate-alabes').remove();
            }
            $np.data('id', id).prepend('<p class="nameplate-alabes">'+nameplate+'</p>').dialog('open');
        }

        else if (!$(this).find('.nostock').length && $(this).find('.noavailable').length) {
            var id=$(this).parent().attr('id');
            var nameplate = $(this).find('h5').text();
            if ($na.find('.nameplate-alabes').length>0){
                $('.nameplate-alabes').remove();
            }
            $na.data('id', id).prepend('<p class="nameplate-alabes">'+nameplate+'</p>').dialog('open');
        }

        else if (!$(this).find('.nostock').length && !$(this).find('.noavailable').length) {
            var id=$(this).parent().attr('id');
            var nameplate = $(this).find('h5').text();
            if ($npa.find('.nameplate-alabes').length>0){
                $('.nameplate-alabes').remove();
            }
            $npa.data('id', id).prepend('<p class="nameplate-alabes">'+nameplate+'</p>').dialog('open');
        }

    });

    //BOTON PONER NO STOCK EN DIALOGS
    $('#nostockalabes .setnostock').on('click', function (){
    	var nostockid = $na.data('id');
    	$.ajax({
    		method: 'POST',
    		url: 'programador.php',
    		data: {nostockalabe: nostockid}
    	}).done(function(){
    		$na.dialog('close');
    		$('.resultados').load('programador.php', {todos: "true"});
    	});

    });

    $('#noavailablenostockalabes .setnostock').on('click', function (){
        var nostockid = $npa.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {nostockalabe: nostockid}
        }).done(function(){
            $npa.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });    

    //BOTON PONER NO AVAILABLE EN DIALOGS ALABES
    $('#noavailablealabes .setnoavailable').on('click', function (){
        var nostockid = $np.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {noavailablealabe: nostockid}
        }).done(function(){
            $np.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    }); 

    $('#noavailablenostockalabes .setnoavailable').on('click', function (){
        var nostockid = $npa.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {noavailablealabe: nostockid}
        }).done(function(){
            $npa.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });     

    //DIALOG PONER EN STOCK ALABES

    var $saa = $('#sistockalabes');
    var $spa = $('#siavailablealabes');
    $saa.dialog({
        title: 'Agregar stock',
        autoOpen: false,
        modal: true,
        minWidth: 400
    });  

    $spa.dialog({
        title: 'Agregar disponibles para producción',
        autoOpen: false,
        modal: true,
        minWidth: 400
    });        

    $('body') .on('click', '.alabe .nostock', function(e){
        e.stopPropagation();
        var id=$(this).closest('.row').attr('id');
        var nameplate = $(this).parent().find('h5').text();
        if ($saa.find('.nameplate-alabes').length>0){
            $('.nameplate-alabes').remove();
        }
        $saa.data('id', id).prepend('<p class="nameplate-alabes">'+nameplate+'</p>').dialog('open');
    });

    $('body') .on('click', '.alabe .noavailable', function(e){
        e.stopPropagation();
        var id=$(this).closest('.row').attr('id');
        var nameplate = $(this).parent().find('h5').text();
        if ($spa.find('.nameplate-alabes').length>0){
            $('.nameplate-alabe').remove();
        }
        $spa.data('id', id).prepend('<p class="nameplate-alabes">'+nameplate+'</p>').dialog('open');
    });    

    $('#sistockalabes .setstock').on('click', function (){
        var stockid = $saa.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {sistockalabes: stockid}
        }).done(function(){
            $saa.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    }); 

    $('#siavailablealabes .setavailable').on('click', function (){
        var stockid = $spa.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {siavailablealabes: stockid}
        }).done(function(){
            $spa.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });

//DIALOG NO STOCK DISCO / DISCO NO DISPONIBLES ++++++++++DISCOS+++++++++++++++++++++
    var $nostockdisco = $('#nostockdisco');
    var $noavailabledisco = $('#noavailabledisco');
    var $nostnoavdisco = $('#noavailablenostockdisco');
    $('#nostockdisco').dialog({
        title: 'Sin stock de disco',
        autoOpen: false,
        minWidth: 500,
        modal: true
    });

    $('#noavailabledisco').dialog({
        title: 'Disco no suministrable',
        autoOpen: false,
        minWidth: 500,
        modal: true
    });

    $('#noavailablenostockdisco').dialog({
        title: 'Disco no suministrable o sin stock',
        autoOpen: false,
        minWidth: 500,
        modal: true
    });
    //PONER NO AVAILABLE DISCO / NO STOCK DISCO / NOSTOCKNOAVAILABLE DISCO
    $('body').on('click', '.disco', function(){
        if ($(this).find('.nostock').length && !$(this).find('.noavailable').length) {
            var id=$(this).parent().attr('id');
            var nameplate = $(this).find('h5').text();
            if ($noavailabledisco.find('.nameplate-disco').length>0){
                $('.nameplate-disco').remove();
            }
            $noavailabledisco.data('id', id).prepend('<p class="nameplate-disco">'+nameplate+'</p>').dialog('open');
        }

        else if (!$(this).find('.nostock').length && $(this).find('.noavailable').length) {
            var id=$(this).parent().attr('id');
            var nameplate = $(this).find('h5').text();
            if ($nostockdisco.find('.nameplate-disco').length>0){
                $('.nameplate-disco').remove();
            }
            $nostockdisco.data('id', id).prepend('<p class="nameplate-disco">'+nameplate+'</p>').dialog('open');
        }

        else if (!$(this).find('.nostock').length && !$(this).find('.noavailable').length) {
            var id=$(this).parent().attr('id');
            var nameplate = $(this).find('h5').text();
            if ($nostnoavdisco.find('.nameplate-disco').length>0){
                $('.nameplate-disco').remove();
            }
            $nostnoavdisco.data('id', id).prepend('<p class="nameplate-disco">'+nameplate+'</p>').dialog('open');
        }

    });

    //BOTON PONER NO STOCK EN DIALOGS
    $('#nostockdisco .setnostock').on('click', function (){
        var nostockid = $nostockdisco.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {nostockdisco: nostockid}
        }).done(function(){
            $nostockdisco.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });

    $('#noavailablenostockdisco .setnostock').on('click', function (){
        var nostockid = $nostnoavdisco.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {nostockdisco: nostockid}
        }).done(function(){
            $nostnoavdisco.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });

    //BOTON PONER NO AVAILABLE EN DIALOGS ALABES
    $('#noavailabledisco .setnoavailable').on('click', function (){
        var nostockid = $noavailabledisco.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {noavailabledisco: nostockid}
        }).done(function(){
            $noavailabledisco.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });

    $('#noavailablenostockdisco .setnoavailable').on('click', function (){
        var nostockid = $nostnoavdisco.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {noavailabledisco: nostockid}
        }).done(function(){
            $nostnoavdisco.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });

    //DIALOG PONER EN STOCK ALABES

    var $sad = $('#sistockdisco');
    var $spd = $('#siavailabledisco');
    $sad.dialog({
        title: 'Agregar disco a stock',
        autoOpen: false,
        modal: true,
        minWidth: 400
    });

    $spd.dialog({
        title: 'Agregar disco disponible para producción',
        autoOpen: false,
        modal: true,
        minWidth: 400
    });

    $('body') .on('click', '.disco .nostock', function(e){
        e.stopPropagation();
        var id=$(this).closest('.row').attr('id');
        var nameplate = $(this).parent().find('h5').text();
        if ($sad.find('.nameplate-disco').length>0){
            $('.nameplate-disco').remove();
        }
        $sad.data('id', id).prepend('<p class="nameplate-disco">'+nameplate+'</p>').dialog('open');
    });

    $('body') .on('click', '.disco .noavailable', function(e){
        e.stopPropagation();
        var id=$(this).closest('.row').attr('id');
        var nameplate = $(this).parent().find('h5').text();
        if ($spd.find('.nameplate-disco').length>0){
            $('.nameplate-disco').remove();
        }
        $spd.data('id', id).prepend('<p class="nameplate-disco">'+nameplate+'</p>').dialog('open');
    });

    $('#sistockdisco .setstock').on('click', function (){
        var stockid = $sad.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {sistockdisco: stockid}
        }).done(function(){
            $sad.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });

    $('#siavailabledisco .setavailable').on('click', function (){
        var stockid = $spd.data('id');
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {siavailabledisco: stockid}
        }).done(function(){
            $spd.dialog('close');
            $('.resultados').load('programador.php', {todos: "true"});
        });

    });






    //DIALOG METER TODAS LAS ETAPAS A LA VEZ
    var $todas = $('#dialogtodas');
    $('#dialogtodas').dialog({
        title: 'Añadir todas las etapas',
        autoOpen: false,
        modal: true, 
        minWidth: 400,
        buttons: {
            'OK': function(){
                    enviarForm();
                    $('#add').dialog('close');
                    $(this).dialog('close');                
                },
            'CANCELAR': function(){
                $(this).dialog('close');
            }

        }
    });    

 

    //DIALOG PARTE YA SUMINISTRADA AL BORRAR

    var $ys = $('#yasuministrado');
    $ys.dialog({
        title: 'Eliminar parte suministrada',
        autoOpen: false,
        modal: true,
        minWidth: 400,
        buttons: {
            'OK': function(){
                $(this).dialog('close');
                var id = $(this).data('id');
                var nameplate = $(this).data('nameplate');
                var etapa = $(this).data('etapa');
                $('#borrarprograma').find('.etapaborrar').remove().end().prepend('<p class="etapaborrar">'+nameplate+' '+etapa+'</p>').data('id', id).dialog('open');
                $('#borrarprograma').dialog('open');
            },
            'CANCELAR': function(){
                $(this).dialog('close');
            }
        }
    });      



   //BOTON PARA CERRAR TODOS LOS DIALOG DE STOCK

    $('.closenostock').on('click', function(){
    	$('#nostockalabes, #noavailablealabes, #nostockdisco, #noavailabledisco, #sistockalabes, #sistockdisco, #siavailabledisco, #noavailablenostockdisco, #noavailablenostockalabes').dialog('close');
    });  

 

   //DIALOG PARTE YA SUMINISTRADA AL BORRAR

    var $ys = $('#yasuministrado');
    $ys.dialog({
        title: 'Eliminar parte suministrada',
        autoOpen: false,
        modal: true,
        minWidth: 400,
        buttons: {
            'OK': function(){
                $(this).dialog('close');
                var id = $(this).data('id');
                var nameplate = $(this).data('nameplate');
                var etapa = $(this).data('etapa');
                $('#borrarprograma').find('.etapaborrar').remove().end().prepend('<p class="etapaborrar">'+nameplate+' '+etapa+'</p>').data('id', id).dialog('open');
                $('#borrarprograma').dialog('open');
            },
            'CANCELAR': function(){
                $(this).dialog('close');
            }
        }
    });  

    //DIALOG QUITAR SUMINISTRO   

    $('#quitarsuministro').dialog({
        title: 'Eliminar pieza de suministro',
        autoOpen: false,
        modal: true,
        minWidth: 400,
        buttons: {
            'OK': function(){
                $(this).dialog('close');
                var id = $(this).data('id');
                var nameplate = $(this).data('nameplate');
                var etapa = $(this).data('parte');
                var eliminarbuffer = $(this).find('input[name="optionsRadios"]:checked').val();
                var pattern = /alabes/i;
                if (pattern.test(etapa)){
                   quitarSuministro(id, 'alabes', eliminarbuffer);
                }
                else {
                   quitarSuministro(id, 'disco', eliminarbuffer);
                }
                
            },
            'CANCELAR': function(){
                $(this).dialog('close');
            }
        }
    });     


    //DIALOG JUEGO YA EXISTE AL AÑADIR   

    $('#yaexiste').dialog({
        title: 'Eliminar pieza de suministro',
        autoOpen: false,
        modal: true,
        minWidth: 400,
        buttons: {
            'OK': function(){
                $(this).dialog('close');                
            }

        }
    }); 

    $('form.dialog-programador').on('submit', function(event) {

     return false;
    });    

    $('form.subir-faltantes').on('submit', function(event) {

     return false;
    }); 

    //FORM SUBIR EXCEL

    $('#subir-faltantes').on('click', function(){
        $('#modal-excel').modal('show');

        $('.subir-faltantes').submit(function() {             
            $(this).ajaxSubmit({
                resetForm: true,
                success: function(data){
                    $('#modal-excel').modal('hide');
                    $('.resultados').load('programador.php', {todos: "true"});
                },
                url: 'subirexcel.php',
                type: 'POST'
            });
            return false;
        });
    });


//******************************FUNCIONES**********************************//

    //FUNCION QUITAR SUMINISTRO

    function quitarSuministro(id, parte, eliminarbuffer){
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: {id: id, quitarsuministro: true, parte: parte, eliminarbuffer:eliminarbuffer},

        }).done(function(data){
            if (data.error==='si'){
                
            }
            else {
                $('.resultados').load('programador.php', {todos: "true"});
                $('.suministrados').load('programador.php', {suministradosProgramador: true});
            }    
        });
    }
   //FUNCION PARA EL BOTON OK DEL DIALOG AÑADIR.
    function addProgramador (){
    	$input=$('input#nameplate-programador');
    	$select=$('select[name="etapa-programador"]');
    	$radio=$('input:radio');
        $checkTodas=$('input#add_todas');

    	if ($input.val()===''){
    		$input.parent().addClass('has-error');
    	}
    	else {
    		if ($input.parent().hasClass('has-error')){
    			$input.parent().removeClass('has-error');
    		}
    	}
    	if ($select.val()==='' && !$checkTodas.is(':checked')){
    		if ($('.error-etapa-vacia').length===0){
    			$('.opciones').append('<span class="glyphicon glyphicon-exclamation-sign error-etapa-vacia" aria-hidden="true"></span>');
    		}
    	}
    	else {
    		if ($('.error-etapa-vacia')){
    			$('.error-etapa-vacia').remove();
    		}
    	}    	
    	if (!$radio.is(':checked')){
    		if ($('.error-tipo-vacio').length===0){
    			$('.seleccion-motor').append('<br/><span class="glyphicon glyphicon-exclamation-sign error-tipo-vacio" aria-hidden="true"></span>');
    		}	
    	}
    	else {
    		if ($('.error-tipo-vacio')){
    			$('.error-tipo-vacio').remove();
    		}
    	} 

    	if(($select.val()!=='' || $checkTodas.is(':checked')) && $input.val()!=='' && $('input[type="radio"]:checked').length>0){
            if ($checkTodas.is(':checked')){
                if ($('#nameplatetodas').length){
                    $('#nameplatetodas').remove();
                }
                $('#dialogtodas .bg-info').before('<p id="nameplatetodas">NAMEPLATE: '+$input.val()+'<p/>');
                $('#dialogtodas').dialog('open');
            }
            else {
                enviarForm();
            }

			
    	}



    }	
    //FUNCIÓN ENVIAR LOS DATOS DEL FORM AÑADIR PARTE DEL PROGRAMADOR
    function enviarForm (){
        $.ajax({
            method: 'POST',
            url: 'programador.php',
            data: $('form').serialize()
        }).done (function(data){
            $('.dialog-programador').trigger("reset");
            if(!$('select[name="etapa-programador"]').is(':visible')) {
                $('select[name="etapa-programador"]').fadeIn();
            }
            if(data.error==='existe'){
                toastr.warning('El juego que intentas añadir ya existe!');
            }
            else {
                toastr.success('Disco y álabes añadidos correctamente!');
                $('.resultados').html(data);
            }    
            
        });        
    }

    //FUNCIÓN CORRECCIÓN NAMEPLATE EN PANTALLA PROGRAMADOR. SE PASA AL ON KEYUP DEL CAMPO NAMEPLATE DEL DIALOG AÑADIR.
    function reemplazar () {

		var t7_08	 = /^D/i;
		var t1000	 = /^M/i;
		var t900	 = /^H/i;
		var txwb	 = /^X/i;
		var t97k      = /^Y/i;
        var t7000    = /^U/i;
        var tten     = /^N/i;
		var $input 	 = $('input#nameplate-programador');
		var valor	 = $('input#nameplate-programador').val();
		var valor2 ='';

		if (t7_08.test(valor)){
			if (/^D8/i.test(valor)){
				valor2 = valor.replace(/^D8/i, 'DH').toUpperCase();
				$input.val(valor2);
				$('input[value="1"]').prop('checked', true);
			}
			else if (/^DE/i.test(valor)) {
				valor2 = valor.replace(/^DE/i, 'DH').toUpperCase();
				$input.val(valor2);
				$('input[value="1"]').prop('checked', true);
			}			
			else if (/^D[^H8]/i.test(valor)) {
				valor2 = valor.replace(/^D/i, 'D8').toUpperCase();
				$input.val(valor2);
				$('input[value="1"]').prop('checked', true);
			}
			else if (/^DH/i.test(valor)){
				$input.val(valor.toUpperCase());
				$('input[value="1"]').prop('checked', true);				
			}
		}
		else if (t1000.test(valor)){
			if(/^M8/i.test(valor)){
				valor2 = valor.replace(/^M8/i, 'MG').toUpperCase();
				$input.val(valor2);
				$('input[value="3"]').prop('checked', true);
			}
			else if(/^M[^G8]/i.test(valor)){
				valor2 = valor.replace(/M/i, 'MG').toUpperCase();
				$input.val(valor2);
				$('input[value="3"]').prop('checked', true);
			}
			else if (/^MG/i.test(valor)){
				$input.val(valor.toUpperCase());
				$('input[value="3"]').prop('checked', true);				
			}
            else if (/^N/i.test(valor)){
                $input.val(valor.toUpperCase());
                $('input[value="3"]').prop('checked', true);                

            }			
		}

		else if (t900.test(valor)){
			if(/^H8/i.test(valor)){
				valor2 = valor.replace(/^H8/i, 'HH').toUpperCase();
				$input.val(valor2);
				$('input[value="2"]').prop('checked', true);
			}
			else if(/^H[^H]/i.test(valor)){
				valor2 = valor.replace(/^H/i, 'HH').toUpperCase();
				$input.val(valor2);
				$('input[value="2"]').prop('checked', true);
			}
			else if (/^HH/i.test(valor)){
				$input.val(valor.toUpperCase());
				$('input[value="2"]').prop('checked', true);	
			}	
		}

        else if (t7000.test(valor)) {
            if(/^U8/i.test(valor)){
                valor2 = valor.replace(/^U8/i, 'UG').toUpperCase();
                $input.val(valor2);
                $('input[value="6"]').prop('checked', true);                

            }
            else if(/^U[^G]/i.test(valor)){
                valor2 = valor.replace(/^U/i, 'UG').toUpperCase();
                $input.val(valor2);
                $('input[value="6"]').prop('checked', true);                

            }            
        }
        else if (tten.test(valor)) {
            if(/^N8/i.test(valor)){
                valor2 = valor.replace(/^N8/i, 'NG').toUpperCase();
                $input.val(valor2);
                $('input[value="5"]').prop('checked', true);

            }
            else if(/^N[^G]/i.test(valor)){
                valor2 = valor.replace(/^N/i, 'NG').toUpperCase();
                $input.val(valor2);
                $('input[value="5"]').prop('checked', true);

            }
            else {
                valor2 = valor.toUpperCase();
                $input.val(valor2);
                $('input[value="5"]').prop('checked', true);
            }
        }

		else if (txwb.test(valor)){
			if(/^X[^8G]/i.test(valor)){
				valor2 = valor.replace(/^X/i, 'XG').toUpperCase();
				$input.val(valor2);
				$('input[value="4"]').prop('checked', true);
			}
			else if(/^X8/i.test(valor)){
				valor2 = valor.replace(/^X8/i, 'XG').toUpperCase();
				$input.val(valor2);
				$('input[value="4"]').prop('checked', true);
			}
			else if (/^XG/i.test(valor)){
				$input.val(valor.toUpperCase());
				$('input[value="4"]').prop('checked', true);	
			}
		}
        else if (t97k.test(valor)){
            if(/^Y[^8HG]/i.test(valor)){
                valor2 = valor.replace(/^Y/i, 'YH').toUpperCase();
                $input.val(valor2);
                $('input[value="8"]').prop('checked', true);
            }
            else if(/^YG/i.test(valor)){
                valor2 = valor.replace(/^YG/i, 'YH').toUpperCase();
                $input.val(valor2);
                $('input[value="8"]').prop('checked', true);
            }
            else if(/^Y8/i.test(valor)){
                valor2 = valor.replace(/^Y8/i, 'YH').toUpperCase();
                $input.val(valor2);
                $('input[value="8"]').prop('checked', true);
            }
            else if (/^YH/i.test(valor)){
                $input.val(valor.toUpperCase());
                $('input[value="8"]').prop('checked', true);
            }
        }
		else {
            $input.val(valor.toUpperCase());
			$('input:radio').prop('checked', false);

		}
	}

    //FUNCIÓN DISABLE SELECCIONAR ETAPA AL CHECKEAR CHECKBOX AÑADIR TODAS LAS ETAPAS
    function disableSeleccionEtapa (){
        var $selectEtapa = $('select[name="etapa-programador"]');
        if ($('#add_todas').is(':checked')){
            $selectEtapa.prop('disabled', true);
            $selectEtapa.fadeOut();
        }
        else {
            $selectEtapa.prop('disabled', false);
            $selectEtapa.fadeIn();
        }    
    }

    //TOOLTIP PARA EL BOTON DE AYUDA (MANUAL PDF)
    $(".nolink").tooltip();

    //SIDEBAR BUTTON
    $('body').on('click', '#sidebar-toggler', function (e) {
        e.preventDefault();
        $('#sidebar-wrapper').attr('id','sidebar-wrapper-toggled');
        $('#wrapper').attr('id','wrapper-toggled');
        $('.sidebar-nav').attr('id','sidebar-nav-toggled');
        $('#wrapper-contents').prepend('<button class="btn btn-default show-sidebar"><i class="fa fa-bars" aria-hidden="true"></i></button>');
    });
    $('body').on('click', '.limpiar-programador', function (e) {
        e.preventDefault();
        $('.dialog-programador').trigger("reset");
    });
    $('body').on('click', '.show-sidebar', function (e) {
        e.preventDefault();
        $('#wrapper-contents').remove('.show-sidebar');
        $('#sidebar-wrapper-toggled').attr('id','sidebar-wrapper');
        $('#wrapper-toggled').attr('id','wrapper');
        $('.sidebar-nav').removeAttr('id');

    });




});