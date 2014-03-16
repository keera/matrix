define([
  "backbone"
], function(Backbone) {
  var File = Backbone.Model.extend({
    defaults: {
      content: "nothing to see here!"
    }
  });

  return File;
});
