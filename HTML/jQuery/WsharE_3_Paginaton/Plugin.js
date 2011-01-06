jQuery.fn.sortablePlugin = function(options) {
    var defaults = {
        displayButtonNum: 10,                                                             
        onePageEntitiesNum: 10, 
        entitiesCount: 0, 
        curPageNum: 1,
        fragmentID: "pagination",
        getUrlCallback: function(){return false;},
        goToPageCallback: function(){return false;},
    };

    var opts = $.extend({}, defaults, options);
         
    return this.each(function() {
        if(!opts.goToPageCallback) {//method 1
            var link = opts.getUrlCallback(curPageNum);
            $("#Pagination").pagination(entitiesCount, {
                items_per_page:opts.displayButtonNum,  
                num_display_entries:opts.displayButtonNum,
                current_page:opts.curPageNum,
                link_to:link,
                prev_text:"Prev",                  
                next_text:"Next",                  
                ellipse_text:"...",                
                prev_show_always:true,             
                next_show_always:true,             
                renderer:"defaultRenderer",        
                callback:function(){return false;} 
            });
            
           

        } else { //method 2
            $("#Pagination").pagination(entitiesCount, {
                items_per_page:opts.displayButtonNum,  
                num_display_entries:opts.displayButtonNum,
                current_page:opts.curPageNum,
                link_to:link,
                prev_text:"Prev",                  
                next_text:"Next",                  
                ellipse_text:"...",                
                prev_show_always:true,             
                next_show_always:true,             
                renderer:"defaultRenderer",        
                callback:opts.goToPageCallback(opts.curPageNum, ) //get called when a page is selected
            });

        }

});
