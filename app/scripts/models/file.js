define([
  "backbone"
], function(Backbone) {
  var File = Backbone.Model.extend({
    defaults: {
      title: "untitled",
      content: "nothing to see here!",
      date_created: "today",
      date_modified: "2 days ago",
      is_published: false,
      labels: [],
    },

    togglePublish: function() {
      this.save({
        "is_published": (this.get("is_published")) ? false : true
      }, {
        wait: true
      });
    },

    urlRoot: "/api/files",
  });

  return File;
});
