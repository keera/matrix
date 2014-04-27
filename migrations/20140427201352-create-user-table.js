var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: 'string',
      length: 50
    },
    password: {
      type: 'string',
      length: 200
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user', {
    ifExists: true
  }, callback);
};
