var express = require('express');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var async = require("async");
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

app.get('/', function(req, res) {
  res.status(200).sendfile('index.html');
});

// User authentication
app.post('/api/signup', function(req, res) {
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
      password: password
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
  if (username.length < 1 || password.length < 1) {
    res.json(400, {msg: 'Invalid username or password'});
    return;
  }
  connection.query('SELECT * FROM user WHERE ? AND ?',
    [{
      username: username
    }, {
      password: password
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
  connection.query('INSERT INTO file SET ?, date_created = NOW(), date_modified = NOW()', {
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

var getFileLabels = function(req, res, rows) {
  var labelQueries = [];
  var getLabelQueryClosure = function(file) {
    return function(callback) {
      var sql = 'SELECT id, title AS name ' +
        'FROM file_label AS a ' +
        'JOIN label AS b ON ' +
        'a.label_id = b.id ' +
        'WHERE a.file_id = ?';
      connection.query(sql, [file.id], function(err, rows) {
        if (err) {
          res.json(404, {error: 'fail'});
          return;
        }
        // Add labels to file
        file.labels = rows;
        callback(null, file);
      });
    };
  };
  for (var i = 0; i < rows.length; i++) {
    labelQueries.push(getLabelQueryClosure(rows[i]));
  };
  async.parallel(labelQueries, function(err, results) {
    res.json(200, rows);
  });
};

// Query all files
app.get('/api/files/all', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  var allQuery = 'SELECT * FROM file WHERE user_id = ?';
  connection.query(allQuery,
    [req.session.user_id], function(err, rows) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    getFileLabels(req, res, rows);
  });
});

// Query files
app.get('/api/files', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  var label = req.query.label_id;
  var labelSpecific = "SELECT * FROM file AS a " +
    "JOIN file_label AS b " +
    "ON a.id = b.file_id " +
    "WHERE a.user_id = ? AND b.label_id = ?;"
  connection.query(labelSpecific,
    [req.session.user_id, label], function(err, rows) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    getFileLabels(req, res, rows);
  });
});

app.get('/api/files/search', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  connection.query('SELECT * FROM file WHERE title LIKE ? AND user_id = ?',
    ["%" + req.query.q + "%", req.session.user_id], function(err, rows) {
    if (err) {
      res.json(404, {error: 'fail'});
      return;
    }
    res.json(200, rows);
  });
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
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }

  var fileId = req.body.id;
  var title = req.body.title;
  var content = req.body.content;
  var isPublished = req.body.is_published;
  var addLabels = req.body.add_labels || [];
  var deleteLabels = req.body.delete_labels || [];

  connection.beginTransaction(function(err) {
    if (err) {
      throw err;
    }
    // Update the file
    var sql = 'UPDATE file SET ? , date_modified = NOW() WHERE ? AND ?';
    connection.query(sql, [{
      title: title,
      content: content,
      is_published: isPublished
    }, {
      id: fileId
    }, {
      user_id: req.session.user_id
    }], function(err, result) {
      if (err) {
        connection.rollback(function() {
          throw err;
        });
      }
      // Update labels
      async.parallel([
        // Add labels
        function(callback) {
          // If nothing to add
          if (!addLabels.length) {
            callback(null, false);
            return;
          }
          var bulkInsertData = addLabels.map(function(val) {
            return [fileId, val];
          });
          var sql = 'INSERT INTO file_label (file_id, label_id) VALUES ?';
          connection.query(sql, [bulkInsertData], function(err, result) {
            if (err) {
              connection.rollback(function() {
                throw err;
              });
            }
            callback(null, true);
          });
        },
        // Delete labels
        function(callback) {
          if (!deleteLabels.length) {
            callback(null, false);
            return;
          }
          var sql = "DELETE FROM file_label WHERE file_id = ? AND label_id IN ?";
          var lol = connection.query(sql, [fileId, [deleteLabels]], function(err, result) {
            if (err) {
              connection.rollback(function() {
                throw err;
              });
            }
            callback(null, true);
          });
        }
      ], function(err, results) {
        console.log(results);
        connection.commit(function(err) {
          if (err) {
            connection.rollback(function() {
              throw err;
            });
          }
          res.json(200, {success: 'win'});
        });
      });
    });
  });
});

// Delete file
app.del('/api/files/:id', function(req, res) {
  if (!req.session.authenticated) {
      res.json(404, {error: 'fail'});
      return;
  }
  var fileId = req.params.id;
  connection.query("DELETE FROM file WHERE id = ? AND user_id = ?",
  [fileId, req.session.user_id], function(err, result) {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.json(200, "Delete file");
    } else {
      res.json(404, "Failed to delete");
    }
  });
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
  // TODO: Refactor
  if (!req.query.q) {
    req.query.q = "";
  }
  var sql = 'SELECT id, title AS name, description' +
    ' FROM label WHERE user_id = ? AND title LIKE ? LIMIT 5';
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
