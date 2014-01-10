
//start MongoDB
db = require('./models');
db();

var user = require('./routes/user');
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var graph = require('fbgraph');

var app = express();

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   console.log('ok');
// });

// var Schema = mongoose.Schema;

// var userSchema = new Schema({
//   fid:  String,
//   name: String,
//   highscore: [{mid : Number, score : Number, level : Number}],
//   friend: [String],
// });

// var user = mongoose.model('user', userSchema);


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
app.use(passport.initialize());
app.use(passport.session());
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
    graph.setAccessToken(accessToken);
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
    console.log(req.user);
    graph.get(req.user.id+"?fields=friends", function(err, result) {
      var friends = result.friends.data;
      console.log(friends);
      var flag = 0;
      for(var i = 0; i < friends.length; i++){
        var fid = friends[i].id;
        var score = 30000;
        var level = 2;
        var mid = 2;
        
        return res.json('0'); 
      }
    });
  }
);

app.get('/logout', function(req, res){
  req.logout();
  return res.redirect('/');
});

app.get('/', function(req, res){
  graph.get(req.user.id+"?fields=friends", function(err, result) {
      return res.json(result);
    });
});

app.get('/user/add', function(req, res){

  // var player = new user({
  //   fid: '100006265984516',
  //   name: 'nguyen van trung',
  //   highscore: [{mid: 2, score: 20000, level: 2}, {mid: 3, score: 40000, level: 2}],
  //   friend: ['1', '2'],
  // });

  // player.save(function(err){
  //   if(err) return handleError(err);
  // });

  return res.send('ok');
});

app.get('/users', user);

app.get('/users/login', user.login);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
