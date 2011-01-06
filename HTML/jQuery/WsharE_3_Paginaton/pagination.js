/**
 * Callback function that displays the content.
 *
 * Gets called every time the user clicks on a pagination link.
 *
 * @param {int}page_index New Page index
 * @param {jQuery} jq the container with the pagination links as a jQuery object
 */


//***************** callback of opts *****************

function pageselectCallback(page_index, jq, items_per_page){
    // Get number of elements per pagionation page from form
    var items_per_page = items_per_page;
    var max_elem = Math.min((page_index+1) * items_per_page, members.length);
    var newcontent = '';
    
    // Iterate through a selection of the content and build an HTML string
    for(var i=page_index*items_per_page;i<max_elem;i++)
    {
        newcontent += '<dt>' + members[i][0] + '</dt>';
        newcontent += '<dd class="state">' + members[i][2] + '</dd>';
        newcontent += '<dd class="party">' + members[i][3] + '</dd>';
    }
    
    // Replace old content with new content
    $('#Searchresult').html(newcontent);
    
    // false: Prevent click event propagation 
    return false;
}

//***************** getUrlCallback of opts *****************
function getUrl(page) {
    return "http://www.google.com?page="+page;
}
//***************** goToPageCallback of opts *****************
function goToPage(opts, page) {
    opts['current_page'] = page;
    $("#Pagination").pagination(members.length, opts);
    return true;
}

$(document).ready(function(){
    var optInit = {
        items_per_page:3,        
        num_display_entries:10,  
        current_page:0,          
        num_edge_entries:0,      
        link_to:"#",                 
        prev_text:"Prev",
        next_text:"Next",
        ellipse_text:"...",
        prev_show_always:true,        
        next_show_always:true,    
        renderer:"defaultRenderer",
        fragmentClass:"pagination",
        //call back function
        getUrlCallback:function getUrl(page) {
                return "http://www.google.com?page="+page;
            },
        goToPageCallback:false,
        callback: function(page_index, jq, items_per_page){ pageselectCallback(page_index, jq, items_per_page);}   //default callback function
    };
    $("#Pagination").pagination(members.length, optInit);
});
