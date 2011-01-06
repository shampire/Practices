jQuery.fn.sortablePlugin = function(options) {
    
    var defaults = {
        imposedOnID: "#sortable", 
        defaultLayout: "enlarged", 
        RightLargeFrameLi: "#li3", 
        enlargedLiImageURL: "http://www.mapabc.com/qnmap/images/supermap/supermap_tosmall.png", 
        shrinkedLiImageURL: "http://www.fjydz.com/Upload/0/010.jpg",
    };
    var opts = $.extend({}, defaults, options);
    imgURL.enlargedLiImageURL = "http://www.mapabc.com/qnmap/images/supermap/supermap_tosmall.png"
    imgURL.shrinkedLiImageURL = "http://www.fjydz.com/Upload/0/010.jpg"

    return this.each(function() {
        $(opts.imposedOnID).sortable();
        $(opts.imposedOnID).disableSelection();
        
        //setup the default layout
        if(opts.defaultLayout == "enlarged"){
            $(opts.RightLargeFrameLi).find('div').html("<img src=" + opts.enlargedLiImageURL + " />");
            $(opts.RightLargeFrameLi).removeClass('normal').removeClass('shrinked').addClass('enlarged');
            //move all elements of normal to left
            $('#left').append($('#normal').children());
            $('li.normal').removeClass('normal').removeClass('enlarged').addClass('shrinked');
            //move one being enlarged to right
            $('#right').append($(opts.RightLargeFrameLi));
        }

        //every click event, call bindAll() to check if it is necessary to bind for scaling
        bindAll(imgURL);
    });
}

//Global function and variable
var imgURL = {shrinkedLiImageURL: "", enlargedLiImageURL: "",};
var selfLi;
var anotherLi;
var timeStampForAnotherLi = 0;
var counter = 0;
var isSelf = true;
var isSameInLeft = false;
var isSameInLeftFixed = false;

function bindAll(imgURL){
    //bind normal
    $("li.normal div img").bind("click", function(event){
        var currentListItem = $(this).parent().parent();
        $(this).parent().html("<img src=" + imgURL.enlargedLiImageURL + " />");
        currentListItem.removeClass('normal').removeClass('shrinked').addClass('enlarged');
        //move all elements of normal to left
        $('#left').append($('#normal').children());
        //move one being enlarged to right
        $('#right').append(currentListItem);

        //should minish the other three frame to SHRINKED state
        $("li.normal div img").each(function() {
            var currentListItem = $(this).parent().parent();
            $(this).parent().html("<img src=" + imgURL.shrinkedLiImageURL + " />");
            currentListItem.removeClass('normal').removeClass('enlarged').addClass('shrinked');
        });
        bindAll(imgURL);
    });         

    //bind enlarged
    $("li.enlarged div img").bind("click", function(){ 
        var currentListItem = $(this).parent().parent();
        $(this).parent().html("<img src=" + imgURL.shrinkedLiImageURL + " />");
        currentListItem.removeClass('shrinked').removeClass('enlarged').addClass('normal');
        
        //should minish the other three frame to NORMAL state
        $("li.shrinked div img").each(function() {
            var currentListItem = $(this).parent().parent();
            $(this).parent().html("<img src=" + imgURL.shrinkedLiImageURL + " />");
            currentListItem.removeClass('shrinked').removeClass('enlarged').addClass('normal');
        });
        //move all elements of both left and right to left
        $('#normal').append($('#right').children());
        $('#normal').append($('#left').children());
        bindAll(imgURL);
    });

    //bind shrinked
    $("li.shrinked div img").bind("click", function(){
        //should minish the enlarged one to SHRINKED state
        var currentListItem = $(this).parent().parent();
        
        $("li.enlarged div img").each(function() {
            var currentListItem = $(this).parent().parent();
            $(this).parent().html("<img src=" + imgURL.shrinkedLiImageURL + " />");
            currentListItem.removeClass('normal').removeClass('enlarged').addClass('shrinked');
            //move all shrinked ones to left
            $('#left').append(currentListItem);
        });     
        $(this).parent().html("<img src=" + imgURL.enlargedLiImageURL + " />");
        currentListItem.removeClass('normal').removeClass('shrinked').addClass('enlarged');
        $("li.shrinked div img").unbind();
        //move one being enlarged to right
        $('#right').append(currentListItem);
        bindAll(imgURL);

    });
} 

