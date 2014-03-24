"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var $ = require("jquery");

  var Header = Backbone.View.extend({
    el: "#main-nav",

    initialize: function() {
    },

    events: {
      "click .new-file": "newFile",
      "click .new-label": "newLabel",
      "click .about": "updateAbout"
    },

    newFile: function() {
      // Create new file on server
      window.open("#file/5/edit", "_blank");
    },

    updateNav: function(current) {
      $('.navbar-nav li')
        .removeClass('active')
        .filter(function() {
          return $(this).children().attr('class') == current;
        })
        .addClass('active');
    },

    updateAbout: function() {
      this.updateNav("about");
    },

    newLabel: function() {
      $("#new-label-modal").modal("show");
    },

    createLabel: function() {
      // Grab info, validate
      // save and close modal
    },

    render: function() {
      return this;
    }
  });

  return Header;
});

