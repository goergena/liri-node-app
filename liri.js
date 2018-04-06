require("dotenv").config();

var keys = require('keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var request = require('request');

var fs = require('fs');

//GOALS 1 do omdb api request 
//2 format the request
//3 comment out all the shit that would fuck up the app
//4 run a test for that movie
//5 run a test for no movie
//6 set up the twitter function
//7 test that
//8 set up the read function for do what it says
//9 spotify.

/*

`node liri.js my-tweets`

   * This will show your last 20 tweets and when they were created at in your terminal/bash window.

2. `node liri.js spotify-this-song '<song name here>'`

   * This will show the following information about the song in your terminal/bash window
     
     * Artist(s)
     
     * The song's name
     
     * A preview link of the song from Spotify
     
     * The album that the song is from

   * If no song is provided then your program will default to "The Sign" by Ace of Base.
   * 
   * 
   * `node liri.js movie-this '<movie name here>'`

   * This will output the following information to your terminal/bash window:

     ```
       * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
     ```

   * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
     
     * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>
     
     * It's on Netflix!
   
   * You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.

4. `node liri.js do-what-it-says`
   
   * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
     
     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
     
     * Feel free to change the text in that document to test out the feature for other commands.

### BONUS

* In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

* Make sure you append each command you run to the `log.txt` file. 

* Do not overwrite your file each time you run a command.

- - -
*/
var songInput = 'the sign';
var movieInput = 'mr. nobody';

var commands = {
  'my-tweets': function () {
    fs.appendFile('log.txt', 'my-tweets ', function (err) {
      if (err) {
        return console.error(err);
      }

      console.log('this is supposed to be a list of your tweets ' + 'and their times');
    });
  },

  'spotify-this-song': function (songInput) {
    if (!isNaN(songInput)) {
      return console.log('Invalid value entered');
    }

    spotify.search({
      type: 'track',
      query: songInput
    }, function (err, data) {
      if (err) {
        return console.error(err);
      }

      console.log('spotify data: ' + data);
    });

    //need to append to log.txt

    console.log('this should be spotify');
  },

  'movie-this': function (movieInput) {
    if (!isNaN(movieInput)) {
      return console.log('Invalid value entered');
    }

    //need to append to log.txt
    request("http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

      // If the request is successful (i.e. if the response status code is 200)
      if (!error && response.statusCode === 200) {
        var movie = JSON.parse(body);


        console.log("Title: " + movie.Title + ", Year: " + movie.Year + "\n IMDB Rating: " + movie.imdbRating + " \nCountry: " + movie.Country +
          ", Language:" + movie.Language + "\nPlot: " + movie.Plot + "\nActors: " + movie.Actors);
      }
    });

    console.log('Withdrew ' + val + '.');
  },

  'do-what-it-says': function () {
    fs.appendFile('log.txt', 'do-what-it-says ', function (err) {
      if (err) {
        return console.error(err);
      }
      //add read function for random.txt
      console.log('spotify for i want it that way');
    });
  }
};

var userCommand = commands[process.argv[2]];

if (!userCommand) {
  return console.log("Liri cannot complete your request. Please try a new command.")
};

var userInput = process.argv[3];

if (!userInput) {
  userCommand();
} else {
  userCommand(userInput);
};