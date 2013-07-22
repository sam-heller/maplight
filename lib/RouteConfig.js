var _ = require('underscore');

var RouteConfig = (function(){

	function RouteConfig(configJson, controllerPath){
		this.config = configJson;
		this.controllerPath = controllerPath;
	}

	RouteConfig.prototype.configureRoutes = function(app){
		_.each(this.config.routes, function(routeType, routeVerb){
			_.each(routeType, function(route){
				obj = require(this.controllerPath + route.controller );
				app[routeVerb.toLowerCase()](route.path + '/*',
					function(req, res, next){
						req.app = app;
						next();
					}, obj[route.method]);
			}, this);
		}, this);
	}

	return RouteConfig;
})();

module.exports = RouteConfig;

