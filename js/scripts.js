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
 * Takes in a string and strips its HTML tags.
 * @param {string} html
 * @returns {string|string}
 */
function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

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
        directions.push(counter + ". " +
            step.instructions + " for " + step.distance.text);
        counter += 1;
    });

    // Separates the 2 conjoint words in the last line.
    // so "Ave Destination" instead of "AveDestination"
    directions[directions.length - 1] = directions[directions.length - 1].replace(/([a-z])([A-Z])/g, "$1 $2");

    // Change "destination will be on the left for 300 ft" to
    // "destination will be on the left in 300 ft"
    directions[directions.length - 1] = directions[directions.length - 1].replace(/for/g, "in");

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

/**
 * Takes JSON object as input. Creates a div and outputs the div to the user showing the directions.
 * @param json
 */
function showDirections(json) {
    "use strict";
    var div = document.createElement("div");
    $(div).addClass("directions col-xs-12 col-sm-8 col-sm-offset-2");
    $(div).append("<b> FROM: </b> " + $("#origin").val() + "<br>");
    $(div).append("<b>TO: </b>" + $("#destination").val() + "<br>");
    $(div).append("<em>It will take you " + getEta(json) + " to get there.</em> <p></p>");
    getDirections(json).forEach(function (item) {
        $(div).append("<p>" + item + "</p>");
    });
    $("#listDirections").append(div);
}

/**
 * Takes in user destinations and returns a list of destinations.
 * @returns {Array}
 */
function destinationAdder (destinations) {
    var destination = $("#destination");
    if ($(destination).val() !== "") {
       destinations.push(destination.val());
       $(destination).css("border", "none");
    } else if ($(destination).val("")) {
        $(destination).css("border", "2px solid red");
    }
    $(destination).val("");
    return destinations;
}

/**
 *
 * Takes in a json object. Converts it to a CSV and downloads it.
 * @param {Object} json
 */
function downloadJSON2CSV(json) {
    var directions = getDirections(json);
    var csvContent = "data:text/csv;charset=utf-8,";

    // header
    csvContent += "Directions\n";

    directions.forEach(function (direction, index) {
        csvContent += strip(direction + "\n");
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    // This will download the data file named "my_data.csv".showDirections(json);
    link.setAttribute("download", "my_data.csv");
    link.click();
}

/**
 * Takes in an encoded URI for origin and destination. It returns the request.
 * @param {string} origin
 * @param {string} destination
 * @return {Object}
 */
function directionsRequest(origin, destination) {
    return {
        origin: origin,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
}

function directionsResponse(request, success) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setPanel(document.getElementById("listDirections"));
    $("#listDirections").css("background-color", "white");
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            console.log("HI i am in the success if statement");
            success(response);
        } else {
            alert("Whoops, you got an error!");
        }
    });
}

/**
 * Downloads directions as a CSV file.
 */
function downloadDirectionsAsCSV() {
    // Get the user input
    var origin = $('#origin').val();
    var destination = $('#destination').val();

    var request = directionsRequest(origin, destination);
    directionsResponse(request, function () {});
    // directionsResponse(request, downloadJSON2CSV);
}

$(document).ready(function () {
    "use strict";

    $("#getDirections").click(function () {
        downloadDirectionsAsCSV();
        // var directionsDisplay = new google.maps.DirectionsRenderer();
        // directionsDisplay.setPanel(document.getElementById('panel'));
    });

    // Recurring user input for destinations.
    var destinations = [];
    $("#plus").click(function () {
        destinationAdder(destinations);
        console.log(destinations);
    });
});
