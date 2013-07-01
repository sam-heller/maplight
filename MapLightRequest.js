var http = require('http');
var _ = require ('underscore');

var MapLightRequest = function(){
	this.request = null;
	this.apiKey = 'example';
	this.organizationSearchRoot = '/services_open_api/map.organization_search_v1.json?';
	this.organizationPositionSearchRoot = '/services_open_api/map.organization_positions_v1.json';

	this.sendRequest = function(path, callback){
		var options = {
			hostname : 'maplight.org',
			port : 80,
			method : 'GET',
			path : path
		};
		var request = http.request(options, callback);
	}


	this.organizationSearch = function(searchParams, callback){
		this.sendRequest(this.organizationSearchRoot + this.buildQueryString(params), callback);
	}

	this.organizationPositionsSearch = function(searchParams, callback){
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

