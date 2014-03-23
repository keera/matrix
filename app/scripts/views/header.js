"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");

  var Header = Backbone.View.extend({
    el: "#main-nav",

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
      return this;
    }
  });

  return Header;
});

