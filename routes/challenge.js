(function() {
  module.exports = function(req, res) {
    return db.challenges.find(function(err, data) {
      if (!err) {
        return res.json(data);
      } else {
        return res.send('Could not connect to the database');
      }
    });
  };

  module.exports.request = function(req, res){
	//gui yeu cau thach dau
	var data = req.body;
	var session_user = req.session.user;
	var fid = session_user.id;
	data = {
		fid : '21765223212', //id nguoi nhan thach dau
		mid : '1',
		level : 2,
	};

	
  };

  module.exports.response = function(req, res){
	//tra loi yeu cau thach dau
  };

  module.exports.friend = function(req, res){
	//xu ly j day
	res.json(1);
  };
}).call(this);