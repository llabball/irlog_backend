var https = require('https')
	,	couch = require('nano')('https://pocket:ERdileRdis.@ir.couchone.com/llabball');

exports.index = function(lblreq, lblres) {

	//fetching new items from getpocket.com
	var opts = {
		'hostname': 'getpocket.com',
		'port': 443,
		'path': '/v3/get',
		'method': 'POST',
		'headers': {
			'X-Accept': 'application/json',
			'Content-Type': 'application/json; charset=UTF-8'
		}
	};

	var pocketreq = https.request(opts, function(pocketres) {
	  var data = '';

	  pocketres.on('data', function(d) {
	    data += d;
	  });

	  pocketres.on('end', function() {
	  	data = JSON.parse(data);

	    if (data.complete === 1 && data.status === 1) {
	    	var list = data.list
	    		,	since = data.since
	    		, docs = []
	    		, item, doc;

				for (item in list) {
					doc = list[item];
					doc['_id'] = '/pocketitem/' + doc.item_id;
					doc['type'] = '/type/pocketitem';
					doc['synced'] = since;
					docs.push(doc);
				} 
			}

			couch.bulk({'docs':docs}, function (error, couchres) {
				var msg = '';
				if (error !== undefined && error !== null) {
					msg = 'error: ' + JSON.stringify(error);
				} else {
					msg = 'response: ' + JSON.stringify(couchres);
				}
				lblres.send(msg);
			});

	  });

	});
	
	pocketreq.write(JSON.stringify({
		'consumer_key': '11337-ee09914bb100c090b47fc966', 
		'access_token': '5acefb3f-67d1-8bdd-e11d-3f06db',
		'state': 'archive',
		'sort': 'newest',
		'detailType': 'complete'
	}));

	pocketreq.end();

	pocketreq.on('error', function(e) {
	  console.error(e);
	});
};