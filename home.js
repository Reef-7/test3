

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




$(document).ready(function () {
    $(".btn-outline-dark").click(function () {
        // Get the position of the clicked button
        var buttonPosition = $(this).offset();

        // Create a clone of the image and append it to the body
        var image = $(this).closest(".card").find(".card-img-top");
        var imageClone = image.clone().addClass("animate");
        imageClone.attr("id", "flyingImage");
        $("body").append(imageClone);

        // Position the flying image at the clicked button's position
        $("#flyingImage").css({
            top: buttonPosition.top + "px",
            left: buttonPosition.left + "px"
        });

        // Animate the flying image to the cart logo position
        $("#flyingImage").animate(
            {
                top: $(".bi-cart4").offset().top + "px",
                left: $(".bi-cart4").offset().left + "px",
                width: "20px",
                height: "20px"
            },
            1000,
            function () {
                // Remove the flying image after animation
                $(this).remove();
            }
        );
    });
});

