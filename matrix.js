var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
  res.status(200).sendfile('index.html');
});

app.listen(app.get('port'));
