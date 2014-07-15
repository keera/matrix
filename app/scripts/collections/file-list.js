define([
  "backbone",
  "jquery",
  "models/file",
  "models/session"
], function(Backbone, $, fileModel, session) {

  session = session.getSession();

  var Filelist = Backbone.Collection.extend({

    model: fileModel,

    url: session.getBaseUrl() + "/api/files/all",

    initialize: function() {
      // Set default sort
      this.sortByDateModified();
    },

    fetchAll: function(callback) {
      this.url = session.getBaseUrl() + "/api/files/all";
      this.fetch({
        reset: true,
        success: function() {
          callback();
        }
      });
    },

    fetchByLabel: function(data, callback) {
      this.url = session.getBaseUrl() + "/api/files?" + $.param(data);
      this.fetch({
        reset: true,
        success: function() {
          callback();
        }
      });
    },

    sortByDateModified: function() {
      this.comparator = function(a, b) {
        var dateA = Date.parse(a.get("date_modified"));
        var dateB = Date.parse(b.get("date_modified"));
        if (dateA < dateB) {
          return 1;
        } else if (dateA > dateB) {
          return -1;
        }
        return 0;
      }
      this.sort();
    }
  });

  return Filelist;
});
