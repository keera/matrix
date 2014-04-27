var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('label', {
    'id': {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    'title': {
      type: 'string',
      length: 25
    },
    'description': {
      type: 'string',
      length: 255
    },
    'date_created': {
      type: 'datetime'
    },
    'date_modified': {
      type: 'datetime'
    },
    'user_id': {
      type: 'int'
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('label', {
    ifExists: true
  }, callback);
};
