var _ = require('underscore'),
	RoutePattern = require('route-pattern'),
	QueryRouter = require('./lib/QueryRouter.js'),
	MaplightRequest = require('./lib/MaplightRequest.js')
	;



//var getRouter = new QueryRouter();
//data = getRouter.parseRequest('/organization/match=this,submatch=that,bill_positions.bill_id!thisguy/organization_id,organization_name,bill_position(bill_id|position)');
//console.log(data);

var req = new MaplightRequest();

var test = req.sendRequest('/', function(res){console.log("Response is", res);});

console.log("Response from request is ", test);