$(document).ready(function(){

	$('.rectindex:eq(0)').on({
		'mouseenter': function(){
				$('.one').fadeIn({queue: false});
				$('.linkindex:eq(0), .linkindex:eq(1)').css('color', '#174791');
				$(this).css('border', '1px solid #174791');
			},
		'mouseleave': function(){
				$('.one').fadeOut({queue: false});
				$('.linkindex:eq(0), .linkindex:eq(1)').css('color', '#A1A2A4');
				$(this).css('border', '1px solid #A1A2A4');				
			}
	});

	$('.rectindex:eq(1)').on({
		'mouseenter': function(){
				$('.two').fadeIn({queue: false});
				$('.linkindex:eq(2), .linkindex:eq(3)').css('color', '#174791');
				$(this).css('border', '1px solid #174791');				
			},
		'mouseleave': function(){
				$('.two').fadeOut({queue: false});
				$('.linkindex:eq(2), .linkindex:eq(3)').css('color', '#A1A2A4');
				$(this).css('border', '1px solid #A1A2A4');	
			}
	});

	$('.rectindex:eq(2)').on({
		'mouseenter': function(){
				$('.three').fadeIn({queue: false});
				$('.linkindex:eq(4), .linkindex:eq(5)').css('color', '#174791');
				$(this).css('border', '1px solid #174791');				
			},
		'mouseleave': function(){
				$('.three').fadeOut({queue: false});
				$('.linkindex:eq(4), .linkindex:eq(5)').css('color', '#A1A2A4');
				$(this).css('border', '1px solid #A1A2A4');	
			}
	});

	$('.rectindex:eq(3)').on({
		'mouseenter': function(){
				$('.four').fadeIn({queue: false});
				$('.linkindex:eq(6), .linkindex:eq(7)').css('color', '#174791');
				$(this).css('border', '1px solid #174791');	
			},
		'mouseleave': function(){
				$('.four').fadeOut({queue: false});
				$('.linkindex:eq(6), .linkindex:eq(7)').css('color', '#A1A2A4');
				$(this).css('border', '1px solid #A1A2A4');	
			}
	});	






});