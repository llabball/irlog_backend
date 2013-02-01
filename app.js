var express = require('express')
  , syncpocket = require('./routes/syncpocket')
  , cron = require('./routes/cron')
  , urlshortener = require('./routes/urlshortener')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/syncpocket', syncpocket.index);
app.get('/urlshortener/create', urlshortener.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

cron.start();