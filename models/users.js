(function(){
	var mongoose, schema;

	mongoose = require('mongoose');

	schema = mongoose.Schema({
		fid : String,
		name : String,
		highscore: [{mid : Number, score : Number, level : Number}],
	});

	schema.methods.beatFriends = function(callback){
		db.users.find()
          .where('fid').equals(this.fid)
          .where('highscore.mid').equals(this.highscore.mid)
          .where('highscore.level').equals(this.highscore.level)
          .where('highscore.score').gt(this.highscore.score)
          .select('fid')
          .exec(function(err, adventure){
			if(err) throw err;
			callback(null, adventure); 
		});
	};

	schema.methods.login = function(callback){
		
	};

	schema.methods.insertHighscore = function(callback){

	};



	module.exports = schema;

}).call(this);