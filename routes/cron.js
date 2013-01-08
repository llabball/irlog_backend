var cronJob = require('cron').CronJob
	, http = require('http');


exports.start = function () {
	var job = new cronJob({
	  cronTime: '0 15 23 * * *',
	  onTick: function() {
	    syncpocket();
	  },
	  start: true,
	  timeZone: "Europe/Berlin"
	});
}

function syncpocket () {
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