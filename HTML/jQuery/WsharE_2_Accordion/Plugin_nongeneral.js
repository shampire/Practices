jQuery.fn.menuPlugin = function(options) {
/*
 *  For example, opts = {isAccordion: true, openSpeed:slow, eventType:click, hasRepeatTricker:false};
 */
    var defaults = {
        isAccordion: true, 
        openSpeed: "slow", 
        eventType: "mouseover", 
        hasRepeatTricker: false
    };
    var opts = $.extend({}, defaults, options);

    return this.each(function() {
            $('ul.menu ul').hide();
            
            $.each($('ul.menu'), function(){
                $('#' + this.id + '.expandfirst ul:first').show();
            }); 

            $.each($('.unfold'), function(){
                $(this).show();
            }); 

            $(this).bind(opts.eventType,
                function() {
                    var nextLevel_ul = $(this).next();
                    var parentID = this.parentNode.parentNode.id;
             
                    //Non-Accordion
                    if( !opts.isAccordion) {
                        nextLevel_ul.slideToggle(opts.openSpeed);
                        return false;
                    }                
                    
                    if((nextLevel_ul.is('ul')) && (nextLevel_ul.is(':visible'))) {
                        if($('#' + parentID).hasClass('collapsible') || opts.hasRepeatTricker) 
                            $('#' + parentID + ' ul:visible').slideUp(opts.openSpeed);
                        //one list item at a time
                        return false;
                    }   

                    if((nextLevel_ul.is('ul')) && (!nextLevel_ul.is(':visible'))) {
                        $('#' + parentID + ' ul:visible').slideUp(opts.openSpeed);
                        nextLevel_ul.slideDown(opts.openSpeed);
                        return false;
                    }   
                    
                });
            });
}
