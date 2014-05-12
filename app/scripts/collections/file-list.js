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

    fetchAll: function() {
      this.url = session.getBaseUrl() + "/api/files/all"
      this.fetch({reset: true});
    },

    fetchByLabel: function(data) {
      this.url = session.getBaseUrl() + "/api/files?" + $.param(data);
      this.fetch({reset: true});
    }
  });

  return Filelist;
});
