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

  module.exports.logout = function(req, res){
    req.session.user = null;
    return res.json(1);
  };
 
  module.exports.login = function(req, res){
    var data = req.body;
    var access_token = data.access_token;
    graph.setAccessToken(access_token);

    graph.get(data.uid, function(err, result){
      
      req.session.user = result;

      var params = {
        fid : result.id,
        name : result.name,
        setting : {},
        highscore : [],
      };

      var user = new db.users(params);

      db.users.find({fid : params.fid}).exec(function(err, rows){
        console.log(rows);
        if(err) throw err;
        if(rows[0]){
          return res.json(rows[0]);
        }else{
          user.save(function(err, rows){
            return res.json(params);
          });
        }
      });
    });
  };

  module.exports.setting = function(req, res){
    var data = req.body.setting;
    var session_user = req.session.user;

    var user = new db.users();
    user.update({fid : session_user.id}, {$set : {setting : data}})
    .exec(function(err, rows){
      if(err) throw err;
      console.log(rows);
      return res.json(1);
    });
  };

  module.exports.addScore = function(req, res){
    
    var params = req.body;
    var session_user = req.session.user;

    // var params = {
    //   mid : 6,
    //   level : 1,
    //   score : 10000
    // };

    var user = new db.users();

    db.users.findOne({fid : session_user.id, highscore : {$elemMatch : {mid : params.mid, level : params.level}}})
    .exec(function(err, rows){
      console.log(rows);
      if(rows){
        db.users.update(
          {fid : session_user.id, highscore : {$elemMatch : {mid : params.mid, level : params.level, score : {$lt : params.score}}}},
          {$set : {"highscore.$.score" : params.score}}
        ).exec(function(err, rows){
          if(err) throw err;
          console.log(rows);
        });
      }else{
        db.users.update(
            {fid : session_user.id},
            {$push: {'highscore': {mid: params.mid, level: params.level, score : params.score}}}
        ).exec(function(err, rows){
          if (err) throw err;
          console.log(rows);
        });
      }
    });

    // var cb = function(beat){
    //   return res.json(beat);
    // };

    // compareFriends(session_user.id, data, cb);

    return res.json(1);
  };

  function compareFriends(fid, highscore, cb){
      var beat = [];//danh sach ban be diem thap hon
      //so sanh voi ban be
      async.series([
        function(callback){
          graph.get(fid+"?fields=friends", function(err, result) {
            var friends = result.friends.data;

            var arr_id = [];
            for(var i = 0; i<friends.length; i ++){
              arr_id.push(friends[i].id);
            }

              db.users.find(
              {
                fid : {$in : arr_id},
                highscore : {$elemMatch : {mid : highscore.mid, level : highscore.level, score : {$lt : highscore.score}}},
              }).exec(function(err, rows){
                //tim thay thanh cong
                console.log(rows);
                if(rows[0]){
                  for(var j = 0; j < rows.length; j++){
                    beat.push(rows[j].fid);
                  }
                  callback();
                }
              });
          });
        },
        function(callback){
          console.log(beat);

          graph.post(fid+'/pianoic:beat?fb:explicitly_shared=true&client_secret='+conf.app_secret+'&profile='+profile+'&tags='+arr_tags,function(err, result){
            console.log(result);
          });
          
          cb(beat);
        }
      ]);
  }
 
}).call(this);