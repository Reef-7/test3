const firstNameEl = document.querySelector('#FnameIn');
// prevents sending the file if there are filed that are invalied fildes
(function () {
    'use strict'
    window.addEventListener('load', function () {
        // find all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation')
        // Loop on all the filledes to check if they are valied 
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                var password = document.getElementById('passIn').value;
                var repeatPassword = document.getElementById('RpassIn').value;
                if (form.checkValidity() === false || password !== repeatPassword) {
                    event.preventDefault()
                    event.stopPropagation()
                    if (password !== repeatPassword) {
                        alert('Passwords do not match');
                    }
                }
                form.classList.add('was-validated')
            }, false)
        })
    }, false)
})()


