(function(){
	var mongoose, schema;

	mongoose = require('mongoose');

	schema = mongoose.Schema({
		fid: String,
		rivalID: String,
		song : [{
			mid : Number,
			level : Number
		}],
		score: Array,
		rivalScore: Array,
		status: Number,
		createTime: Number
	});

	module.exports = schema;
	
}).call(this);