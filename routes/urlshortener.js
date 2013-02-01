var http = require('http');

exports.index = function(lblreq, lblres) {
	var query = lblreq.query
		,	url = query.url;

	if (!url || url.length < 12) 
		lblres.json(400, {});

	//fetching new items from getpocket.com
	var opts = {
		'hostname': 'lbl.io',
		'port': 80,
		'path': '/urlshortener/create?url='+ url,
		'method': 'POST',
		'headers': {
			'Accept': 'application/json',
			'Content-Type': 'application/json; charset=UTF-8',
			'Authorization': 'Basic YmFja2VuZDpFUmRpbGVSZGlzLg=='
		}
	};

	var couchreq = http.request(opts, function(couchres) {
	  var data = '';

	  couchres.on('data', function(d) {
	    data += d;
	  });

	  couchres.on('end', function() {
	  	data = JSON.parse(data);
	  	
	  	if (data.error)
	  		lblres.json(500, data);

	  	lblres.json(200, data);
	  });

	});

	couchreq.end();

	couchreq.on('error', function(e) {
	  lblres.json(500, {"error": JSON.stringify(e)});
	});
	
};