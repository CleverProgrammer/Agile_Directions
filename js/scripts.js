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


    console.log(loc1);
    console.log(URL);
    // console.log(httpGetAsync(URL));

    $.getJSON(URL, function(json) {
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
