# [Google Directions Report Generator](https://developertenzin.github.io/google_directions)
------------------------------------
The goal of this project is to create a website that uses the Google Maps API in order to give data to its users. The web app will take in user's origin followed by all their commonly visited places. Using that it will generate a report for the travel instructions towards all those places and e-mail them to the user so they have their navigation even through **offline** access.

## NOTE:
If you want to use the website as of now... You **need** to install [CORS plugin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) for Google Chrome and enable it to bypass the Cross Origin Resource Sharing standards.

## Completed:
- [X] [FROM and TO input text fields](https://www.dropbox.com/s/tgubjs93bxqc4wd/Screenshot%202016-01-07%2019.49.33.png?dl=0) for users (@DeveloperTenzin).
- [X] Pull data from [The Google Maps Directions API](https://developers.google.com/maps/documentation/directions/intro#traffic-model). Clean it and use it! (@QaziPython).
- [X] [Create a download CSV file button](http://stackoverflow.com/questions/11620698/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript) (@QaziPython).
- [X] [Convert the data to a CSV downloadable link](http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side) (@QaziPython).
- [X] Add a [plus sign button](https://www.dropbox.com/s/iiobcwn5ikjusev/Screenshot%202016-01-07%2019.52.21.png?dl=0) to allow the user to input multiple destinations. (@DeveloperTenzin).

## TODO:
- [ ] Create a slider input field for recurring user input for destinations (@DeveloperTenzin).
- [ ] Adhere to Cross Origin Resource Sharing standards, or [CORS](http://www.html5rocks.com/en/tutorials/cors/), otherwise the website will not work for users (@DeveloperTenzin, @QaziPython)! 
