/**
 *
 * Created by ChessTastic on 1/7/16.
 */

var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(function(infoArray, index){

   var dataString = infoArray.join(",");
   console.log(infoArray);
   console.log(dataString);
   csvContent += dataString;
   // csvContent += index < data.length ? dataString+ "\n" : dataString;

});

console.log(csvContent);
