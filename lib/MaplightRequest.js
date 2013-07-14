var http = require('http');
var _ = require ('underscore');

var MaplightRequest = (function(){
	const ORGANIZATION_SEARCH = '/services_open_api/map.organization_search_v1.json?';
	const ORGANIZATION_POSITION_SEARCH = '/services_open_api/map.organization_positions_v1.json?';

	function MaplightRequest(apiKey){
		this.apiKey = apiKey;
	}

	MaplightRequest.prototype.sendRequest = function(path, callBack){
		var responseData;
		var options = {
			hostname : 'maplight.org',
			port : 80,
			method : 'GET',
			path : path
		};

		var request = http.request(options, function(res){
			res.body = '';
			res.on('data', function(chunk){
				res.body += chunk;
			});
			res.on('end', function(){
				callBack(res.body);
			});
		});
		request.end();
	}

	MaplightRequest.prototype.organizationPositionSearch = function(params, callback){
		this.sendRequest(ORGANIZATION_POSITION_SEARCH + this.buildQueryString(params), callback);	
	}

	MaplightRequest.prototype.organizationSearch = function(params, callback){
		this.sendRequest(ORGANIZATION_SEARCH + this.buildQueryString(params), callback);
	}

	MaplightRequest.prototype.buildQueryString = function(searchParams){
		searchParams['apikey'] = this.apiKey;
		var paramString = '';
		_.each(searchParams, function(value, key){
			paramString += key + "=" + value + "&";
		});
		paramString = paramString.substring(0, paramString.length -1);
		return paramString;
	}

	return MaplightRequest;
})();

module.exports = MaplightRequest;

