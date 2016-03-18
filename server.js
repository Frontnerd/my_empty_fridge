// inspired by this tutorial: http://ctheu.com/2015/02/09/a-journey-through-the-creation-of-an-app-with-node-mongodb-react-gulp/


var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');


// CREATE APP EXPRESS

var app = express();

app.get('/', function(req, res){
  res.send('Hey this is express <b>ok?</b>');
})

app.listen(3000)


// CONNECT TO mongoDB VIA MONGOOSE

mongoose.connect('mongodb://localhost:27017/');
var ScoreModel;
var db = mongoose.connection;


db.on('error', function(e) {
  console.error('connection error:', e);
});

db.once('open', function(callback) {
  var Schema = mongoose.Schema;
  var scoreSchema = new Schema({ name: String, score: String });
  ScoreModel = mongoose.model('Score', scoreSchema);
  app.listen(8080);
});



// POPULATE mongDB WITH SOME DATA

var url = 'https://msdn.microsoft.com/en-us/library/office/aa212292%28v=office.11%29.aspx';

request(url, function(error, response, html){
  var $ = cheerio.load(html);
  var tableCell = $('.clsStd').eq(1).find('td');
  tableCell.each(function(){
    var name = $(this).attr('style');
    var score = $(this).text();
    var newScore = new ScoreModel({ name: name, score: score });
    newScore.save(); // populate DB
    //console.log(JSON.stringify(newScore)); 
  });
});



// ADD ROUTE RETREIVE DATA

app.get('/data', function(req, res) {
  res.send('here the data: cbcjv');
});



