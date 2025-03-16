function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var mapFrame = document.getElementById('mapFrame');
    var src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8247.339841474053!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b59b098df4b%3A0x351e9a861928ef49!2sGSPC%20LNG%20Limited!5e0!3m2!1sen!2sin!4v1721203216447!5m2!1sen!2sin`;
    mapFrame.src = src;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

window.onload = initMap;
