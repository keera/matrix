define([
  "backbone"
], function(Backbone) {
  var File = Backbone.Model.extend({
    defaults: {
      title: "untitled",
      content: "nothing to see here!",
      labels: []
    }
  });

  return File;
});
