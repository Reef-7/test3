
var map, marker;

function initMap() {
    var location = { lat: 31.968910, lng: 34.770730 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 14
    });

    marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

