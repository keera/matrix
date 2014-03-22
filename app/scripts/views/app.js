"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");

  var App = Backbone.View.extend({
    el: "#app",

    initialize: function() {
    },

    events: {
      "click .new-file": "newFile"
    },

    newFile: function() {
      // Create new file on server
      // On success, navigate to edit page with correct url
      console.log("Creating a new file");
    },

    render: function() {
      return this;
    }
  });

  return App;
});

