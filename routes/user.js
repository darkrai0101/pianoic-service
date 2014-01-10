(function() {
 
  module.exports = function(req, res) {
    return db.users.find(function(err, data) {
      if (!err) {
        return res.json(data);
      } else {
        return res.send('Could not connect to the database');
      }
    });
  };
 
  module.exports.login = function(req, res) {
    var infouser = req.user;
    console.log(infouser);
    var params = {
      fid : infouser.id,
      name : infouser.displayName,
      highscore : {
        mid : 2,
        level : 2,
        score : 3000
      }
    };

    var user = new db.users(params);
    user.login(function(err, data){
      if(err) throw err;
      return res.json(data);
    });
  };

  module.exports.addScore = function(req, res){
    var params = req.body;
    var player = new db.users(params);
    player.save(function(err){
      if(err) throw err;
    });
  };
 
}).call(this);