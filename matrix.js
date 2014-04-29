var express = require('express');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  database: 'matrix',
  user: 'root',
  password: 'root'
});
app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(cookieParser());
app.use(session({secret: 'gggunit', key: 'sid'}));
app.use(express.static(__dirname + '/app'));

var datastore = {
  username: 'testuser',
  password: 'testpassword'
};

app.get('/', function(req, res) {
  res.status(200).sendfile('index.html');
});

// User authentication
app.post('/api/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  connection.query('INSERT INTO user SET ?', {
    username: username,
    password: password
  }, function(err, result) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    req.session.authenticated = true;
    req.session.user_id = result.insertId;
    res.json(200, {success: 'win'});
  });
});

app.get('/api/authen', function(req, res) {
  if (req.session.authenticated) {
    res.json(200, {success: 'win'});
    return;
  }
  res.json(404, {error: 'fail'});
});

app.post('/api/login', function(req, res) {
  if (req.session.authenticated) {
    res.json(200, {success: 'win'});
    return;
  }
  var username = req.body.username;
  var password = req.body.password;
  connection.query('SELECT * FROM user WHERE ? AND ?',
    [{
      username: username
    }, {
      password: password
    }], function(err, rows) {
    if (err || !rows.length) {
      res.json(404, {error: 'fail'});
      return;
    }
    req.session.authenticated = true;
    req.session.user_id = rows[0].id;
    res.json(200, {success: 'win'});
  });
});

app.post('/api/logout', function(req, res) {
  req.session.destroy();
  res.json(200, {success: 'destroyed'});
});

// Create file
app.post('/api/files', function(req, res) {
  /*var newFile = {
      id: 3,
      title: "Untitled",
      content: "",
      created: "4 days ago",
      modified: "yesterday",
      published: false,
      labels: []
    };*/
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  connection.query('INSERT INTO file SET ?, date_created = NOW()', {
    title: "Untitled",
    user_id: req.session.user_id
  }, function(err, result) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, {id: result.insertId});
  });
});

// Query files
app.get('/api/files', function(req, res) {
  var file1 = {
    id: 1,
    title: "First restful get",
    content: "nothing to see here!",
    created: "yesterday",
    modified: "today",
    published: false,
    labels: []
  };
  var file2 = {
    id: 2,
    title: "First restful get",
    title: "The tao that can be named is not the eternal tao",
    content: "nothing to see here!",
    created: "4 days ago",
    modified: "yesterday",
    published: false,
    labels: []
  };
  res.json(200, [file1, file2]);
});

// Get file
app.get('/api/files/:id', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  // Get file by user
  connection.query('SELECT * FROM file WHERE ? AND ?',
    [{
      id: req.params.id
    }, {
      user_id: req.session.user_id
    }], function(err, rows) {
    if (err || !rows.length) {
      res.json(404, {error: 'fail'});
      return;
    }
    var fileResult = rows[0];
    // Get file labels
    var sql = 'SELECT id, title AS name ' +
      'FROM file_label AS a ' +
      'JOIN label AS b ON ' +
      'a.label_id = b.id ' +
      'WHERE a.file_id = ?';
    connection.query(sql, [fileResult.id], function(err, rows) {
      if (err) {
        res.json(404, {error: 'fail'});
        return;
      }
      // Add labels to result
      fileResult.labels = rows;
      res.json(200, fileResult);
    });
  });
});

// Update file
app.put('/api/files/:id', function(req, res) {
  res.send(200, "Update file");
});

// Delete file
app.del('/api/files/:id', function(req, res) {
  res.send(200, "Delete file");
});

// Create label
app.post('/api/labels', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
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
app.get('/api/labels', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  var sql = 'SELECT id, title AS name, description' +
    ' FROM label WHERE user_id = ?';
  connection.query(sql, [req.session.user_id], function(err, rows) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, rows);
  });

});

app.listen(app.get('port'));
