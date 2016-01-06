/**
 *
 * Created by Rafeh Qazi on 1/6/16.
 */

// A Google Maps Directions API request takes the following form:
// https://maps.googleapis.com/maps/api/directions/output?parameters

// Example:
// The following request returns driving directions from Toronto, Ontario to Montreal, Quebec:
// https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY


var API_KEY = "AIzaSyC4NDN-0uaL7Jn44lEz5Bd4fJGQ69pHcGA";


function strip(html)
{
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}


$(document).ready(function() {
    $("#getButton").click(function() {

        // Get the user input
        var origin = $('#origin').val().replace(/ /g, "%20");
        var destination = $('#destination').val().replace(/ /g, "%20");

        // Create the URL
        var URL = "https://maps.googleapis.com/maps/api/directions/json?origin="
            + origin + "&destination=" + destination + "&key=" + API_KEY;

        // Obtain json object through GET request
        $.getJSON(URL, function(json) {
            var steps = json["routes"][0]["legs"][0]["steps"];
            var counter = 0;
            steps.forEach(function(step){
                if (counter === steps.length - 1) {
                    console.log(strip(step["html_instructions"]).replace( /([a-z])([A-Z])/g, "$1 $2"));
                } else {
                    console.log(strip(step["html_instructions"]));
                }
                counter++;
            });
        });
    });
});
