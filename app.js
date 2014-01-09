
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var facebook = require('facebook-node-sdk');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();
mongoose.connect('mongodb://locahost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay!!!');
}); 

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'mininoic' }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new FacebookStrategy({
    clientID: '277989055685982',
    clientSecret: 'aeed09338aceda667fcfd500cefa2887',
    callbackURL: "http://localhost:4000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook', {scope: ['email']}),
  function(req, res){
    res.redirect('/');
  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/login' }),
  function(req, res) {
  	res.send('ok');
  } 
);

app.get('/logout', function(req, res){
  req.logout();
  return res.redirect('/');
});

app.get('/', function(req, res){
	return res.send('homepage');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
