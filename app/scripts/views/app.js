"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var dashboardView = require("views/dashboard");

  var App = Backbone.View.extend({
    el: "#app",

    initialize: function() {
    },

    events: {
      "click .new-file": "newFile"
    },

    newFile: function() {
      // Create new file on server
      window.open("#file/5/edit", "_blank");
    },

    render: function() {
      (new dashboardView()).render();
      return this;
    }
  });

  return App;
});

