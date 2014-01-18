(function() {
 
  module.exports = function(req, res) {
    return db.admins.find(function(err, data) {
      if (!err) {
        return res.json(data);
      } else {
        return res.send('Could not connect to the database');
      }
    });
  };

  
 }).call(this);