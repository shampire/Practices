$(document).ready(
function() {
    $('h1').bind('mouseover', function(){
        $(this).mytoolbox({msg:'hello'});
    });
});      
