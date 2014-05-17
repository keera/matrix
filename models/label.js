// Create label
var create = function(req, res, conn) {
  var title = req.body.name;
  var description = req.body.description;
  var sql = 'INSERT INTO label SET ?, date_created = NOW()';
  var args = {
    title: title,
    description: description,
    user_id: req.session.user_id
  };
  conn.query(sql, args, function(err, result) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, {success: 'win'});
  });
};

// Query labels
var find = function(req, res, conn) {
  // TODO: Refactor
  if (!req.query.q) {
    req.query.q = "";
  }
  var sql = 'SELECT id, title AS name, description' +
    ' FROM label WHERE user_id = ? AND title LIKE ?';
  var args = [
    req.session.user_id,
    "%" + req.query.q + "%"
  ];
  conn.query(sql, args, function(err, rows) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, rows);
  });
};

exports.create = create;
exports.find = find;
