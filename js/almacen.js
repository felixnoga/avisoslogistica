$(document).ready(function(){

	
	function loadContents (){

		cargarDiscos();
		cargarAlabes();
		cargarNgvs();
		getBufferDiscos();
		getBufferAlabes();
		getBufferNgvs();
		getSuministrosLineaIp();
		getSuministrosLineaLp();
		checkBufferQty();
	}

	loadContents();

	var keepAlive = setInterval(loadContents, 300000);//cada 5min=300000mseg


	//BOTON IMAGEN LINDE (SUMINISTRAR)
	var $body = $('body');
	$body.on('click', 'a.suministraralabe', suministrarAlabe);

	$body.on('click', 'a.suministrardisco', suministrarDisco);

	$body.on('click', 'a.suministrarngv', suministrarNgv);


	$body.on('click', 'span.deshacer-discos', function(e){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		$('.deshacerDiscos').dialog('open');
	});	

	$body.on('click', 'span.deshacer-alabes', function(e){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		$('.deshacerAlabes').dialog('open');
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
	 		var id = $(this).attr('id');
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removedisco: 1, id: id}
				})
			.done(function(){
				getBufferDiscos();
			});
	});		

	 $('body').on('click', '.ocupadaalabes',function(){
	 		var id = $(this).attr('id');
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removealabes: 1, id: id}
				})
			.done(function(){
				getBufferAlabes();
			});
	});	

	 $('body').on('click', '.ocupadangv',function(){
	 		var id = $(this).attr('id');
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {removengv: 1, id: id}
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
		$('.resultadosdiscos').load('almacen.php', {alldiscos: "true"});		
	}

	function cargarAlabes(){
		$('.resultadosalabes').load('almacen.php', {allalabes: "true"});		
	}

	function cargarNgvs(){
		$('.resultadosngvs').load('almacen.php', {allngvs: "true"});		
	}	

	function suministrarDisco(e){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		var id = $(this).attr('href');
		var numeroenbuffer = $(this).closest('.discos').find('.ocupadadisco').length;
		var numeroenbuffercurvicos = $(this).closest('.discos').find('.buffercurvicos .btn').length;
		var escurvico = $(this).closest('tr').find('img[src="img/discocurvico.png"]').length? true: false;
		var nameplate = $(this).closest('tr').find('td:eq(0)').text();
		var etapa1 = $(this).closest('tr').find('td:eq(1)').text().substring(6);
		var etapa = $.trim(etapa1);
		if (numeroenbuffer<8 || escurvico) {
			if (escurvico && !numeroenbuffercurvicos<1) {
				$('#buffer-discos-curvico-lleno').modal('show');
			}	
			else {
				$.ajax({
					method: 'POST',
					url: 'almacen.php',
					data: {suministrardisco: true, id:id, nameplate: nameplate, etapa: etapa},
					dataType: 'json'

					})
				.done(function(data){
					$('.resultadosdiscos').load('almacen.php', {alldiscos: "true"});
					getBufferDiscos();
				});	
			}		
		
		}
		else {
			$('#buffer-discos-lleno').modal('show');
		}

		}
	function suministrarNgv(e){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		var numeroenbuffer = $(this).closest('.ngvs').find('.ocupadangv').length;
		var id = $(this).attr('href');
		id = $.trim(id);
		if (numeroenbuffer<8) {
			$.ajax({
				method: 'POST',
				url: 'almacen.php',
				data: {suministrarngv: true, id:id},
				dataType: 'json'

				})
			.done(function(data){
					$('.resultadosngvs').load('almacen.php', {allngvs: "true"});
					getBufferNgvs();
				});
		}
		else {
			$('#buffer-ngvs-lleno').modal('show');
		}

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
				checkBufferQty();
				var num= data.length;
				if(num===0) {
					$('.bufferdiscos, .buffercurvicos').empty().html('<div class="alert alert-danger">VACIO</div>');
				
				}
				else {
					$('.buffercurvicos').children().not('.row').remove();
					$('.bufferdiscos').empty().html(function(){
						var botones='';
						var elementos='';
						var patt700=/^D/i; 
						var patt900=/^H/i;
						var patt1000=/^M/i;
						var pattxwb=/^X/i;
						var patt7000=/^U/i;
						var pat97k=/^Y/i;
						var patten=/^N/i;	
						var patdes=/^[JSRBYNPU]/i;	
		
						for (var i=0; i<num; i++){
							if (patt700.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==3) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-t700" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}
								else {
									botones+='<button class="ocupadadisco btn btn-t700" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}
							}
							else if (patt900.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==4) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-success" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}
								else {
									botones+='<button class="ocupadadisco btn btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}								
							}
							else if (pattxwb.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-warning" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}	
								else {
									botones+='<button class="ocupadadisco btn btn-warning" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}							
							}
							else if (pat97k.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-97k" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}	
								else {							
									botones+='<button class="ocupadadisco btn btn-97k" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}
							}
							else if (patten.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-ten" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}	
								else {							
									botones+='<button class="ocupadadisco btn btn-ten" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}									
							}
							else if (patt7000.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-t7000" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}
								else {								
									botones+='<button class="ocupadadisco btn btn-t7000" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}
							}																		
							else if (patt1000.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-danger" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
								}	
								else {							
									botones+='<button class="ocupadadisco btn btn-danger" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
								}									
							}	
							else {
								botones+='<button class="ocupadadisco btn btn-default" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
							}											
						}
						return botones;
					});		

				}

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
				checkBufferQty();
				var num = data.length;
				if(num===0) {

					$('.bufferalabes').empty().html('<div class="alert alert-danger">VACIO</div>');					
				}
				else {			
					$('.bufferalabescurvicos').children().not('.row').remove();	
					$('.bufferalabes').empty().html(function(){
						var elementos='';
						var patt700=/^D/i; 
						var patt900=/^H/i;
						var patt1000=/^M/i;
						var pattxwb=/^X/i;
						var patt7000=/^U/i;
						var pat97k=/^Y/i;
						var patten=/^N/i;	
						var patdes=/^[JSRBYNPU]/i;				
						for (var i=0; i<data.length; i++){
							var etapa;

							switch (parseInt(data[i].alabe_piezas_id_pieza)) {
								case 46:
									etapa = 'LP1';
									break;
								case 47:
									etapa = 'LP2';
									break;
								case 48:
									etapa = 'LP3';
									break;
								case 49:
									etapa = 'LP4';
									break;	
								case 50:
									etapa = 'LP5';
									break;
								case 51:
									etapa = 'LP6';
									break;																															

							}

							if (patt700.test(data[i].nameplate)) {	
								if (etapa=="LP3") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-t700" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {												
									elementos+='<button class="ocupadaalabes btn btn-t700" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}
							}
							else if (patt900.test(data[i].nameplate)) {		
								if (etapa=="LP4") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-success" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {										
									elementos+='<button class="ocupadaalabes btn btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}
							}
							else if (patt1000.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-danger" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {																				
									elementos+='<button class="ocupadaalabes btn btn-danger" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}
							}
							else if (patt7000.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-t7000" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {							
									elementos+='<button class="ocupadaalabes btn btn-t7000" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}									
							}
							else if (patten.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-ten" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {							
									elementos+='<button class="ocupadaalabes btn btn-ten" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';	
								}									
							}							
							else if (pattxwb.test(data[i].nameplate)) {	
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-warning" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {											
									elementos+='<button class="ocupadaalabes btn btn-warning" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}
							}
							else if (pat97k.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-97k" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}	
								else {							
									elementos+='<button class="ocupadaalabes btn btn-97k" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}
							}	
							else {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-default" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
								}		
								else {						
								elementos+='<button class="ocupadaalabes btn btn-default" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}

							}																	
						}
						return elementos;
							
					});					
				}				
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
				checkBufferQty();
				var num= data.length;
				if(num===0) {
					$('.bufferngvs').html('<div class="alert alert-danger">VACIO</div>');
				}
				else {
				
						$('.bufferngvs').empty().html(function(){
							var etapa;
							var botones='';
							var patt700=/^D/i; 
							var patt900=/^H/i;
							var patt1000=/^M/i;
							var pattxwb=/^X/i;
							var patt7000=/^U/i;
							var pat97k=/^Y/i;
							var patten=/^N/i;	
							var patdes=/^[JSRBYNPU]/i;
							for (var i=0; i<data.length; i++)	{

								if (patt700.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-t700" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
								else if (patt900.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}	
								else if (patt1000.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-danger" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}			
								else if (pattxwb.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-warning" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
								else if (pat97k.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-97k" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
								else if (patten.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-ten" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}						
								else if (patt7000.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-t7000" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}														
								else if (patdes.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-default" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}	
								else {																	
									botones += '<button class="ocupadangv btn btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
							}
							return botones;
						});						
				}				

			});	
	}				

	function suministrarAlabe(e){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		var id = $(this).attr('href');
		var escurvico = $(this).closest('tr').find('img[src="img/discocurvico.png"]').length?true:false;
		var numeroenbuffer = $(this).closest('.alabes').find('.ocupadaalabes').length;
		var numerocurvicosenbuffer = $(this).closest('.alabes').find('.bufferalabescurvicos .btn').length;
		if (numeroenbuffer<8 || escurvico) {
			if (escurvico && !numerocurvicosenbuffer<1) {
				$('#buffer-alabes-curvico-lleno').modal('show');
			}
			else {
				$.ajax({
					method: 'POST',
					url: 'almacen.php',
					data: {suministraralabe: true, id:id}
				})
				.done(function(data){			
					$('.resultadosalabes').load('almacen.php', {allalabes: "true"});
					getBufferAlabes();

				});
			}
		
		}
		else {
			$('#buffer-alabes-lleno').modal('show');				
		}

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


	function deshacerSuministroDisco () {
		$.post('almacen.php', {deshacerdisco: true}, function(){cargarDiscos(); getBufferDiscos();});
	}	

	function deshacerSuministroAlabes () {
		$.post('almacen.php', {deshaceralabes: true}, function(){cargarAlabes(); getBufferAlabes();});
	}	

	function getSuministrosLineaIp () {
		$.post('almacen.php', {getsuministroslineaip: true} , function(data){
			var contador=0;
			$('.suministros-ip').empty();
			for (var i=0; i<data.length; i++) {
				
				switch (i) {
					case 0:
						if (data[0].nameplate!='no') {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/caseip.png" alt=""> CARCASA IP: <span class="si-requerido">'+data[0].nameplate+' </span><i class="fa fa-2x fa-check-circle-o suministrar-linea-ip" id="case_ip" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/caseip.png" alt=""> CARCASA IP: <span class="no-requerido">NO REQUERIDA </span></li><li role="separator"></li><li class="divider"></li>');
						}
						break;

					case 1:
						if (data[1].nameplate!='no') {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/soporte.png" alt=""> SOPORTE HP/IP: <span class="si-requerido">'+data[1].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-ip" id="soporte" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/soporte.png" alt=""> SOPORTE HP/IP: <span class="no-requerido">NO REQUERIDO </span></li><li role="separator" class="divider"></li>');
						}	
						break;		

					case 2:
						if (data[2].nameplate!='no') {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/ejediscoip.png" alt=""> EJE/DISCO IP: <span class="si-requerido">'+data[2].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-ip" id="escariado" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/ejediscoip.png" alt=""> EJE/DISCO IP: <span class="no-requerido">NO REQUERIDOS </span></li><li role="separator" class="divider"></li>');
						}	
						break;		

					case 3:
						if (data[3].nameplate!='no') {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/ngvlp1.png" alt=""> NGVS LP1: <span class="si-requerido">'+data[3].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-ip" id="ngv_lp1" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/ngvlp1.png" alt="">  NGVS LP1: <span class="no-requerido">NO REQUERIDOS </span></li><li role="separator" class="divider"></li>');
						}	
						break;	

					case 4:
						if (data[4].nameplate!='no') {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/ngvip.png" alt=""> NGVS IP: <span class="si-requerido">'+data[4].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-ip" id="ngv_ip" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/ngvip.png" alt="">  NGVS IP: <span class="no-requerido">NO REQUERIDOS </span></li><li role="separator" class="divider"></li>');
						}	
						break;		

					case 5:
						if (data[5].nameplate!='no') {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/bladeip.png" alt=""> ÁLABES IP: <span class="si-requerido">'+data[5].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-ip" id="alabes_ip" aria-hidden="true"></i></li>');
							contador++;
						}
						else {
							$('.suministros-ip').append('<li><img class="img-responsive" src="img/bladeip.png" alt=""> ÁLABES IP: <span class="no-requerido">NO REQUERIDOS </span></li>');
						}	
						break;	

				}
				
			}
            if ($('span.contador').length) {
                $('.btn-linea-ip i.fa, .btn-linea-ip span.contador').remove();
            }
			if (contador>0) {
				$('.btn-linea-ip').prepend('<span class="contador">'+contador+'</span><i class="fa fa-bell" aria-hidden="true"></i>').removeClass('btn-success').addClass('btn-danger');
			}

			else {
				$('.btn-linea-ip').removeClass('btn-danger').addClass('btn-success');
			}			
		});
	}

	function getSuministrosLineaLp () {
		$.post('almacen.php', {getsuministroslinealp: true} , function(data){
			var contador=0;
			$('.suministros-lp').empty();
			for (var i=0; i<data.length; i++) {
				
				switch (i) {
					case 0:
						if (data[0].nameplate!='no') {
							$('.suministros-lp').append('<li><img class="img-responsive" src="img/ejelp.png" alt=""> EJE 08 LP: <span class="si-requerido">'+data[0].nameplate+' </span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-lp" id="eje_lp" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-lp').append('<li><img class="img-responsive" src="img/ejelp.png" alt=""> EJE 08 LP: <span class="no-requerido">NO REQUERIDO</span></li><li role="separator"></li><li class="divider"></li>');
						}
						break;

					case 1:
						if (data[1].nameplate!='no') {
							$('.suministros-lp').append('<li> <img class="img-responsive" src="img/tbh.png" alt=""> TBH: <span class="si-requerido">'+data[1].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-lp" id="tbh" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-lp').append('<li> <img class="img-responsive" src="img/tbh.png" alt=""> TBH: <span class="no-requerido">NO REQUERIDO </span></li><li role="separator" class="divider"></li>');
						}
						break;		

					case 2:
						if (data[2].nameplate!='no') {
							$('.suministros-lp').append('<li><img class="img-responsive" src="img/caselp.png" alt=""> CARCASA 08: <span class="si-requerido">'+data[2].nameplate+'</span> <i class="fa fa-2x fa-check-circle-o suministrar-linea-lp" id="case_lp" aria-hidden="true"></i></li><li role="separator" class="divider"></li>');
							contador++;
						}
						else {
							$('.suministros-lp').append('<li><img class="img-responsive" src="img/caselp.png" alt=""> CARCASA 08: <span class="no-requerido">NO REQUERIDA</span></li><li role="separator" class="divider"></li>');
						}	
						break;		

				}
				
			}
            if ($('.btn-integracion span.contador').length) {
                $('.btn-integracion i.fa, .btn-integracion span.contador').remove();
            }
			if (contador>0) {
				$('.btn-integracion').prepend('<span class="contador">'+contador+'</span><i class="fa fa-bell" aria-hidden="true"></i>').removeClass('btn-success').addClass('btn-danger');
			}

			else {
				$('.btn-integracion').removeClass('btn-danger').addClass('btn-success');
			}			
		});
	}

	function checkBufferQty () {
		$.post('almacen.php', {checkbufferqty: 1})
		.done(function(data){
			if (data.bufferqtydiscos==0 || data.bufferqtyalabes==0 || data.bufferalabescurvicos==0 ||data.buffercurvicos==0 ||data.bufferqtyngvs==0) {
				if ($('.encabezado').length) {
					$('.encabezado').removeClass('encabezado').addClass('encabezado-danger');
				}
				if(data.buffercurvicos==0) {
					$('.buffercurvicos').children().not('.row').remove();
					$('.buffercurvicos').prepend('<p class="text-center" style="color:#ff7272"><small>Cúrvicos vacío</small><i class="fa fa-2x fa-exclamation-triangle"></i></p>');
					if (!$('.btn-curvicos:eq(0)').length){
						$('.menu-almacen .btn-group:eq(0)').prepend('<button class="btn btn-danger btn-curvicos"><i class="fa fa-cog"></i> Cúrvicos</btn>');
					}	
				}
				if(data.bufferalabescurvicos==0) {
					$('.bufferalabescurvicos').children().not('.row').remove();
					$('.bufferalabescurvicos').prepend('<p class="text-center" style="color:#ff7272"><small>Cúrvicos vacío</small><i class="fa fa-2x fa-exclamation-triangle"></i></p>');
					if (!$('.btn-curvicos:eq(0)').length){
						$('.menu-almacen .btn-group:eq(0)').prepend('<button class="btn btn-danger btn-curvicos"><i class="fa fa-cog"></i> Cúrvicos</btn>');
					}					
				}				
			}
			else {
				if($('.encabezado-danger').length) {
					$('.encabezado-danger').removeClass('encabezado-danger').addClass('encabezado');
				}
				if($('.btn-curvicos').length) {
					$('.btn-curvicos').remove();
				}
			}
		});
	}

   $('body').on('click', '.suministrar-linea-ip', function(){
	var parte = $(this).attr('id');
	$.post('almacen.php', {suministrarlineaip:1, parte: parte})
		.done(function () {
			$('.suministros-ip').empty();
			getSuministrosLineaIp();
        });
   });

      $('body').on('click', '.suministrar-linea-lp', function(){
	var parte = $(this).attr('id');
	$.post('almacen.php', {suministrarlinealp:1, parte: parte})
		.done(function () {
			$('.suministros-lp').empty();
			getSuministrosLineaLp();
        });
   });

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