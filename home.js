

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



fetch('/rss-feed').then(response => response.json())
    .then(data => {
        const articles = document.getElementById('articles');
        data.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.link;
            link.textContent = item.title;
            li.appendChild(link);
            articles.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        const articles = document.getElementById('articles');
        const li = document.createElement('li');
        li.textContent = 'An error occurred while fetching the articles.';
        articles.appendChild(li);
    });





/*$(window).on('scroll', function () {
    var scrollPosition = $(this).scrollTop();
    $('.top-banner').css('transform', 'translateY(' + scrollPosition * 0.5 + 'px)');
});*/


