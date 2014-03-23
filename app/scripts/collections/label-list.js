define([
  "backbone",
  "models/label"
], function(Backbone, labelModel) {
  var Labellist = Backbone.Collection.extend({
    model: labelModel
  });

  return Labellist;
});
