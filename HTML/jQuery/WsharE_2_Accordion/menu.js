function Menus() {
    /*
    //uncomment to run straightly
	$('ul.menu ul').hide();
	$.each($('ul.menu'), function(){
		$('#' + this.id + '.expandfirst ul:first').show();
	});

    $.each($('.unfold'), function(){
        $(this).show();
    });
    
	$('ul.menu li a').bind('mouseover',
		function() {
			var nextLevel_ul = $(this).next();
			var parentID = this.parentNode.parentNode.id;
            
            //multiple list item at a time (non-accordion), which depends on how many items you toggle.
			if($('#' + parentID).hasClass('noaccordion')) {
				$(this).next().slideToggle('normal'); 
				
                nextLevel_ul.bind('mouseover',
                    function() {
                        if((this.is('ul')) && (!this.is(':visible'))) {
                            $('#' + parentID + ' ul:visible').slideUp('normal');
                            this.slideDown('normal');
                            return false;
                        }

                    }
                );
                        
                return false;
			}

            //could toggle "collapsible" item again to collapse
			if((nextLevel_ul.is('ul')) && (nextLevel_ul.is(':visible'))) {
				if($('#' + parentID).hasClass('collapsible')) {
					$('#' + parentID + ' ul:visible').slideUp('normal');
				}       
				return false;
			}   

            //one list item at a time (accordion)
			if((nextLevel_ul.is('ul')) && (!nextLevel_ul.is(':visible'))) {
				$('#' + parentID + ' ul:visible').slideUp('normal');
				nextLevel_ul.slideDown('normal');
				return false;
			}
		}
	);
    */           
    
    // uncomment to use self-defined plugin
    //var opts = {isAccordion: true, openSpeed: "fast", eventType: "click", hasRepeatTricker: true}; 
    //use default arguments
    $("#menu1").menuPlugin({isAccordion: false, openSpeed: "normal", eventType: "mouseover", hasRepeatTricker: true});
    $("#menu2").menuPlugin({isAccordion: true, openSpeed: "fast", eventType: "click", hasRepeatTricker: true});
    $("#menu3").menuPlugin({isAccordion: false, openSpeed: "normal", eventType: "mouseover", hasRepeatTricker: true});
    $("#menu4").menuPlugin({isAccordion: true, openSpeed: "slow", eventType: "click", hasRepeatTricker: true});
    
}
$(document).ready(function() {Menus();});
