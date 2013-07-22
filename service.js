var _ = require('underscore'),
	RoutePattern = require('route-pattern'),
	QueryRouter = require('./lib/QueryRouter.js'),
	MaplightRequest = require('./lib/MaplightRequest.js'),
	RouteConfig = require('./lib/RouteConfig.js');
	express = require('express'),
	http = require('http'),
	path = require('path'),
	connect = require('connect');

//Instantiate the app
var app = express();
app.routePattern = RoutePattern;
app.queryRouter = new QueryRouter();
app._ = _;

//Add getModel method to Application
app.prototype.getModel = function(modelName){
	return require('./models/' + modelName)({'db' : db.mongoose});
}

router = new RouteConfig(require('./config/routeconfig.js'), __dirname + '/controllers/');
router.configureRoutes(app);

app.configure(function(){
	app.set('port', 3030);
	app.set('views', __dirname + '/views');
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions:true, 
        showStack:true
    }));
});


http.createServer(app).listen(app.get('port'), function(){
	console.log("Server has started on port : ", app.get('port'));
});
