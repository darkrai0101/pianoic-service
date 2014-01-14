(function(){
	var mongoose, schema;

	mongoose = require('mongoose');

	schema = mongoose.Schema({
		fid : String,
		name : String,
		highscore: [{mid : Number, score : Number, level : Number}],
	});

	schema.methods.setting = function(callback){
		console.log(this);
        db.users.update({fid : fid}, {$set : {setting : this.setting}})
        .exec(function(err, rows){
			if(err) throw err;
			callback(err, rows);
        });
	};

	schema.methods.login = function(callback){

		// db.users.find({fid : this.fid}).exec(function(err, rows){
		// 	console.log(rows);
		// 	if(err) throw err;
		// 	if(rows[0]){
		// 		//khong lam j ca
		// 		callback(null, rows);
		// 	}else{
		// 		that.save(function(err, rows){
		// 			callback(null, rows);
		// 		});
		// 	}
		// });
	};

	schema.methods.addScore = function(callback){
		console.log(this);
		var highscore = this.highscore[0];
		//cap nhat du lieu vao users
		db.users.find({fid : this.fid , highscore: { $elemMatch : {mid : this.highscore.mid, level : this.highscore.level}}})
		.exec(function(err, rows){
			console.log(rows);
			if(rows[0]){
				//update diem cao moi
				db.users.update(
					{highscore : {mid : rows[0].mid, level : rows[0].level, score : {$lt : highscore.score}}},
					{"$set" : {"highscore.$.score" : highscore.score}}
				).exec(function(err, rows){
					if(err) throw err;
					callback(null, rows);
				});
				console.log('co');
			}else{
				console.log('ko co');
				//insert item highscore
				db.users.update(
				    {fid : this.fid}, 
				    {$push: {'highscore': {mid: highscore.mid, level: highscore.level, score : highscore.score}}}
				).exec(function(err, rows){
					if (err) {throw err;};
					callback(null, rows);
				});
			};
		});
		//so sanh voi diem so trong danh sach ban be
	};

	module.exports = schema;

}).call(this);