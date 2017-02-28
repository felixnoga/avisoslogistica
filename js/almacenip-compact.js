$(document).ready(function(){

	keepAlive();

	function pasaPantallaDinamico (){
		window.location = 'http://10.1.0.52/avisos/almacen-compact.html';
	}
	var intervalo = setInterval(pasaPantallaDinamico, 20000);//cada 5min=30000seg

	function keepAlive(){
		loadEscariado();
		loadCaseIp();
		loadSupport();
		loadNgvLp1();
		loadNgvIp();
		loadBladeIp();		
	}

	$('body').on('click', '.escariado-resultados a', function(e){
		e.preventDefault();
		$('.suministrarescariado').dialog(dialogEscariado).dialog('open');
	});


	$('body').on('click', '.support-resultados a', function(e){
		e.preventDefault();
		$('.suministrarsupport').dialog(dialogSupport).dialog('open');
	});	

	$('body').on('click', '.caseip-resultados a', function(e){
		e.preventDefault();
		$('.suministrarcase').dialog(dialogCase).dialog('open');
	});	

	$('body').on('click', '.ngvlp1-resultados a', function(e){
		e.preventDefault();
		$('.suministrarngvlp1').dialog(dialogngvlp1).dialog('open');
	});		

	$('body').on('click', '.ngvip-resultados a', function(e){
		e.preventDefault();
		$('.suministrarngvip').dialog(dialogngvip).dialog('open');
	});	

	$('body').on('click', '.alabeip-resultados a', function(e){
		e.preventDefault();
		$('.suministraralabeip').dialog(dialogalabeip).dialog('open');
	});		

	$('body').on('click', 'button.vaciar', function(){
		var clase=$(this).parent().attr('class');//cojemos la clase del contenedor padre de cajas vacias para pasarlo a la función
		var separarclase = clase.split('-');
		var tipo = separarclase[0];
		limpiarCajas(tipo,clase);
	});				

	$('button.refresh').on('click', function(){
		location.reload(true);
	});	
	function loadEscariado(){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {loadEscariado: true}
		})
		.done(function(data) {
			var vacias = parseInt(data.vacias);
			if (vacias>0){

				if(!$('.escariado-cajas>button.vaciar').length){
					$('.escariado-cajas').prepend('<button type="button" class="vaciar btn btn-info btn-sm">Limpiar</button>');
			    }
				if (vacias!==$('.escariado-cajas>img').length){
					$('.escariado-cajas img').remove();
					for (var i = 0; i < vacias; i++) {
						$('.escariado-cajas').append('<img src="img/empty-box-red.png" />')	;
					}
				}					
			}
			if(data.error=="si"){
				if (!$('.escariado-resultados>.no-requerido').length){
					$('.escariado-resultados').prepend('<h4 class="no-requerido text-center"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> No se requiere suministro</h4>');	
				}
			}
			else {
				if($('.escariado-resultados .no-requerido'))	{$('.escariado-resultados .no-requerido').remove();}
				if (!$('.escariado-resultados>.si-requerido').length){
					$('.escariado-resultados').prepend('<h4 class="si-requerido text-center"><strong><span class="glyphicon glyphicon-remove-sign"></span> Requerido: '+data.nameplate+'</strong></h4><h4 class="text-center">Hora de requerimiento: '+data.time+'</h4><p class="text-center"><a href="#"><img src="img/linde_circulo_red.png"/></a></p>');
				}	
				
			}	
		})
		.fail(function() {
			console.log("error al cargar datos de disco eje/ip para almacén");
			
		});
	}

	function loadCaseIp(){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {loadCaseIp: true}
		})
		.done(function(data) {
			var vacias = parseInt(data.vacias);			
			if (vacias>0){
				if(!$('.caseip-cajas>button.vaciar').length){
					$('.caseip-cajas').prepend('<button type="button" class="vaciar btn btn-info btn-sm">Limpiar</button>');
				}	
				if (vacias!==$('.caseip-cajas img').length){
					$('.caseip-cajas img').remove();
					for (var i = 0; i < vacias; i++) {
						$('.caseip-cajas').append('<img src="img/empty-box-blue.png" />')	;
					}	
				}					
			}			
			if(data.error=="si"){
				if (!$('.caseip-resultados>.no-requerido').length){				
					$('.caseip-resultados').prepend('<h4 class="no-requerido text-center"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> No se requiere suministro</h4>');	
				}
			}
			else {
				if($('.caseip-resultados .no-requerido'))	{$('.caseip-resultados .no-requerido').remove();}
				if (!$('.caseip-resultados>.si-requerido').length){	
					$('.caseip-resultados').prepend('<h4 class="si-requerido text-center"><strong><span class="glyphicon glyphicon-remove-sign"></span> Requerido: '+data.nameplate+'</strong></h4><h4 class="text-center">Hora de requerimiento: '+data.time+'</h4><p class="text-center"><a href=""><img src="img/linde_circulo_blue.png"/></a></p>');
				}	
			}	
		})
		.fail(function() {
			console.log("error al cargar datos carcasa IP");
			
		});
	}

	function loadSupport(){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {loadSupport: true}
		})
		.done(function(data) {
			var vacias = parseInt(data.vacias);			
			if (vacias>0){
				if(!$('.support-cajas>button.vaciar').length){
					$('.support-cajas').prepend('<button type="button" class="vaciar btn btn-info btn-sm">Limpiar</button>');
				}
				if (vacias!==$('.support-cajas img').length){					
					$('.support-cajas img').remove();
					for (var i = 0; i < vacias; i++) {
						$('.support-cajas').append('<img src="img/empty-box-green.png" />')	;
					}
				}						
			}				
			if(data.error=="si"){
				if (!$('.support-resultados>.no-requerido').length){				
					$('.support-resultados').prepend('<h4 class="no-requerido text-center"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> No se requiere suministro</h4>');	
				}
			}
			else {
				if($('.support-resultados .no-requerido'))	{$('support-resultados .no-requerido').remove();}
				if (!$('.support-resultados>.si-requerido').length){
					$('.support-resultados').prepend('<h4 class="si-requerido text-center"><strong><span class="glyphicon glyphicon-remove-sign"></span> Requerido: '+data.nameplate+'</strong></h4><h4 class="text-center">Hora de requerimiento: '+data.time+'</h4><p class="text-center"><a href="#"><img src="img/linde_circulo_green.png"/></a></p>');
				}
			}	
		})
		.fail(function() {
			console.log("error al cargar datos para el soporte hp");
			
		});
	}

	function loadNgvLp1(){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {loadNgvLp1: true}
		})
		.done(function(data) {
			var vacias = parseInt(data.vacias);			
			if (vacias>0){
				if(!$('.ngvlp1-cajas>button.vaciar').length){
					$('.ngvlp1-cajas').prepend('<button type="button" class="vaciar btn btn-info btn-sm">Limpiar</button>');
				}
				if (vacias!==$('.ngvlp1-cajas img').length){					
					$('.ngvlp1-cajas img').remove();	
					for (var i = 0; i < vacias; i++) {
						$('.ngvlp1-cajas').append('<img src="img/empty-box-purple.png" />')	;
					}
				}						
			}				
			if(data.error=="si"){
				if (!$('.ngvlp1-resultados>.no-requerido').length){
					$('.ngvlp1-resultados').prepend('<h4 class="no-requerido text-center"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> No se requiere suministro</h4>');	
				}
			}
			else {
				if($('.ngvlp1-resultados .no-requerido'))	{$('.ngvlp1-resultados .no-requerido').remove();}
				if (!$('.ngvlp1-resultados>.si-requerido').length){
					$('.ngvlp1-resultados').prepend('<h4 class="si-requerido text-center"><strong><span class="glyphicon glyphicon-remove-sign"></span> Requerido: '+data.nameplate+'</strong></h4><h4 class="text-center">Hora de requerimiento: '+data.time+'</h4><p class="text-center"><a href="#"><img src="img/linde_circulo_purple.png"/></a></p>');
				}
			}	
		})
		.fail(function() {
			console.log("error al cargar datos para ngvlp1");
			
		});
	}	

	function loadNgvIp(){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {loadNgvIp: true}
		})
		.done(function(data) {
			var vacias = parseInt(data.vacias);			
			if (vacias>0){
				if(!$('.ngvip-cajas>button.vaciar').length){
					$('.ngvip-cajas').prepend('<button type="button" class="vaciar btn btn-info btn-sm">Limpiar</button>');
				}	
				if (vacias!==$('.ngvip-cajas img').length){				
					$('.ngvip-cajas img').remove();
					for (var i = 0; i < vacias; i++) {
						$('.ngvip-cajas').append('<img src="img/empty-box-orange.png" />')	;
					}	
				}					
			}				
			if(data.error=="si"){
				if (!$('.ngvip-resultados>.no-requerido').length){				
					$('.ngvip-resultados').prepend('<h4 class="no-requerido text-center"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> No se requiere suministro</h4>');	
				}
			}
			else {
				if($('.ngvip-resultados .no-requerido'))	{$('.ngvip-resultados .no-requerido').remove();}
				if (!$('.ngvip-resultados>.si-requerido').length){				
					$('.ngvip-resultados').prepend('<h4 class="si-requerido text-center"><strong><span class="glyphicon glyphicon-remove-sign"></span> Requerido: '+data.nameplate+'</strong></h4><h4 class="text-center">Hora de requerimiento: '+data.time+'</h4><p class="text-center"><a href="#"><img src="img/linde_circulo_orange.png"/></a></p>');
				}
			}	
		})
		.fail(function() {
			console.log("error al cargar datos para ngvlp1");
			
		});
	}

	function loadBladeIp(){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {loadBladeIp: true}
		})
		.done(function(data) {
			var vacias = parseInt(data.vacias);			
			if (vacias>0){
				if(!$('.alabeip-cajas>button.vaciar').length){
					$('.alabeip-cajas').prepend('<button type="button" class="vaciar btn btn-info btn-sm">Limpiar</button>');
				}	
				if (vacias!==$('.alabeip-cajas img').length){				
					$('.alabeip-cajas img').remove();
					for (var i = 0; i < vacias; i++) {
						$('.alabeip-cajas').append('<img src="img/empty-box-asphalt.png" />')	;
					}
				}						
			}				
			if(data.error=="si"){
				if (!$('.alabeip-resultados>.no-requerido').length){
					$('.alabeip-resultados').prepend('<h4 class="no-requerido text-center"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> No se requiere suministro</h4>');	
				}
			}
			else {
				if($('.alabeip-resultados .no-requerido'))	{$('.alabeip-resultados .no-requerido').remove();}
				if (!$('.alabeip-resultados>.si-requerido').length){

					$('.alabeip-resultados').prepend('<h4 class="si-requerido text-center"><strong><span class="glyphicon glyphicon-remove-sign"></span> Requerido: '+data.nameplate+'</strong></h4><h4 class="text-center">Hora de requerimiento: '+data.time+'</h4><p class="text-center"><a href="#"><img src="img/linde_circulo_asphalt.png"/></a></p>');
				}
			}	
		})
		.fail(function() {
			console.log("error al cargar datos para ngvlp1");
			
		});
	}		
	function suministrarEscariado (){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {suministrarEscariado: true}
		})
		.done(function() {
			$('.escariado-resultados').children().not('.escariado-cajas').remove();
			loadEscariado();
		})
		.fail(function() {
			console.log("error suministrar escariado");
			
		});		

	}

	function suministrarSupport (){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {suministrarSupport: true}
		})
		.done(function() {
			$('.support-resultados').children().not('.support-cajas').remove();
			loadSupport();
		})
		.fail(function() {
			console.log("error suministrar soporte");
			
		});		

	}	

	function suministrarCase (){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {suministrarCase: true}
		})
		.done(function() {
			$('.caseip-resultados').children().not('.caseip-cajas').remove();
			loadCaseIp();
		})
		.fail(function() {
			console.log("error suministrar case");
			
		});		

	}	

	function suministrarNgvLp1 (){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {suministrarNgvLp1: true}
		})
		.done(function() {
			$('.ngvlp1-resultados').children().not('.ngvlp1-cajas').remove();
			loadNgvLp1();
		})
		.fail(function() {
			console.log("error suministrar NGVLP1");
			
		});		

	}			

	function suministrarNgvIp (){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {suministrarNgvIp: true}
		})
		.done(function() {
			$('.ngvip-resultados').children().not('.ngvip-cajas').remove();
			loadNgvIp();
		})
		.fail(function() {
			console.log("error suministrar NGV IP");
			
		});		

	}

	function suministrarBladeIp (){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {suministrarBladeIp: true}
		})
		.done(function() {
			$('.alabeip-resultados').children().not('.alabeip-cajas').remove();
			loadBladeIp();
		})
		.fail(function() {
			console.log("error suministrar BLADE IP");
			
		});		

	}	

	//FUNCION LIMPIAR CAJAS VACIAS. tipo DEBE SER: alabeip, ngvip, ngvlp1, escariado, caseip o support (la primera parte de la clase del contenedor, antes del -)
	// clasecontenedor ES LA CLASE DEL DIV QUE CONTIENE LAS CAJAS VACIAS (ej. alabeip-cajas)
	function limpiarCajas (tipo, clasecontenedor){
		$.ajax({
			url: 'almacen.php',
			method: 'POST',
			dataType: 'json',
			data: {limpiar: tipo}
		})
		.done(function() {
			$('.'+clasecontenedor).children().remove();
		})
		.fail(function() {
			console.log("error LIMPIAR CAJAS");
			
		});		
	}			




var dialogEscariado = {
	title: 'Disco y eje IP',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			suministrarEscariado();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};	

var dialogSupport = {
	title: 'Soporte HP/IP',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			suministrarSupport();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};	

var dialogCase = {
	title: 'Carcasa IP',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			suministrarCase();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

var dialogngvlp1 = {
	title: 'NGVLP1',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			suministrarNgvLp1();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

var dialogngvip = {
	title: 'NGV IP',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			suministrarNgvIp();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

var dialogalabeip = {
	title: 'ALABES IP',
	autoOpen: false,
	modal: true,
	minWidth: 400,
	buttons: {
		'OK': function(){
			suministrarBladeIp();
			$(this).dialog('close');
		},
		'CANCELAR': function(){
			$(this).dialog('close');
		}
	}
};

$(".nolink").tooltip();

});