var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var crypto = require('crypto');
var file = require('./models/file');
var async = require("async");
var markdown = require("markdown").markdown;
var handlebars = require("handlebars");
var mysql = require('mysql');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(cookieParser());
app.use(session({secret: 'gunit', key: 'sid'}));
app.use('/admin', express.static(__dirname + '/app'));

// Setup
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'matrix',
  user: 'root',
  password: 'root'
});

handlebars.registerHelper("markdown", function(content) {
  content = content || "";
  return markdown.toHTML(content);
});

var genSha1Hash = function(val) {
  return crypto.createHash('sha1').update(val).digest('hex');
}

app.all("/admin/api/*", function(req, res, next) {
  if (!req.session.authenticated) {
      res.json(404, {msg: 'You need to be logged in'});
      return;
  }
  next();
});
// Blog archive
app.get('/', function(req, res) {
  fs.readFile(__dirname + "/blog/templates/archive.html","utf8", function (err, data) {
    if (err) throw err;
    var template = handlebars.compile(data);
    connection.query('SELECT * FROM file WHERE ? AND ? ORDER BY date_created DESC',
      [{
        is_published: true
      }, {
        user_id: 13
      }], function(err, rows) {
        var result = template({files: rows});
        res.status(200).send(result);
    });
  });
});

// File
app.get('/file/:id', function(req, res) {
  if (req.session.authenticated) {
    res.redirect("/admin/#file/" + req.params.id + "/view");
    return;
  }
  fs.readFile(__dirname + "/blog/templates/file.html", "utf8", function (err, data) {
    if (err) throw err;
    var template = handlebars.compile(data);
    connection.query('SELECT * FROM file WHERE ? AND ? AND ?',
      [{
        id: req.params.id
      }, {
        is_published: true
      }, {
        user_id: 13
      }], function(err, rows) {
        if (rows.length < 1) {
          res.status(404).send("Nothing to see here :)");
          return;
        }
        res.status(200).send(template(rows[0]));
    });
  });
});

app.get('/admin', function(req, res) {
  res.sendfile(__dirname + "/app/index.html");
});

// User authentication
app.post('/admin/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Check if exists first
  if (username.length < 1 || password.length < 1) {
    res.json(400, {msg: 'Invalid username or password'});
    return;
  }

  connection.query('SELECT * FROM user WHERE username = ?',
    [username], function(err, rows) {
    if (err) {
      res.json(400, {msg: 'Signup failed'});
      return;
    }
    if (rows.length > 0) {
      res.json(400, {msg: 'Username exists'});
      return;
    }
    connection.query('INSERT INTO user SET ?', {
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
});

app.get('/admin/authen', function(req, res) {
  if (req.session.authenticated) {
    res.json(200, {msg: 'win'});
    return;
  }
  res.json(400, {msg: 'fail'});
});

app.post('/admin/login', function(req, res) {
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
  connection.query('SELECT * FROM user WHERE ? AND ?',
    [{
      username: username
    }, {
      password: genSha1Hash(password)
    }], function(err, rows) {
    if (err || !rows.length) {
      res.json(400, {msg: 'Invalid username or password'});
      return;
    }
    req.session.authenticated = true;
    req.session.user_id = rows[0].id;
    res.json(200, {msg: 'win'});
  });
});

app.post('/admin/logout', function(req, res) {
  req.session.destroy();
  res.json(200, {success: 'destroyed'});
});

// Create file
app.post('/admin/api/files', function(req, res) {
  file.create(req, res, connection);
});

// Query all files
app.get('/admin/api/files/all', function(req, res) {
  file.findAll(req, res, connection);
});

// Query files
app.get('/admin/api/files', function(req, res) {
  file.findByLabel(req, res, connection);
});

app.get('/admin/api/files/search', function(req, res) {
  file.findByTitle(req, res, connection);
});

// Get file
app.get('/admin/api/files/:id', function(req, res) {
  file.findById(req, res, connection);
});

// Update file
app.put('/admin/api/files/:id', function(req, res) {
  file.update(req, res, connection);
});

// Delete file
app.del('/admin/api/files/:id', function(req, res) {
  file.remove(req, res, connection);
});

// Create label
app.post('/admin/api/labels', function(req, res) {
  var title = req.body.name;
  var description = req.body.description;
  connection.query('INSERT INTO label SET ?, date_created = NOW()', {
    title: title,
    description: description,
    user_id: req.session.user_id
  }, function(err, result) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, {success: 'win'});
  });
});

// Query labels
app.get('/admin/api/labels', function(req, res) {
  // TODO: Refactor
  if (!req.query.q) {
    req.query.q = "";
  }
  var sql = 'SELECT id, title AS name, description' +
    ' FROM label WHERE user_id = ? AND title LIKE ?';
  connection.query(sql, [req.session.user_id, "%" + req.query.q + "%"],
    function(err, rows) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, rows);
  });

});

app.listen(app.get('port'));
