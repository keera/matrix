var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
  res.status(200).sendfile('index.html');
});

// Create file
app.post('/api/files', function(req, res) {
  var newFile = {
      id: 3,
      title: "Untitled",
      content: "",
      created: "4 days ago",
      modified: "yesterday",
      published: false,
      labels: []
    };
  res.json(200, newFile);
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
  var newFile = {
    id: 3,
    title: "Untitled new file",
    content: "",
    created: "4 days ago",
    modified: "yesterday",
    published: false,
    labels: []
  };
  res.json(200, newFile);
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
  res.send(200, "Create label");
});

// Query labels
app.get('/api/labels', function(req, res) {
  res.json(200, [
    {
      name: "algorithms",
      description: ""
    },
    {
      name: "restful",
      description: ""
    }
  ]);
});

app.listen(app.get('port'));
