function Menus() {
	$('ul.menu ul').hide();
	$.each($('ul.menu'), function(){
		$('#' + this.id + '.expandfirst ul:first').show();
	});

    /*$.each($('.unfold'), function(){
        $(this).show();
    });*/

    
    
   // var opts = {isAccordion:1 , openSpeed:1 ,isClick:1 , repeatTricker:1}; // 1:True 0:False
    //$('ul.menu li a.test').menuPlugin(opts);


    /*
	$('ul.menu li a').bind('mouseover',
		function() {
			var nextLevel_ul = $(this).next();
			var parentID = this.parentNode.parentNode.id;

			if($('#' + parentID).hasClass('noaccordion')) {
				$(this).next().slideToggle('normal');

                //handle the next ul
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
			if((nextLevel_ul.is('ul')) && (nextLevel_ul.is(':visible'))) {
				if($('#' + parentID).hasClass('collapsible')) {
					$('#' + parentID + ' ul:visible').slideUp('normal');
				}
				return false;
			}
			if((nextLevel_ul.is('ul')) && (!nextLevel_ul.is(':visible'))) {
				$('#' + parentID + ' ul:visible').slideUp('normal');
				nextLevel_ul.slideDown('normal');
				return false;
			}
		}
	);           */
}
$(document).ready(function() {Menus();});
