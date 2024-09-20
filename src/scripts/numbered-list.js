(function ($) {
    var index = 1;

    $('.list-number').each(function () {
        $(this).text(function () {
            return index;
        });
        index ++;
    });
}(jQuery));