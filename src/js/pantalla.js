$(document).ready(function(){

	
	function loadContents (){

		getBufferDiscos();
		getBufferAlabes();
		getBufferNgvs();
		getSuministrosLineaIp();
		getSuministrosLineaLp();
	}

	loadContents();

	var keepAlive = setInterval(loadContents, 300000);//cada 5min=300000mseg

	function getBufferDiscos(){
		$.ajax({
			method: 'POST',
			url: 'almacen.php',
			data: {bufferdiscos: true},
			dataType: 'json'
		})
		.done(function(data) {
				var num = data.length;
				if(num===0) {
					$('.bufferdiscos, .buffercurvicos').empty().html('<div class="alert alert-danger">VACIO</div>');
				}
				else {
					$('.buffercurvicos').children().not('.row').remove();
					$('.bufferdiscos').empty().html(function(){
						var botones='';
						var patt700=/^D/i;
						var patt900=/^H/i;
						var patt1000=/^M/i;
						var pattxwb=/^X/i;
						var patt7000=/^U/i;
						var pat97k=/^Y/i;
						var patten=/^N/i;	
						var patdes=/^[JSRBYNPU]/i;
						var contador=0;
						var contadorcurvicos=0;
		
						for (var i=0; i<num; i++){
							if (patt700.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==3) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-pantalla btn-t700" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {
									botones+='<button class="ocupadadisco btn btn-pantalla btn-t700" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}
							else if (patt900.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==4) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btnbtn-pantalla  btn-success" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {
									botones+='<button class="ocupadadisco btn btn-pantalla btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}
							else if (pattxwb.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-pantalla btn-warning" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {
									botones+='<button class="ocupadadisco btn btn-pantalla btn-warning" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}
							else if (pat97k.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-pantalla btn-97k" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {							
									botones+='<button class="ocupadadisco btn btn-pantalla btn-97k" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}
							else if (patten.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-pantalla btn-ten" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {							
									botones+='<button class="ocupadadisco btn btn-pantalla btn-ten" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}
							else if (patt7000.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-pantalla btn-t7000" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {								
									botones+='<button class="ocupadadisco btn btn-pantalla btn-t7000" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}																		
							else if (patt1000.test(data[i].nameplate)) {
								if (data[i].disco_piezas_id_pieza==5) {
									$('.buffercurvicos').prepend('<button class="ocupadadisco btn btn-pantalla btn-danger" id="'+data[i].id+'"><img src="img/curvicos.png"></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>');
									contadorcurvicos++;
								}
								else {							
									botones+='<button class="ocupadadisco btn btn-pantalla btn-danger" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
									contador++;
								}
							}	
							else {
								botones+='<button class="ocupadadisco btn btn-pantalla btn-default" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i></br><small>LP'+data[i].disco_piezas_id_pieza +' ' +data[i].nameplate+'</small></button>';
							}											
						}
						if (contadorcurvicos===0) {
                            $('.buffercurvicos').empty().html('<div class="alert alert-danger">VACIO</div>');
						}
						if (contador===0) {
                            $('.bufferdiscos').empty().html('<div class="alert alert-danger">VACIO</div>');
						}
						if (contador!==0){
                            return botones;
						}

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
				var num = data.length;
				var $contadorcurvicos=0;
				var $contador=0;

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
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-t700" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}	
								else {												
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-t700" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
									$contador++;
								}
							}
							else if (patt900.test(data[i].nameplate)) {		
								if (etapa=="LP4") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-success" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}	
								else {										
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
									$contador++;
								}
							}
							else if (patt1000.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-danger" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}	
								else {																				
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-danger" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
									$contador++;
								}
							}
							else if (patt7000.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-t7000" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}
								else {							
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-t7000" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
									$contador++;
								}
							}
							else if (patten.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-ten" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}
								else {							
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-ten" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';	
									$contador++;
								}
							}							
							else if (pattxwb.test(data[i].nameplate)) {	
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-warning" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}
								else {											
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-warning" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
									$contador++;
								}
							}
							else if (pat97k.test(data[i].nameplate)) {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-97k" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}
								else {							
									elementos+='<button class="ocupadaalabes btn btn-pantalla btn-97k" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
									$contador++;
								}
							}	
							else {
								if (etapa=="LP5") {
									$('.bufferalabescurvicos').prepend('<button class="ocupadaalabes btn btn-pantalla btn-default" id="'+data[i].id+'"><img src="img/curvicos.png"><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>');
									$contadorcurvicos++;
								}
								else {						
								elementos+='<button class="ocupadaalabes btn btn-pantalla btn-default" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+etapa+' '+data[i].nameplate+'</small></button>';
								}

							}																	
						}
                        if($contador===0) {
                            $('.bufferalabes').empty().html('<div class="alert alert-danger">VACIO</div>');
                        }
                        if ($contadorcurvicos===0){
                            $('.bufferalabescurvicos').empty().html('<div class="alert alert-danger">VACIO</div>');
						}
						if ($contador!==0) {
                            return elementos;
                        }
							
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
									botones += '<button class="ocupadangv btn btn-pantalla btn-t700" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
								else if (patt900.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}	
								else if (patt1000.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-danger" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}			
								else if (pattxwb.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-warning" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
								else if (pat97k.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-97k" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
								else if (patten.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-ten" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}						
								else if (patt7000.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-t7000" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}														
								else if (patdes.test(data[i].nameplate)) {
									botones += '<button class="ocupadangv btn btn-pantalla btn-default" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}	
								else {																	
									botones += '<button class="ocupadangv btn btn-pantalla btn-success" id="'+data[i].id+'"><i class="fa fa-2x fa-archive" aria-hidden="true"></i><br/><small>'+data[i].etapa+' '+data[i].nameplate+'</small></button>';						
								}
							}
							return botones;
						});						
				}				

			});	
	}

	function getSuministrosLineaIp () {
		$.post('almacen.php', {getsuministroslineaip: true} , function(data){
			$('.pantalla-suministros-ip ul').empty();
			for (var i=0; i<data.length; i++) {
				
				switch (i) {
					case 0:
						if (data[0].nameplate!='no') {
							$('.pantalla-suministros-ip ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/caseip.png" alt=""> CARCASA IP: <br><span class="si-requerido-pantalla">'+data[0].nameplate+' </span></li><li role="separator" class="divider"></li>');
						}
						else {
							$('.pantalla-suministros-ip ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/caseip.png" alt=""> CARCASA IP: <br><span class="no-requerido">NO REQUERIDA </span></li><li role="separator"></li><li class="divider"></li>');
						}
						break;

					case 1:
						if (data[1].nameplate!='no') {
							$('.pantalla-suministros-ip ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/soporte.png" alt=""> SOPORTE HP/IP: <br<<span class="si-requerido-pantalla">'+data[1].nameplate+'</span></li><li role="separator" class="divider"></li>');
						}
						else {
							$('.pantalla-suministros-ip ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/soporte.png" alt=""> SOPORTE HP/IP: <br><span class="no-requerido">NO REQUERIDO </span></li><li role="separator" class="divider"></li>');
						}	
						break;		

					case 2:
						if (data[2].nameplate!='no') {
							$('.pantalla-suministros-ip ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/ejediscoip.png" alt=""> EJE/DISCO IP: <br><span class="si-requerido-pantalla">'+data[2].nameplate+'</span> </li><li role="separator" class="divider"></li>');
						}
						else {
							$('.pantalla-suministros-ip ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/ejediscoip.png" alt=""> EJE/DISCO IP: <br><span class="no-requerido">NO REQUERIDOS </span></li><li role="separator" class="divider"></li>');
						}	
						break;		

					case 3:
						if (data[3].nameplate!='no') {
							$('.pantalla-suministros-ip ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/ngvlp1.png" alt=""> NGVS LP1: <br><span class="si-requerido-pantalla">'+data[3].nameplate+'</span> </li><li role="separator" class="divider"></li>');
						}
						else {
							$('.pantalla-suministros-ip ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/ngvlp1.png" alt="">  NGVS LP1: <br><span class="no-requerido">NO REQUERIDOS </span></li><li role="separator" class="divider"></li>');
						}	
						break;	

					case 4:
						if (data[4].nameplate!='no') {
							$('.pantalla-suministros-ip ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/ngvip.png" alt=""> NGVS IP: <br><span class="si-requerido-pantalla">'+data[4].nameplate+'</span> </li><li role="separator" class="divider"></li>');
						}
						else {
							$('.pantalla-suministros-ip ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/ngvip.png" alt="">  NGVS IP: <br><span class="no-requerido">NO REQUERIDOS </span></li><li role="separator" class="divider"></li>');
						}	
						break;		

					case 5:
						if (data[5].nameplate!='no') {
							$('.pantalla-suministros-ip ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/bladeip.png" alt=""> ÁLABES IP: <br><span class="si-requerido-pantalla">'+data[5].nameplate+'</span> </li>');
						}
						else {
							$('.pantalla-suministros-ip ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/bladeip.png" alt=""> ÁLABES IP: <br><span class="no-requerido">NO REQUERIDOS </span></li>');
						}	
						break;	

				}
				
			}	
		});
	}

	function getSuministrosLineaLp () {
		$.post('almacen.php', {getsuministroslinealp: true} , function(data){
			$('.suministros-lp-pantalla ul').empty();
			for (var i=0; i<data.length; i++) {
				
				switch (i) {
					case 0:
						if (data[0].nameplate!='no') {
							$('.suministros-lp-pantalla ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/ejelp.png" alt=""> EJE 08 LP: <span class="si-requerido-pantalla">'+data[0].nameplate+' </span> </li>');
						}
						else {
							$('.suministros-lp-pantalla ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/ejelp.png" alt=""> EJE 08 LP: <span class="no-requerido">NO REQUERIDO</span></li></li>');
						}
						break;

					case 1:
						if (data[1].nameplate!='no') {
							$('.suministros-lp-pantalla ul').append('<li class="text-center li-requerido-pantalla"> <img class="img-responsive center-block" src="img/tbh.png" alt=""> TBH: <span class="si-requerido-pantalla">'+data[1].nameplate+'</span> </li>');
						}
						else {
							$('.suministros-lp-pantalla ul').append('<li class="text-center"> <img class="img-responsive center-block" src="img/tbh.png" alt=""> TBH: <span class="no-requerido">NO REQUERIDO </span></li>');
						}
						break;		

					case 2:
						if (data[2].nameplate!='no') {
							$('.suministros-lp-pantalla ul').append('<li class="text-center li-requerido-pantalla"><img class="img-responsive center-block" src="img/caselp.png" alt=""> CARCASA 08: <span class="si-requerido-pantalla">'+data[2].nameplate+'</span> </li>');
						}
						else {
							$('.suministros-lp-pantalla ul').append('<li class="text-center"><img class="img-responsive center-block" src="img/caselp.png" alt=""> CARCASA 08: <span class="no-requerido">NO REQUERIDA</span></li>');
						}	
						break;		

				}
				
			}
		
		});
	}		

});