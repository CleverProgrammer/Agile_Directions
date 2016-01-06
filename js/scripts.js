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
    // var origin;
    // var destination;
    $("button").on("click", function() {
        origin = $('#origin').html().replace(/ /g, "%20");
        destination = $('#destination').html().replace(/ /g, "%20");
        console.log("HELLO HIIIII");
        console.log(origin);
        console.log(destination);
    });

    // console.log(origin);
    // console.log(destination);
    // var destination = '9053 Laramie Avenue Skokie'.replace(/ /g, "%20");
    var URL = "https://maps.googleapis.com/maps/api/directions/json?origin="
        + origin + "&destination=" + destination + "&key=" + API_KEY;


    $.getJSON(URL, function(json) {
        var steps = json["routes"][0]["legs"][0]["steps"];
        steps.forEach(function(step){
           console.log(strip(step["html_instructions"]));
        });
    });
    // var origin = '7024 west carol ave Niles IL'.replace(/ /g, "%20");  // Test%20-%20Text"
});
