


$(document).ready(function () {
    // Add a click event listener to the button
    $("#signup").on("click", function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Fade out the current page
        $("body").fadeOut(250, function () {
            // Navigate to the desired page
            window.location.href = "Register.html";
        });
    });
});