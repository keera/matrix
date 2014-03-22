define([
  "backbone",
  "models/file"
], function(Backbone, fileModel) {
  var Filelist = Backbone.Collection.extend({
    model: fileModel
  });

  return Filelist;
});
