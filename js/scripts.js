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
            step.html_instructions + " for " + step.distance.text);
        counter += 1;
    });

    // Change "destination will be on the left for 300 ft" to
    // "destination will be on the left in 300 ft"
    directions[directions.length - 1] = directions[directions.length - 1].replace(/for/g, "in");

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

function barPlot() {
    var randomScalingFactor = function () {
        return Math.round(Math.random() * 100)
    };
    var barChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
            },
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
            }
        ]
    };
    window.onload = function () {
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barChartData, {
            responsive: true
        });
    }
}

$(document).ready(function () {
    "use strict";
    // barPlot();

    $("#getButton").click(function () {

        // Get the user input
        var origin = $('#origin').val().replace(/ /g, "%20");
        var destination = $('#destination').val().replace(/ /g, "%20");

        // Create the URL
        var URL = "https://maps.googleapis.com/maps/api/directions/json?origin=" +
            "" + origin + "&destination=" + destination + "&key=" + API_KEY;

        // Obtain json object through GET request
        $.getJSON(URL, function (json) {
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
            link.setAttribute("download", "my_data.csv");
            link.click(); // This will download the data file named "my_data.csv".

            showDirections(json);
        });
    });
});
