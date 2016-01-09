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
 * Asynchronous function that turns the input FROM and TO fields into
 * autocomplete.
 */

function initMap() {
    var origin_input = document.getElementById("origin");
    var destination_input = document.getElementById("destination");

    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
}


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
 * Takes in user destinations and returns a list of destinations.
 * @returns {array} destinations
 */
function destinationAdder(destinations, destinationButton) {
    if ($(destinationButton).val() === "") {
        $(destinationButton).css("border", "2px solid red");
    } else {
        destinations.push(destinationButton.val().split(",").join(" "));
        $(destinationButton).css("border", "none");
    }
    $(destinationButton).val("");
    return destinations;
}

/**
 *
 * Takes in a list of strings as destinations. Takes in a list of lists
 * as directions. Converts it to a CSV and downloads it.
 * @param {array} allDestinations
 * @param {array} allDirections
 */
function downloadDirectionsAsCSV(allDestinations, allDirections) {
    var strippedDirections = [];
    allDirections.forEach(function (directions) {
        var tempArray = [];
        directions.forEach(function (direction) {
            tempArray.push(strip(direction));
        });
        strippedDirections.push(tempArray);
    });
    var newArray = strippedDirections[0].map(function (col, i) {
        return strippedDirections.map(function (row) {
            return row[i]
        })
    });
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += Papa.unparse({
        fields: allDestinations,
        data: newArray
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

/**
 * Take in as input a request object and a success function.
 * @param {Object} request
 */
function displayDirectionsReport(request) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setPanel(document.getElementById('listDirections'));
    $("#listDirections").css("background-color", "white");
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            alert("oops! You received a " + status + " error when trying to display directions.");
        }
    });
}

/**
 * It shows all the directions' results at once to the user.
 * @param {string} origin
 * @param {array} destinations
 */
function showDirections(origin, destinations) {
    // Get the user input
    destinations.forEach(function (destination) {
        var request = directionsRequest(origin, destination);
        displayDirectionsReport(request);
        // displayDirectionsReport(request, downloadJSON2CSV);
    });
}

/**
 * Returns a list of lists containing all directions strings.
 * @param {string} origin
 * @param {array} destinations
 */
function downloadAllAddressDirections(origin, destinations) {
    var allDirections = [];
    console.log(origin);
    console.log(destinations);
    destinations.forEach(function (destination, index) {
        var request = directionsRequest(origin, destination);
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                allDirections.push(getDirections(response));
                if (index === destinations.length - 1) {
                    downloadDirectionsAsCSV(destinations, allDirections);
                }
            } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                alert("ERROR CAUGHT RED HANDED! You received a " + status + " error when trying to download directions.");
                setTimeout(function () {
                    console.log();
                    allDirections.push(getDirections(response));
                    console.log(status, " --> ", allDirections);
                    if (index === destinations.length - 1) {
                        downloadDirectionsAsCSV(destinations, allDirections);
                    }
                }, 200);
            } else {
                alert("oops! You received a " + status + " error when trying to download directions.");
            }
        });
    });
}

$(document).ready(function () {
    "use strict";
    // origin address is stored here after the first plus sign button click.
    var origin;

    // Recurring user input for destinations.
    var destinationButton = $("#destination");
    var destinations = [];
    var clicks = 0;
    $("#plus").click(function () {
        // Store the origin address only once.
        clicks += 1;
        if (clicks === 1) {
            origin = $("#origin").val();
            console.log(origin);
        }
        destinationAdder(destinations, destinationButton);
        console.log(destinations);
    });

    $("#getDirections").click(function () {
        showDirections(origin, destinations);
        downloadAllAddressDirections(origin, destinations);
    });

});
