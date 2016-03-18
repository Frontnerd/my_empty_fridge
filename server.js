// inspired by this tutorial: http://ctheu.com/2015/02/09/a-journey-through-the-creation-of-an-app-with-node-mongodb-react-gulp/


var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var mongoose = require('mongoose');
//var async = require('async');
//var _ = require('lodash');



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
  var data = [];
  var tableCell = $('.clsStd').eq(1).find('td');
  tableCell.each(function(){
    var name = $(this).attr('style');
    var score = $(this).text();
    var newScore = new ScoreModel({ name: name, score: score });
    newScore.save(); // populate DB
    console.log(JSON.stringify(newScore)); 
  });
});



//// ADD ROUTE RETREIVE DATA

//app.get('/data', function(req, res) {
//  // look in the database for links containing 'policies'
//  // order them alphatically
//  // and takes the first 10
//  var data = db.find({ name: { $regex: /.*style.*/ } })
//    .sort({ name: 1 })
//    .limit(10)
//    .exec(function(err, result) {
//      res.send(result);
//    });
//});




















//var scrapPage = function(pageNumber) {
//    return function(callback) {
//        request('http://www.example.com/page/' + pageNumber, function(error, response, html) {
//            var $ = cheerio.load(html);
//            // when using .map() on cheerio, call .get() at the end otherwise you'll end up with a cheerio collection, not a string array
//            var links = $("a").map(function() { return { link: $(this).attr('href') }; })
//                              .get();
//            db.insert(links, function(error) {
//                console.log(error);
//            });
//        });
//    };
//};
//// create 10 tasks to scrape 10 pages
//var scrapTasks = _.range(10).map(function(i) { return scrapPage(i); });
//async.parallelLimit(scrapTasks, 3, function(error, result) {
//    console.log(result);
//});



