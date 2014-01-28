(function() {
 
  module.exports = function(req, res) {
    return db.challegens.find(function(err, data) {
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

    req.session.access_token = access_token;
    graph.setAccessToken(access_token);
    graph.get(data.uid, function(err, result){
      
      req.session.user = result;

      var params = {
        fid : result.id,
        name : result.name,
        setting : {},
        highscore : [],
        challenge : [],
      };

      var user = new db.users(params);

      db.users.find({fid : params.fid}).exec(function(err, rows){
        if(err) throw err;
        if(rows[0]){
          db.challenges.find({$or : [{"fid": params.fid}, {"rivalID" : params.fid}]}).exec(function(err, rows1){
            if(err) throw err;
            var data_respon = rows[0];
            data_respon.challenge = rows1;
            return res.json(data_respon);
          });
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
    data = JSON.parse(data);
    var session_user = req.session.user;

    db.users.update({fid : session_user.id}, {$set : {"settings" : data}})
    .exec(function(err, rows){
      if(err) throw err;
      return res.json(1);
    });
  };

  module.exports.addScore = function(req, res){
    
    var data = req.body;
    var session_user = req.session.user;

    console.log(data);
    var params = {
      mid : data.a,
      level : data.b,
      score : data.c
    };

    // var params = {
    //   mid : 3,
    //   level : 1,
    //   score : 17000
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

    var cb = function(beat){
       res.json(beat);
    };

    compareFriends(session_user.id, params, cb);

    //res.json(1);
  };

  function compareFriends(fid, highscore, cb){
      var beat = [];//danh sach ban be diem thap hon
      //so sanh voi ban be
      graph.get(fid+"?fields=friends", function(err, result) {
        var friends = result.friends.data;

        var arr_id = [];
        for(var i = 0; i<friends.length; i ++){
          arr_id.push(friends[i].id);
        }

        db.users.find({
          fid : {$in : arr_id},
          highscore : {$elemMatch : {mid : highscore.mid, level : highscore.level, score : {$lt : highscore.score}}},
        }).exec(function(err, rows){
          //tim thay thanh cong
          console.log(rows);
          if(rows){
              graph.get('oauth/access_token?client_id='+conf.client_id+'&client_secret='+conf.client_secret+'&grant_type=client_credentials', function(err, app_token){
              if(err) throw err;
              console.log(app_token);
              for(var j = 0; j < rows.length; j++){
                beat.push(rows[j].fid);
                beatOnFacebook(fid,app_token.access_token,rows[j].fid);
              }
              cb(beat);
            });
          }
        });
      });
  }

  function beatOnFacebook(fid, app_token,profile){
    graph.post(fid+'/pianoic:beat?access_token='+app_token+'&method=POST&profile='+profile,function(err, result){
          console.log(result);
    });
  }
 
}).call(this);