var express = require('express')
  , cronJob = require('cron').CronJob
  , http = require('http')
  , Flickr2CouchDB = require('./libs/Flickr2CouchDB')

var app = express()

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  app.use(express.errorHandler())
})
app.configure('development', function(){
  app.set('couchprotocol','http')
  app.set('couchhost','localhost')
  app.set('couchport','5984')
})
app.configure('production', function(){
  app.use(express.errorHandler())
  app.set('couchprotocol','http')
  app.set('couchhost','78.77.76.245')
  app.set('couchport','5984')
})

//cronjob: syncs periodically flickr photos into a CouchDB
var flickr2CouchDB_Job = new cronJob({
  cronTime: '0 15 23 * * *',
  onTick: function() {Flickr2CouchDB.sync(app)},
  start: true
})


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});