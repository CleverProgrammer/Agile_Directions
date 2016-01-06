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


/**
 * Takes in a string and strips its HTML tags.
 * @param {string} html
 * @returns {string|string}
 */
function strip(html)
{
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

/**
 * Takes in the Google Maps API JSON object as input and returns
 * the step by step instructions.
 * @param {Object} json
 * @return {Array} directions
 */
function getDirections(json) {
    var steps = json["routes"][0]["legs"][0]["steps"];
    var directions = [];
    var counter = 0;

    steps.forEach(function (step) {
        directions.push(strip(step["html_instructions"]));
        counter++;
    });

    // Separate the 2 conjoint words in the last line.
    // so "Ave Destination" instead of "AveDestination"
    directions[directions.length - 1] = directions[directions.length-1].replace(/([a-z])([A-Z])/g, "$1 $2");
    return directions;
}

/**
 * Takes in the Google Maps API JSON object as input and prints the ETA.
 * @param {Object} json
 * @return {string}
 */
function getEta(json) {
    return json["routes"][0]["legs"][0]["duration"]["text"];
}

$(document).ready(function() {

    function showDirections(item) {
        var div = document.createElement("div");
        $(div).addClass("directions");
        getDirections(json).forEach() {

        }
    }
    $("#getButton").click(function () {

        // Get the user input
        var origin = $('#origin').val().replace(/ /g, "%20");
        var destination = $('#destination').val().replace(/ /g, "%20");

        // Create the URL
        var URL = "https://maps.googleapis.com/maps/api/directions/json?origin="
            + origin + "&destination=" + destination + "&key=" + API_KEY;

        // Obtain json object through GET request
        $.getJSON(URL, function (json) {
            console.log(getEta(json));
            console.log(getDirections(json));
        });
    });
});
