$(document).ready(function(){

	
	function loadContents (){

		getBufferDiscos();
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
			console.log(data);
		});
	}	

});