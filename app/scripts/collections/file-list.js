define([
  "backbone",
  "jquery",
  "models/file"
], function(Backbone, $, fileModel) {
  var Filelist = Backbone.Collection.extend({

    model: fileModel,

    url: "/api/files/all",

    fetchAll: function() {
      this.url = "/api/files/all"
      this.fetch({reset: true});
    },

    fetchByLabel: function(data) {
      this.url = "/api/files?" + $.param(data);
      this.fetch({reset: true});
    }
  });

  return Filelist;
});
