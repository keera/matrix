var crypto = require('crypto');

var genSha1Hash = function(val) {
  return crypto.createHash('sha1').update(val).digest('hex');
};

var signup = function(req, res, conn) {
  var username = req.body.username;
  var password = req.body.password;
  // Check if exists first
  if (username.length < 1 || password.length < 1) {
    res.json(400, {msg: 'Invalid username or password'});
    return;
  }
  var sql = 'SELECT * FROM user WHERE username = ?';
  conn.query(sql, [username], function(err, rows) {
    if (err) {
      res.json(400, {msg: 'Signup failed'});
      return;
    }
    if (rows.length > 0) {
      res.json(400, {msg: 'Username exists'});
      return;
    }
    conn.query('INSERT INTO user SET ?', {
      username: username,
      password: genSha1Hash(password)
    }, function(err, result) {
      if (err) {
        res.json(400, {msg: 'Signup failed'});
        return;
      }
      req.session.authenticated = true;
      req.session.user_id = result.insertId;
      res.json(200, {msg: 'win'});
    });
  });
};

var authenticate = function(req, res, conn) {
  if (req.session.authenticated) {
    res.json(200, {msg: 'win'});
    return;
  }
  res.json(400, {msg: 'fail'});
};

var login = function(req, res, conn) {
  if (req.session.authenticated) {
    res.json(200, {msg: 'win'});
    return;
  }
  var username = req.body.username;
  var password = req.body.password;
  if (username.length < 1 || password.length < 1) {
    res.json(400, {msg: 'Invalid username or password'});
    return;
  }
  var sql = 'SELECT * FROM user WHERE ? AND ?';
  var args = [
    {username: username},
    {password: genSha1Hash(password)}
  ];
  conn.query('SELECT * FROM user WHERE ? AND ?', args, function(err, rows) {
    if (err || !rows.length) {
      res.json(400, {msg: 'Invalid username or password'});
      return;
    }
    req.session.authenticated = true;
    req.session.user_id = rows[0].id;
    res.json(200, {msg: 'win'});
  });
};

var logout = function(req, res, conn) {
  req.session.destroy();
  res.json(200, {success: 'destroyed'});
};

exports.authenticate = authenticate;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
