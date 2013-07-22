var RoutePattern = require('route-pattern');
var _ = require('underscore');

var QueryRouter = (function(){
	const FullPatternString = '/:model/:query/:fields';
	const QueryPatternString = '/:model/:query';
	const ModelPatternString = '/:model';

	//Constructor
	function QueryRouter(){
		this.FullPattern = RoutePattern.fromString(FullPatternString);
		this.QueryPattern = RoutePattern.fromString(QueryPatternString);
		this.ModelPattern = RoutePattern.fromString(ModelPatternString);
	}

	QueryRouter.prototype.parseRequest = function(requestUri){
		var returnData = {};
		if (this.FullPattern.matches(requestUri)){
			namedParams = this.FullPattern.match(requestUri).namedParams;
			returnData.model = this.parseModel(namedParams.model);
			returnData.query = this.parseQuery(namedParams.query);
			returnData.fields = this.parseFields(namedParams.fields);
		} else if (this.QueryPattern.matches(requestUri)){
			namedParams = this.QueryPattern.match(requestUri).namedParams;
			returnData.model = this.parseModel(namedParams.model);
			returnData.query = this.parseQuery(namedParams.query);
		} else if (this.ModelPattern.matches(requestUri)){
			namedParams = this.ModelPattern.match(requestUri).namedParams;
			returnData.model = this.parseModel(namedParams.model);
		}
		return returnData;
	}

	QueryRouter.prototype.parseQuery = function(queryString){
		var params = [];
		var operator = '';
		var splitValues = '';
		var currentParam = {};
		var subSplitValues = [];
		_.each(queryString.split(','), function(value){

			//Get operator and split params
			if (value.indexOf('=') != -1){
				splitValues = value.split('=');
				operator = 'EQ';
			} else if (value.indexOf('!') != -1){
				splitValues = value.split('!');
				operator = 'NE';
			}
			currentParam = {};
			currentParam['operator'] = operator;
			currentParam['value'] = splitValues[1];
			if (currentParam.value.indexOf('|') != -1){
				currentParam.value = currentParam.value.split('|');
			}

			//Determine if we've got a child model
			if (splitValues[0].indexOf('.') != -1){
				subSplitValues = splitValues[0].split('.');
				currentParam['field'] = subSplitValues[1];
				currentParam['ChildModel'] = subSplitValues[0]; 
			} else {
				currentParam['field'] = splitValues[0];
			}

			params.push(currentParam);			

		});
		return params;
	}

	QueryRouter.prototype.parseFields = function(fieldsString){
		var fields = fieldsString.split(',');
		var data = [];
		_.each(fields, function(value){
			if(value.indexOf('(') != -1){
				var parentValue = value.substring(0, value.indexOf('('));
				var childValues = value.substring(value.indexOf('(') + 1, value.indexOf(')')).split('|');
				var objectVal = {};
				objectVal[parentValue] = childValues;
				data.push(objectVal);
			} else {
				data.push(value);
			}
		});
		return data;
	}

	QueryRouter.prototype.parseModel = function(modelString){
		return modelString;
	}
	return QueryRouter;
})();

//modelQuery = 'organization_id,organization_name,bill_position(bill_id,position)';
//modelQuery = 'organization_id,organization_name,bill_position(bill_id|position)'

//matched = /(,(?:(?!,).)*\(.*\))/.exec(modelQuery);

//console.log(modelQuery.split(','));

//var myTest = new QueryRouter();
//var data = myTest.parseRequest('/organization/match=this,submatch=that,bill_positions.bill_id!thisguy/organization_id,organization_name,bill_position(bill_id|position)');
//console.log(data);

module.exports = QueryRouter;
