/**
 * [description]
 * @return {[type]} [description]
 * status challenge:
 *   0: tao
 *   2: ca hai deu dau
 *   1: tu choi
 *   3: huy
 */
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

  module.exports.create = function(req, res){
    //gui yeu cau thach dau
    var params = req.body;
    var session_user = req.session.user;
    
    var song = JSON.parse(params.song);
    if(song){
      var fid = session_user.id;
      
      var rivalID;
      async.series([
        function(cb){
          if(params.fid == -1){
            var callback = function(fid){
              rivalID = fid;
              console.log(rivalID);
              cb();
            };
            randomRival(session_user.id, callback);
          }else{
            rivalID = params.fid;
            console.log(rivalID);
            cb();
          }
        }, function(cb){
          var data = {
            fid : fid,
            rivalID : rivalID,
            song : [{
              mid : song[0].mid,
              level : song[0].level
            }],
            type : params.type
          };

          var time = new Date();
          data.createTime = time.getTime();
          data.status = 0;

          var challenge = new db.challenges(data);
          challenge.save(function(err, rows){
            if(err) throw err;

            //notification to rivalID
            var template = "Bạn đã nhân được lời thách đấu từ "+session_user.name;

            notiFacebook(data.fid, template);

            var data_respon = {
              "_id" : rows._id,
            };

            if(params.fid == -1) data_respon.randomRival = rivalID;

            console.log(data_respon);
            return res.json(data_respon);
          });
        }
      ]);
    }else{
      var fid = session_user.id;
      var rivalID;
      async.series([
        function(cb){
          if(params.fid == -1){
            var callback = function(fid){
              rivalID = fid;
              console.log(rivalID);
              cb();
            };
            randomRival(session_user.id, callback);
          }else{
            rivalID = params.fid;
            console.log(rivalID);
            cb();
          }
        },function(cb){

          var list_song  = random3(musicList);

          var data = {
            fid : fid,
            rivalID : rivalID,
            song : [
              {mid : list_song[0].ID, level: randomLevel()},
              {mid : list_song[1].ID, level: randomLevel()},
              {mid : list_song[2].ID, level: randomLevel()},
            ],
            type : params.type
          };

          var time = new Date();
          data.createTime = time.getTime();
          data.status = 0;

          var challenge = new db.challenges(data);
          challenge.save(function(err, rows){
            if(err) throw err;

            //notification to rivalID
            var template = "Bạn đã nhân được lời thách đấu từ "+session_user.name;

            notiFacebook(data.rivalID, template);

            var data_respon = {
              "_id" : rows._id,
              "song" : data.song,
              "randomRival" : null
            };

            if(params.fid == -1) data_respon.randomRival = rivalID;

            console.log(data_respon);
            return res.json(data_respon);
        });
        }
      ]);
    }
  };

  module.exports.score = function(req, res){
    //tra loi yeu cau thach dau
    session_user = req.session.user;
    data = req.body;

    console.log(data);

    db.challenges.find({$and : [{_id : ObjectId(data._id)}, {fid : session_user.id }]}).exec(function(err, rows){
      console.log(rows);
      if(rows[0]){
        db.challenges.update(
          {_id : ObjectId(data._id)},
          {$set : {"score" : data.b}, $inc : {status : 1}})
        .exec(function(err, rows){
          if(err) throw err;
          console.log(rows);
          res.json(1);
        });
      }
    });

    db.challenges.find({$and : [{_id : ObjectId(data._id)}, {rivalID : session_user.id }]}).exec(function(err, rows){
      console.log(rows);
      if(rows[0]){
        db.challenges.update(
          {_id : ObjectId(data._id)},
          {$set : {"rivalScore" : data.b}, $inc : {status : 1}})
        .exec(function(err, rows){
          if(err) throw err;
          console.log(rows);
          res.json(1);
        });
      }
    });

    db.challenges.findOne({$and : [{_id : ObjectId(data._id)}, {status : 2}]})
    .exec(function(err, rows){
      if(err) throw err;
      if(rows){
        var result = compareChallenge(rows.score, rows.rivalScore);
        var template1 = "Ban da chien thang";
        var template2 = "Ban da bi danh bai";

        if(result){
          //thach dau thang
          notiFacebook(rows.rivalID, template2);
          notiFacebook(rows.fid, template1);
        }else{
          //bi thach dau thang
          notiFacebook(rows.fid, template2);
          notiFacebook(rows.rivalID, template1);
        }
      }
    });
  };

  module.exports.respon = function(req, res){
    //xu ly j day
    //action 1: huy tran dau
    //action 2: tu choi tham gia
    var params = req.body;
    console.log(params);

    switch(parseInt(params.action)){
      case 1:
        db.challenges.update({_id : ObjectId(params._id)},{$set : {"status" : 3}}).exec(function(err, rows){
          if(err) throw err;
          console.log(rows);
        });
        break;
      case 2:
        db.challenges.update({_id : ObjectId(params._id)},{$set : {"status" : 2}}).exec(function(err, rows){
          if(err) throw err;
          console.log(rows);
        });
        break;
    }

    res.json(1);
  };

  module.exports.random = function(req, res){
    var session_user = req.session.user;

    N = db.users.count();
    db.users.find({"fid" : {$ne : session_user.id}}).limit(1).skip(Math.floor(Math.random()*N))
    .exec(function(err, rows){
      if(err) throw err;
      return res.json(rows[0].fid);
    });
  };

  function randomRival(fid, callback){
    var N = db.users.count();
    db.users.find({"fid" : {$ne : fid}}).limit(1).skip(Math.floor(Math.random()*N))
    .exec(function(err, rows){
      if(err) throw err;
      callback(rows[0].fid);
    });
  }

  function notiFacebook(fid, template){
    var params = {
      "href" : "pianoic.com",
      "template" : template
    };
    
    facebook.api('/'+fid+'/notifications', 'POST',params, function(err, data){
      console.log("facebook notification: "+data);
      console.log("facebook notification: "+err);
    });

  }

  function compareChallenge(params1, params2){
    var n = params1.length;
    var m = 0;
    for(var i= 0; i < n; i++){
      params1[i] > params2[i] ? m++ : m--;
    }

    var res;
    m > 0 ? res = true : res = false;
    return res;
  }

  function random3(arr){
    var n = 3;
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
  }

  function randomLevel(){
    var level = Math.floor((Math.random()*3));
    return level;
  }
}).call(this);