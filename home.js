

var canvas = document.getElementById('Logo'),
    context = canvas.getContext('2d');

make_base();

function make_base() {
    base_image = new Image();
    base_image.src = 'https://i.ibb.co/KF5bfTs/logo.jpg';
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);
    }
}






$(window).on('scroll', function () {
    var scrollPosition = $(this).scrollTop();
    $('.top-banner').css('transform', 'translateY(' + scrollPosition * 0.5 + 'px)');
});


