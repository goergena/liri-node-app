require("dotenv").config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var request = require('request');

var fs = require('fs');

//GOALS 1 do omdb api request CHECK
//2 format the request CHECK
//3 comment out all the shit that would fuck up the app SORTA ITS FINE
//4 run a test for that movie CHECK
//5 run a test for no movie CHECK
//6 set up the twitter function CHECK
//7 test that CHECK
//8 set up the read function for do what it says
//9 spotify.

/*


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

       * Rotten Tomatoes Rating of the movie.


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

//spotify doesnt work


var songDefault = 'the sign ace of base';
var movieDefault = 'mr nobody';

var commands = {
  'my-tweets': function () {
    fs.appendFile('log.txt', 'my-tweets ', function (err) {
      if (err) {
        return console.error(err);
      }
      var params = {
        screen_name: 'sparklekingdom3'
      };
      client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
          for (twIndex = 0; twIndex < tweets.length; twIndex++) {
            var tweetTime = tweets[twIndex].created_at.split('+');
            console.log(tweetTime[0] + " " + tweets[twIndex].text);
          }
        }
      });

      console.log('this is supposed to be a list of your tweets ' + 'and their times');
    });
  },

  'spotify-this-song': function (songInput) {
    if (!songInput) {
      songInput = songDefault;
    }

    spotify.search({
      type: 'track',
      query: songInput,
      limit: 1
    }, function (err, data) {
      if (err) {
        return console.error(err);
      }

      console.log('Link for preview: ' + JSON.stringify(data.tracks.items[0].preview_url) +
        "\nTrack Name: " + JSON.stringify(data.tracks.items[0].name, null, 2) + ' Album: ' +
        JSON.stringify(data.tracks.items[0].album.name, null, 2) + '\nArtists: ');
      //JSON.stringify(data.tracks.items[0].artists[0].name)
      data.tracks.items[0].artists.forEach(function (artist) {
        console.log(" " + JSON.stringify(artist.name));
      });

    });


    //need to append to log.txt

    console.log('SPOTIFY TEST 138am');
  },

  'movie-this': function (movieInput) {
    if (movieInput === undefined) {
      movieInput = movieDefault;
      console.log("this is the default call")

    }
    if (!isNaN(movieInput)) {
      return console.log('Invalid value entered');
    }

    //need to append to log.txt
    request("http://www.omdbapi.com/?t=" + movieInput + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

      // If the request is successful (i.e. if the response status code is 200)
      if (!error && response.statusCode === 200) {
        var movie = JSON.parse(body);


        console.log("Title: " + movie.Title + ", Year: " + movie.Year + "\n IMDB Rating: " + movie.imdbRating + "\nCountry: " + movie.Country +
          ", Language: " + movie.Language + "\nPlot: " + movie.Plot + "\nActors: " + movie.Actors);
      }
    });

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

var processArg = process.argv;
var userInputArray = []

for (i = 3; i <processArg.length; i++){
 userInputArray.push(processArg[i]);
};
var userInputString = userInputArray.join(" ");

/*
if (userInput === undefined) {
  userCommand();
  console.log('bananas in pajamas!');
} else {
  userCommand(userInput);
  console.log("you were not able to call the if statement.")
};
*/
console.log('user input string: ' + userInputString);
userCommand(userInputString);