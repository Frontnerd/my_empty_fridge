var express = require('express');

var request = require('request');
var cheerio = require('cheerio');

var async = require('async');
var _ = require('lodash');


var app = express();

app.get('/', function(req, res){
  res.send('Hey this is express <b>ok?</b>');
})

app.listen(3000)


//
//    Where are my data ?
//


var url = 'https://msdn.microsoft.com/en-us/library/office/aa212292%28v=office.11%29.aspx';


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/');
var ScoreModel;
var db = mongoose.connection;


db.on('error', function(e) {
  console.error('connection error:', e);
});

db.once('open', function(callback) {
  console.log('dentro +++++++++++++++++++++++++++');
  var Schema = mongoose.Schema;
  var scoreSchema = new Schema({ name: String, score: Number });
  ScoreModel = mongoose.model('Score', scoreSchema);
  app.listen(8080);
});





request(url, function(error, response, html){
  var $ = cheerio.load(html);
  var data = [];
  $('.clsStd').eq(1).find('td').each(function(){
    var name = $(this).attr('style');
    var score = $(this).text();
    data.push({name: name, score: score});
    
    var newScore = new ScoreModel({ name: name, score: score });
    newScore.save();
    console.log(newScore);
  });
  console.log(data);
});
























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



