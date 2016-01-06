/**
 *
 * Created by ChessTastic on 1/6/16.
 */



$(document).ready(function() {
    var API_KEY = "AIzaSyC4NDN-0uaL7Jn44lEz5Bd4fJGQ69pHcGA";
    var loc1 = '7024 west carol ave Niles IL'.replace(/ /g, "%20");  // Test%20-%20Text"
    var loc2 = '9053 Laramie Avenue Skokie'.replace(/ /g, "%20");
    var URL = "https://maps.googleapis.com/maps/api/directions/json?origin="
        + loc1 + "&destination=" + loc2 + "&key=" + API_KEY;

    /*
    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }
    */

// Create the XHR object.
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }

// Helper method to parse the title tag from the response.
    function getTitle(text) {
        return text.match('<title>(.*)?</title>')[1];
    }

// Make the actual CORS request.
    function makeCorsRequest() {
        // All HTML5 Rocks properties support CORS.
        var url = 'http://updates.html5rocks.com';

        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }

        // Response handlers.
        xhr.onload = function() {
            var text = xhr.responseText;
            var title = getTitle(text);
            alert('Response from CORS request to ' + url + ': ' + title);
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };

        xhr.send();
    }

    var url = 'http://api.alice.com/cors';
    var xhr = createCORSRequest('GET', url);
    xhr.send();

    console.log(loc1);
    console.log(URL);
    console.log(httpGetAsync(URL));

    $.getJSON(createCORSRequest(), function(json) {
        console.log("hi");
        console.log(json);
    });
});

/*
$.getScript("../secret_api.js", function(){

    alert("Script loaded but not necessarily executed.");

});
*/


// A Google Maps Directions API request takes the following form:
    // https://maps.googleapis.com/maps/api/directions/output?parameters

    // Example:
    // The following request returns driving directions from Toronto, Ontario to Montreal, Quebec:
// https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY

    // Locations

