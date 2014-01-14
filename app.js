
/**
 * Module dependencies.
 */

db = require('./models');
db();

graph = require('fbgraph');
async = require('async');

conf = {
  app_id : "571644532917565",
  app_secret : "130d81339a57fad9323b2e8a25bbe492",
  scope: 'publish_actions,publish_stream'
};

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var user = require('./routes/user');

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

/*
 * ROUTERS
 */

app.get('/', function(req, res){
  return res.render('index');
});

app.all('/user', user.login);

app.all('/user/setting', user.setting);

app.all('/user/score', user.addScore);

app.get('/logout', user.logout);

app.get('/test', function(req, res){
  //console.log(req.session.user);

  var wallPost = {
            score : 12300
            //message: "ban da danh bai  @[18798138] gjfj"
          };

          graph.post('100004174080767/scores', wallPost, function(err, res) {
            // returns the post id
            console.log(res); // { id: xxxxx}
          });
  return res.send('ok');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});