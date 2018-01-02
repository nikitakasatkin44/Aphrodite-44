function initializeMap() {
    var myCenter = new google.maps.LatLng(57.73112469001489, 41.010417940732395);
    var mapProp = {
        center: myCenter,
        zoom: 18,
        scrollwheel: false,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var marker = new google.maps.Marker({position: myCenter});
    marker.setMap(map);
}