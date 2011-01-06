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
            $(this).children().find('ul').hide()//hide all the children ul of the level-1 list item
            $.each($(this), function(){
                $('#' + this.id + '.expandfirst ul:first').show();
            }); 

            $.each($('.unfold'), function(){
                //mark all the node on the path from this to root
                $(this).addClass('path');
                $(this).parents('ul').addClass('path');
                //show the marked level1 ul             
                $(this).parents('ul:last').children('ul:eq(0) .path').show();
                //show only the child nodes marked "path"
                $(this).parents('ul:last').children('ul:eq(0) .path').find('.path').show();
                $(this).parents('ul:eq(-6)').find('ul').show();
            }); 

            $(this).find('a').bind(opts.eventType,
                function() {
                    var nextLevel_ul = $(this).next();
                    var parentID = this.parentNode.parentNode.id;
             
                    //Non-Accordion
                    if( !opts.isAccordion) {
                        if((nextLevel_ul.is('ul')) && (nextLevel_ul.is(':visible'))){ 
                            nextLevel_ul.slideUp(opts.openSpeed);    
                        } else if ((nextLevel_ul.is('ul')) && !(nextLevel_ul.is(':visible'))){ //not slideDowned yet
                   
                            nextLevel_ul.find('ul').slideUp(opts.openSpeed);
                            nextLevel_ul.slideDown(opts.openSpeed);
                        }
                        return false;
                    }   
                    //collapsible achieved by CSS             
                    if((nextLevel_ul.is('ul')) && (nextLevel_ul.is(':visible'))) {
                        if($('#' + parentID).hasClass('collapsible') || opts.hasRepeatTricker) 
                            $('#' + parentID + ' ul:visible').slideUp(opts.openSpeed);
                        //one list item at a time
                        return false;
                    }   
                    //Accordion
                    if((nextLevel_ul.is('ul')) && (!nextLevel_ul.is(':visible'))) {
                        $('#' + parentID + ' ul:visible').slideUp(opts.openSpeed);
                        nextLevel_ul.slideDown(opts.openSpeed);
                        return false;
                    }   
                    
                });
            });
}
