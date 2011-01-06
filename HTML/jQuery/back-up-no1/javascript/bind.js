function bindClick() {
        $("li div").bind("click", function(){
            $(this).html("<img src=\"http://www.mapabc.com/qnmap/images/supermap/supermap_tosmall.png\"></img>");
        }); 
        var x=document.getElementByTagName("img");
        alert('ji');
}
$(document).ready(function(){ bindClick(); }); 

