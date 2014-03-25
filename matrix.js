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
  res.send(200, "Create file");
});

// Query files
app.get('/api/files', function(req, res) {
  res.send(200, "Query file");
});

// Get file
app.get('/api/file/:id', function(req, res) {
  res.send(200, "Get file");
});

// Update file
app.put('/api/file/:id', function(req, res) {
  res.send(200, "Update file");
});

// Delete file
app.del('/api/file/:id', function(req, res) {
  res.send(200, "Delete file");
});

// Create label
app.post('/api/labels', function(req, res) {
  res.send(200, "Create label");
});

// Query labels
app.get('/api/labels', function(req, res) {
  res.send(200, "Query labels");
});

app.listen(app.get('port'));
