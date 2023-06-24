


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


    $('#LoginForm').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting

        // Get the form data
        var formData = {
            email: $('#InputEmail').val(),
            password: $('#InputPassword').val()
        };

        // Send an AJAX request to the server
        $.ajax({
            type: 'POST',
            url: '/login', // Replace with the actual URL for the login endpoint
            data: formData,
            success: function (response) {
                // Handle the success response
                console.log(response); // Log the response to the console
                // Redirect the user to the desired page or perform any other actions
            },
            error: function (error) {
                // Handle the error response
                console.log(error); // Log the error to the console
                // Display an error message to the user or perform any other error handling
            }
        });
    });






});