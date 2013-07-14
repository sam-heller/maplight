var http = require('http');
var _ = require ('underscore');
var mysql = require('mysql');


var getConnection = function(){
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : ''
	});
	connection.connect();
	connection.query('use maplight_test');
	return connection;
}


var MapLightRequest = function(){
	this.request = null;
	this.apiKey = 'example';
	this.organizationSearchRoot = '/services_open_api/map.organization_search_v1.json?';
	this.organizationPositionSearchRoot = '/services_open_api/map.organization_positions_v1.json?';

	this.sendRequest = function(path, callback){
		var options = {
			hostname : 'maplight.org',
			port : 80,
			method : 'GET',
			path : path
		};
		var request = http.request(options, callback);
		request.end();
	}


	this.organizationSearch = function(searchParams, callback){
		this.sendRequest(this.organizationSearchRoot + this.buildQueryString(params), callback);
	}

	this.organizationPositionSearch = function(searchParams, callback){
		this.sendRequest(this.organizationPositionSearchRoot + this.buildQueryString(params), callback);	
	}

	this.buildQueryString = function(searchParams){
		searchParams['apikey'] = this.apiKey;
		var paramString = '';
		_.each(searchParams, function(value, key){
			paramString += key + "=" + value + "&";
		});
		paramString = paramString.substring(0, paramString.length -1);
		return paramString;
	}

}


var request = new MapLightRequest();
var myIds = [];
var params = {
	'organization_id' : '23373',
	'jurisdiction' : 'CA'
};
console.log('here');
conn2 = getConnection();
conn2.query('SELECT `organization_id` FROM `maplight_test`.`organization` WHERE `maplight_test`.`organization`.`organization_category` IS NULL LIMIT 100', function(err, rows, fields){
	console.log("error is ", err);
	_.each(rows, function(value, key){
		request.organizationPositionSearch({'organization_id' : value.organization_id,'jurisdiction' : 'CA'}, function(res){
				res.body = '';
				res.on('data', function(chunk){
					if (chunk !== undefined){
						res.body += chunk;
					}
				});
				var catcode = '';
				var myquery = '';
				var connection = getConnection();
				res.on('end', function(){
					var test = JSON.parse(res.body);
						console.log(test.positions);
						catcode = test.positions[0].catcode;
						//console.log("Catcode : ", catcode);
						myquery = "UPDATE `maplight_test`.`organization` SET `organization_category`=" + 
							connection.escape(catcode) + 
							" WHERE organization_id = " + connection.escape(params.organization_id) + ";";
						console.log("Query is ", myquery);

					
				});
				connection.end();
			}
		);

	});
});

conn2.end();




