function checkServerCurrentSlide(){
	$.ajax({
	    url: 'slidesControl',
	    error: function(xhr) {
	      $('#msg').html('ajax error');
	     // $(e.target).attr('disabled', false);
	    },
	    success: function(response) {
			var p = parseInt(response,10);
			$('#msg').html('Host Current Slide:' + p.toString() + '<br>' + 'Current Slide:' + currentSlideNo);
			
			if(isSync==1){
				currentSlideNo = p;
				updateSlideClasses();
			}
	    }
	  });
	setHostCurrentSlide();
}

function syncSlides(){
	isSync = 1;
}

var isSync = 0;

function setHostCurrentSlide(){
	$.ajax({
	    url: 'setCurrentSlide',
		data: {'pwd': $('#syncPwd').val(), 'currentSlide': currentSlideNo},
	    error: function(xhr) {
	      $('#statusMsg').html('setHostCurrentSlide error');
	     // $(e.target).attr('disabled', false);
	    },
	    success: function(response) {
			/*var p = parseInt(response,10);
			$('#msg').html('Host Current Slide:' + p.toString() + '<br>' + 'Current Slide:' + currentSlideNo);
			
			if(isSync==1){
				currentSlideNo = p;
				updateSlideClasses();
			}*/
			
			$('#statusMsg').html(response);
	    }
	  });
	
}

setInterval("checkServerCurrentSlide();",1000);