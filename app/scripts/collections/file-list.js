define([
  "backbone",
  "models/file"
], function(Backbone, fileModel) {
  var Filelist = Backbone.Collection.extend({
    model: fileModel,
    url: "/api/files"
  });

  return Filelist;
});
