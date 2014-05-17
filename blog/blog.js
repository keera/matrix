var fs = require('fs');
var markdown = require("markdown").markdown;
var handlebars = require("handlebars");

var defaultUserId = 13;
var blogPath = __dirname + "/templates";

handlebars.registerHelper("markdown", function(content) {
  content = content || "";
  return markdown.toHTML(content);
});

var index = function(req, res, conn) {
  fs.readFile(blogPath + "/archive.html","utf8", function (err, data) {
    if (err) throw err;
    var template = handlebars.compile(data);
    var sql = 'SELECT * FROM file ' +
     'WHERE ? AND ? ' +
     'ORDER BY date_created DESC';
    var args = [
      {is_published: true},
      {user_id: defaultUserId}
    ];
    conn.query(sql, args, function(err, rows) {
      var result = template({files: rows});
      res.status(200).send(result);
    });
  });
};

// File
var getFile = function(req, res, conn) {
  if (req.session.authenticated) {
    res.redirect("/admin/#file/" + req.params.id + "/view");
    return;
  }
  fs.readFile(blogPath + "/file.html", "utf8", function (err, data) {
    if (err) throw err;
    var template = handlebars.compile(data);
    var sql = 'SELECT * FROM file WHERE ? AND ? AND ?';
    var args = [
      {id: req.params.id},
      {is_published: true},
      {user_id: defaultUserId}
    ];
    conn.query(sql, args, function(err, rows) {
      if (rows.length < 1) {
        res.status(404).send("Nothing to see here :)");
        return;
      }
      res.status(200).send(template(rows[0]));
    });
  });
};

exports.index = index;
exports.getFile = getFile;
