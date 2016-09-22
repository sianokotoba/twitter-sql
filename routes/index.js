'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db');

module.exports = function makeRouterWithSockets (io) {




  // a reusable function
  // function respondWithAllTweets (req, res, next){
  //   var allTheTweets = tweetBank.qlist();
  //   res.render('index', {
  //     title: 'Twitter.js',
  //     tweets: allTheTweets,
  //     showForm: true
  //   });
  // }

  function respondWithNewTweets (req, res) {
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id;', function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  }


  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithNewTweets);
  router.get('/tweets', respondWithNewTweets);


  // single-user page
  router.get('/users/:username', function(req, res, next){
    client.query('SELECT * FROM tweets INNER JOIN users ON tweets.userid = users.id WHERE name=$1', [req.params.username], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    client.query('SELECT name, content FROM tweets INNER JOIN users ON tweets.userid = users.id WHERE tweets.id=$1', [req.params.id], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
    });
  });

  // create a new tweet
//   router.post('/tweets', function(req, res, next){
//     var userName = req.body.name,
//         userContent = req.body.content;
//     client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2) EXISTS (SELECT id FROM users WHERE name=$3)', [users.id, userContent, userName], function (err, result){
//         var newTweets = result.rows;
//         res.render('index', { title: 'Twitter.js', tweets: newTweets, showForm: true
//         }); //res.render
//         io.sockets.emit('new_tweet', newTweets);
//         res.redirect('/');
//     })
// });


  router.post('/tweets', function(req, res, next){
    client.query('SELECT id FROM users WHERE name=$1', [req.body.name], function (err,result){
      result = result.rows[0]['id'];
      if (err) return next(err);
      if (result){
        client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [result, req.body.content], function (err, result2){
          var newTweets = result2.rows;
          res.redirect('/');
          io.sockets.emit('new_tweet', newTweets);
        })
      } else {
        //client.query('INSERT INTO users (id, ')
      }
    })
  });








  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
