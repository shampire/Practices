$(function () {
        $("#sortable").sortable();
        $("#sortable").disableSelection();
        //every click event, call bindAll() to check if it is necessary to bind for scaling
        bindAll();
        function bindAll(){
            //bind normal
            $("li.normal div img").bind("click", function(event){
                var currentListItem = $(this).parent().parent();
                $(this).parent().html("<img src=\"http://www.mapabc.com/qnmap/images/supermap/supermap_tosmall.png\"/>");
                currentListItem.removeClass('normal').removeClass('shrinked').addClass('enlarged');
                //move all elements of normal to left
                $('#left').append($('#normal').children());
                //move one being enlarged to right
                $('#right').append(currentListItem);

                //should minish the other three frame to SHRINKED state
                $("li.normal div img").each(function() {
                    var currentListItem = $(this).parent().parent();
                    $(this).parent().html("<img src=\"http://www.fjydz.com/Upload/0/010.jpg\"/>");
                    currentListItem.removeClass('normal').removeClass('enlarged').addClass('shrinked');
                });
                bindAll();
            });         

            //bind enlarged
            $("li.enlarged div img").bind("click", function(){ 
                var currentListItem = $(this).parent().parent();
                $(this).parent().html("<img src=\"http://www.fjydz.com/Upload/0/010.jpg\"/>");
                currentListItem.removeClass('shrinked').removeClass('enlarged').addClass('normal');
                
                //should minish the other three frame to NORMAL state
                $("li.shrinked div img").each(function() {
                    var currentListItem = $(this).parent().parent();
                    $(this).parent().html("<img src=\"http://www.fjydz.com/Upload/0/010.jpg\"/>");
                    currentListItem.removeClass('shrinked').removeClass('enlarged').addClass('normal');
                });
                //move all elements of both left and right to left
                $('#normal').append($('#right').children());
                $('#normal').append($('#left').children());
                bindAll();
            });

            //bind shrinked
            $("li.shrinked div img").bind("click", function(){
                //should minish the enlarged one to SHRINKED state
                var currentListItem = $(this).parent().parent();
                
                $("li.enlarged div img").each(function() {
                    var currentListItem = $(this).parent().parent();
                    $(this).parent().html("<img src=\"http://www.fjydz.com/Upload/0/010.jpg\"/>");
                    currentListItem.removeClass('normal').removeClass('enlarged').addClass('shrinked');
                    //move all shrinked ones to left
                    $('#left').append(currentListItem);
                });     
                $(this).parent().html("<img src=\"http://www.mapabc.com/qnmap/images/supermap/supermap_tosmall.png\"/>");
                currentListItem.removeClass('normal').removeClass('shrinked').addClass('enlarged');
                $("li.shrinked div img").unbind();
                //move one being enlarged to right
                $('#right').append(currentListItem);
                bindAll();

            });
        }
        
});

