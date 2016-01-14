// A Google Maps Directions API request takes the following form:
// https://maps.googleapis.com/maps/api/directions/output?parameters

// Example:
// The following request returns driving directions from Toronto, Ontario to Montreal, Quebec:
// https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY

// TODO use this for displaying the current user address if they leave origin field empty.
var freegoipURL = 'https://freegeoip.net/json/';

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
  var counter = 0;
  allDirections.forEach(function (directions) {
    counter += 1;
    var tempArray = [];
    directions.forEach(function (direction) {
      tempArray.push(strip(direction));
    });
    strippedDirections.push(tempArray);
  });

  var longest = 0;
  allDirections.forEach(function (arr, i) {
    if (arr.length > allDirections[longest].length) longest = i;
  });

  var newArray = strippedDirections[longest].map(function (col, i) {
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
 * Displays step by step directions for one address.
 * @param {Object} request
 */
function displayDirectionsReport(request) {
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var div = document.createElement("div");
  var largerDiv = document.createElement("div");
  directionsDisplay.setPanel(div);
  $(largerDiv).addClass("listDirections");
  $(largerDiv).append(div);
  $("#mainContainer").append(largerDiv);
  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      alert("Whoops, " + status + " you got an error!");
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
 * Automatically displays modal every time browser loads. Then takes the user input and verifies input value exists.
 * Then outputs the input on the page.
 * @param {Element} modal
 * @param {Element} doneButton
 * @param {Element} origin
 * @param {Element} originParagraph
 */
function displayOrigin(modal, doneButton,
                       origin, originParagraph) {
  modal.modal();
  modal.modal({backdrop: 'static', keyboard: false});
  doneButton.click(function () {
    if (origin.val() === "") {
      origin.css("border", "2px solid red");
    } else {
      modal.modal("hide");
      originParagraph.html(origin.val());
    }
  });
  origin.on('keydown', function (e) {
    if (e.which === 13 || e.keyCode === 13) {
      if (origin.val() === "") {
        origin.css("border", "2px solid red");
      } else {
        modal.modal("hide");
        originParagraph.html(origin.val());
        return false;
      }
    }
  });
}

/**
 * Displays the current city to the user if the user leaves the origin input field empty.
 * @param {Element} origin
 * @param {Element} originParagraph
 * @param {string} url --> 'https://freegeoip.net/json/'
 */
function currentCity(origin, originParagraph, url) {
  "use strict";
  $.getJSON(url).done(function (location) {
    if (!(origin.val())) {
      originParagraph.html(location.city);
      origin.val(location.city);
    }
  });
}

$(document).ready(function () {
  "use strict";
  // Initializing all HTML attributes.
  // Technology is great, but it has made us dependent on it to the point we can't remember simple directions to a friend's house, or more importantly to a workplace! So what would you do if the network connection or the phone battery were to die on you and you were navigating to a location!? This is why we have designed Agile Directions for you so you can download step by step directions to all your commonly visited places for offline access on a click of a button and all in once place! You can then print out those directions for your convenience and keep them as a backup in your car for emergency situations like your phone dying on you!
  var origin = $("#origin");
  var modal = $("#originModal");
  var originParagraph = $("#originParagraph");
  var doneButton = $("#doneButton");
  var destinationButton = $("#destination");
  displayOrigin(modal, doneButton, origin, originParagraph);

  var allDirections = [];
  var destinations = [];
  var clicks = 0;
  $("#plus").click(function () {
    origin = $("#origin").val();
    destinationAdder(destinations, destinationButton);

    // TODO add this to the main gh-pages most updated one.
    var index = allDirections.length;
    allDirections.push("PLACEHOLDER");
    var request = directionsRequest(origin, destinations[destinations.length - 1]);
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    // HTML STUFF
    var div = document.createElement("div");
    var largerDiv = document.createElement("div");
    directionsDisplay.setPanel(div);
    $(largerDiv).addClass("listDirections");
    $(largerDiv).append(div);
    $("#mainContainer").append(largerDiv);

    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        allDirections[index] = getDirections(response);
      } else {
        alert(status);
      }
    });

    $("#downloadDirections").click(function () {
      downloadDirectionsAsCSV(destinations, allDirections);
    });
  });
});
