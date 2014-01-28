
/**
 * GLOBAL 
 */

db = require('./models');
db();
ObjectId = require('mongoose').Types.ObjectId;

graph = require('fbgraph');
facebook_sdk = require('facebook-node-sdk');
async = require('async');

conf = {
  client_id : "571644532917565",
  client_secret : "130d81339a57fad9323b2e8a25bbe492",
  scope: 'publish_actions,publish_stream'
};

facebook = new facebook_sdk({
  appID  : conf.client_id,
  secret : conf.client_secret
}).setAccessToken(conf.client_id+'|'+conf.client_secret);

musicList = require('./public/js/data.js');

function random3(arr){
    var n = 3;
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
  }

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var user = require('./routes/user');
var admin = require('./routes/admin');
var challenge = require('./routes/challenge');

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

/**
 * ROUTERS
 */

app.get('/', function(req, res){
  return res.render('index');
});

app.all('/user', user.login);

app.all('/user/setting', user.setting);

app.all('/user/score', user.addScore);

app.get('/logout', user.logout);

app.all('/challenge/create', challenge.create);

app.all('/challenge/score', challenge.score);

app.all('/challenge/respon', challenge.respon);

// app.get('/test', function(req, res){
//   res.setHeader('Content-Type', 'text/plain');
//   var profile = "https://www.facebook.com/dotabox,https://www.facebook.com/netcell";
//   var profile1 = "100004174080767";
//   var profile2 = "100000154313353";
//   var profile3 = "1375217591";
//   var p = ["100004174080767","100000154313353","1375217591"];
  
//   var params = {
//       "href" : "pianoic.com",
//       "template" : 'Bạn đã nhân được lời thách đấu'
//     };
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});