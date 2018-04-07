require('dotenv').config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var request = require('request');

var fs = require('fs');

var songDefault = 'the sign ace of base';
var movieDefault = 'mr nobody';

function appendLogTxt(record) {
  fs.appendFile('log.txt', record, function(err){
    if (err) {
      return console.error(err);
    }
  })
};

var commands = {
  'my-tweets': function () {

    var params = {
      screen_name: 'sparklekingdom3'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
      if (!error) {
        console.log('Here are the 20 most recent tweets by @' + params.screen_name);
        for (twIndex = 0; twIndex < tweets.length; twIndex++) {
          var tweetTime = tweets[twIndex].created_at.split('+');
          console.log(tweetTime[0] + ' ' + tweets[twIndex].text);
        }
      }
    });
    appendLogTxt('my-tweets, ');
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

      console.log('Track Name: ' + JSON.stringify(data.tracks.items[0].name) + ' Album: ' +
        JSON.stringify(data.tracks.items[0].album.name) + '\nArtists: ')
      data.tracks.items[0].artists.forEach(function (artist) {
        console.log(' ' + JSON.stringify(artist.name));
      });

      console.log('\nLink for preview: ' + JSON.stringify(data.tracks.items[0].preview_url))
    });

    appendLogTxt('spotify-this-song: ' + songInput + ', ');
  },

  'movie-this': function (movieInput) {
    if (!movieInput) {
      movieInput = movieDefault;
    }

    request('http://www.omdbapi.com/?t=' + movieInput + '&y=&plot=short&apikey=trilogy', function (error, response, body) {

      if (!error && response.statusCode === 200) {
        var movie = JSON.parse(body);

        console.log('Title: ' + movie.Title + ', Year: ' + movie.Year + '\nIMDB Rating: ' + movie.imdbRating + '\nCountry: ' + movie.Country +
          ', Language: ' + movie.Language + '\nPlot: ' + movie.Plot + '\nActors: ' + movie.Actors);
      }
    });
    appendLogTxt('movie-this: ' + movieInput + ', ');
  },

  'do-what-it-says': function () {
    
    fs.readFile('random.txt', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      //split data from random.txt into an array. index0 is the command and index1 is the input
      var doWhatArray = data.split(',');
      commands[doWhatArray[0]](doWhatArray[1]);
    });
    appendLogTxt('do-what-it-says, ');
  }
};

//the first argument the user passes is their 'Liri command' ie movie-this
var userCommand = commands[process.argv[2]];
//user input control. if the argument is not one of the methods in the commands object, 
//then the function will return & you'll get this Liri rejection msg
if (!userCommand) {
  return console.log('Liri cannot complete your request. Please try a new command. Examples: \nmy-tweets \nspotify-this-song \nmovie-this \ndo-what-it-says')
};


//this will allow users to input a song title or movie title without quotes
var processArg = process.argv;
var userInputArray = [];
//start the for loop at the argument after the command
for (i = 3; i < processArg.length; i++) {
  userInputArray.push(processArg[i]);
};
//array to string with spaces
var userInputString = userInputArray.join(' ');

//call the function to actually execute the code
userCommand(userInputString);