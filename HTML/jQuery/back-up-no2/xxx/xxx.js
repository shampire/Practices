$.fn.mytoolbox = function(hello) {
    return this.each(function() {
        $(this).html(hello.msg);
    });
};
