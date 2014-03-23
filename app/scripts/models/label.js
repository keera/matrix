define([
  "backbone"
], function(Backbone) {
  var Label = Backbone.Model.extend({
    defaults: {
      name: "",
      description: ""
    }
  });

  return Label;
});
