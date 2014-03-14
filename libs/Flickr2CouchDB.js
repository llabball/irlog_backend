var http = require('http')

exports.sync = function () {
  console.log('syncing ...')
}

function fetchImages () {
  var opts = {
    'hostname': 'backend.lbl.io',
    'path': '/syncpocket',
    'method': 'GET'
  };
  var req = http.request(opts, function (resp) {
    var data = '';
    resp.on('data', function (chunk) {
      data += chunk;
    });
    resp.on('end', function () {
      console.log('synced pocket items ' + new Date().toISOString());
    });
  });
  req.on('error', function(e) {
    console.error(e);
  });
  req.end();
}