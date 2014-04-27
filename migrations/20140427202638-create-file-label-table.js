var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('file_label', {
    'file_id': {
      type: 'int',
      primaryKey: true
    },
    'label_id': {
      type: 'int',
      primaryKey: true
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('file_label', {
    fileExists: true
  }, callback);
};
