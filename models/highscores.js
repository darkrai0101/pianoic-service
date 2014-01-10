(function(){
	var mongoose, schema;

	mongoose = require('mongoose');

	schema = mongoose.Schema({
		userID : mongoose.SchemaTypes.ObjectId,
		mid : Number,
		level : Number,
		highscore : Number
	});

	schema.methods.beatFriends = function(callback){
		return calback();
	};

	module.exports = schema;

}).call(this);