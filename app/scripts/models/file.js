define([
  "backbone"
], function(Backbone) {
  var File = Backbone.Model.extend({
    defaults: {
      title: "untitled",
      content: "nothing to see here!",
      created: "today",
      modified: "2 days ago",
      published: false,
      labels: []
    }
  });

  return File;
});
