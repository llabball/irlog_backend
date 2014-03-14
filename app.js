var express = require('express')
  , cronJob = require('cron').CronJob
  , http = require('http')
  , Flickr2CouchDB = require('./libs/Flickr2CouchDB')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  // app.use(express.logger('dev'));
  // app.use(express.bodyParser());
  // app.use(express.methodOverride());
  // app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//cronjobs
var flickr2CouchDB_Job = new cronJob({
  cronTime: '0 15 23 * * *',
  onTick: function() {Flickr2CouchDB.sync()},
  start: true
})


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});