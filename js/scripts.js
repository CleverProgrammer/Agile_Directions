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

function papa(URL) {
    Papa.unparse(URL, {
        download: true,
        complete: function (results) {
            console.log(results);
        }
    });
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
            // console.log(data);
            // console.log(Papa.unparse(JSON.stringify([json])));
            var directions = getDirections(json);
            var csv = Papa.unparse({
                fields: ["Destinations"],
                data: [
                    [directions]
                ]
            });
            console.log(csv);
            var csvContent = "data:text/csv;charset=utf-8,";
            csvContent += csv;
            console.log(csv);
            var encodedUri = encodeURI(csvContent);
            console.log(encodedUri);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");

            link.click(); // This will download the data file named "my_data.csv".
            console.log(csv);
            // console.log(directions[0]);
            console.log('hello');
            console.log(directions);
            // console.log([directions]);
            // console.log(csv);
            // var csv = Papa.unparse([
            //     ["1-1", "1-2", "1-3"],
            //     ["2-1", "2-2", "2-3"]
            // ]);
            // var csv = Papa.unparse(JSON.stringify(data));
            // console.log(csv);
            // window.open(url, "_blank");
            // window.focus();
            // console.log(getEta(json));
            // console.log(getDirections(json));
            showDirections(json);
        });
    });
});
