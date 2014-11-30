var express = require('express');
var Bird    = require('bird');
var qs      = require('querystring');

var app = express();

app.get('/', function(req, res){
  Bird.auth.requestToken({
    oauth: {
      callback: 'http://127.0.0.1:3000/tw-callback',
      consumer_key: process.env.TW_CONSUMER_KEY,
      consumer_secret: process.env.TW_CONSUMER_SECRET
    }
  }, function(err, response, body){
    // save the users token for later use
    // redirect user to https://api.twitter.com/oauth/authorize?oauth_token= + token.oauth_token
    var token = qs.parse(body);
    res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + token.oauth_token);
  });
});

app.get('/tw-callback', function(req, res){
  Bird.auth.accessToken({
    oauth: {
      consumer_key: process.env.TW_CONSUMER_KEY,
      consumer_secret: process.env.TW_CONSUMER_SECRET,
      token: req.query.oauth_token,
      verifier: req.query.oauth_verifier
    }
  }, function(err, response, body){
    var token = qs.parse(body);
    res.json(token);
    // save the users `token.oauth_token` and `token.oauth_token_secret` here
  });
});

app.listen(3000);
