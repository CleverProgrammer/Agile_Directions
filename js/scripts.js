/**
 *
 * Created by Rafeh Qazi on 1/6/16.
 */

// A Google Maps Directions API request takes the following form:
// https://maps.googleapis.com/maps/api/directions/output?parameters

// Example:
// The following request returns driving directions from Toronto, Ontario to Montreal, Quebec:
// https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY


/**
 * Takes in the Google Maps API JSON object as input and returns
 * the step by step instructions as a list of strings with HTML tags stripped.
 * @param {Object} json
 * @return {Array} directions
 */
function getDirections(json) {
    "use strict";
    var steps = json.routes[0].legs[0].steps;
    var directions = [];
    var counter = 1;

    steps.forEach(function (step) {
        directions.push(counter + ". " + step.html_instructions);
        counter += 1;
    });

    // Separates the 2 conjoint words in the last line.
    // so "Ave Destination" instead of "AveDestination"
    directions[directions.length - 1] = directions[directions.length - 1].replace(/([a-z])([A-Z])/g, "$1 $2");
    return directions;
}

/**
 * Takes in the Google Maps API JSON object as input and returns the ETA as a string.
 * @param {Object} json
 * @return {string}
 */
function getEta(json) {
    "use strict";
    return json.routes[0].legs[0].duration.text;
}

function showDirections(json) {
    "use strict";
    // creates div, adds class, and appends the div
    var div = document.createElement("div");
    $(div).addClass("directions col-xs-12 col-sm-8 col-sm-offset-2");
    $(div).append("<b>FROM: </b> " + $("#origin").val() + "<br>");
    $(div).append("<b>TO: </b>" + $("#destination").val() + "<br>");
    $(div).append("<em>It will take you " + getEta(json) + " to get there.</em> <p></p>");
    getDirections(json).forEach(function (item) {
       $(div).append("<p>" + item + "</p>");
    });
    $("#listDirections").append(div);
}
var arr=[];
$("#next").on("click", function () {
    arr.push($("#origin").val());
    $("h2").html("To:");

    if ($("#destination").val() !== "") {
        console.log($("#destination").val());
        arr.push($("#destination").val());
        console.log(arr);
        $("#destination").css("border", "none");
    } else if($("#destination").val("")){
        $("#destination").css("border", "2px solid red");
    }

    $("#origin").attr("placeholder", "Destination");
    $("#origin").attr("id", "destination")
    $("#origin").val("");
});




$(document).ready(function () {
    "use strict";

    $("#getButton").click(function () {

        // Get the user input
        var origin = $('#origin').val().replace(/ /g, "%20");
        var destination = $('#destination').val().replace(/ /g, "%20");

        // Create the URL
        var URL = "https://maps.googleapis.com/maps/api/directions/json?origin=" +
            "" + origin + "&destination=" + destination + "&key=" + APIKEY;

        // Obtain json object through GET request
        $.getJSON(URL, function (json) {
            console.log(getEta(json));
            console.log(getDirections(json));
            showDirections(json);
        });
    });
});
