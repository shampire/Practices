jQuery.fn.menuPlugin = function(opt) {
/*
 *  opts = {isAccordion:1, openSpeed:slow, eventType:click, repeatTricker:1}; // 1:True 0:False
 */
    return this.each(function() {
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

                    if( !opt.isAccordion) {
                     $(this).next().slideToggle('normal');
                        return false;
                    } else if {               
        
                        if((nextLevel_ul.is('ul')) && (nextLevel_ul.is(':visible')) && !repeatTricker) {
                            $('#' + parentID + ' ul:visible').slideUp('normal');
                        }   
                        return false;
                        
                        if((nextLevel_ul.is('ul')) && (!nextLevel_ul.is(':visible'))) {
                            $('#' + parentID + ' ul:visible').slideUp('normal');
                            nextLevel_ul.slideDown('normal');
                        return false;
                        }
                    }

                }
            );
    });
}
