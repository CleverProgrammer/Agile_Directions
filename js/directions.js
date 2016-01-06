/**
 *
 * Created by ChessTastic on 1/6/16.
 */


API_KEY = "AIzaSyBPoko2bK_ViRjPtVVT7XuFYZWSmV_6scQ";

/*
$.getScript("../secret_api.js", function(){

    alert("Script loaded but not necessarily executed.");

});
*/


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
// A Google Maps Directions API request takes the following form:
    // https://maps.googleapis.com/maps/api/directions/output?parameters

    // Example:
    // The following request returns driving directions from Toronto, Ontario to Montreal, Quebec:
// https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY

    // Locations
var loc1 = '7024 west carol ave Niles IL'.replace(' ', "%20");
var loc2 = '9053 Laramie Avenue Skokie'.replace(' ', "%20");
var URL = "https://maps.googleapis.com/maps/api/directions/json?origin={0}&destination={1}&key={2}".format(loc1, loc2, API_KEY);

