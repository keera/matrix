define([
  "backbone",
  "models/session"
], function(Backbone, session) {

  session = session.getSession();

  var Label = Backbone.Model.extend({
    defaults: {
      name: "",
      description: ""
    },

    urlRoot: session.getBaseUrl() + "/api/labels"
  });

  return Label;
});
