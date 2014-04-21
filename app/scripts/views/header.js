"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var $ = require("jquery");
  var Handlebars = require("handlebars");
  var fileModel = require("models/file");
  var headerTemplate = require("text!templates/nav-view.html");

  var Header = Backbone.View.extend({
    el: "#main-nav",

    template: Handlebars.compile(headerTemplate),

    events: {
      "click .new-file": "newFile",
      "click .new-label": "newLabel",
      "click .about": "updateAbout"
    },

    newFile: function() {
      var file = new fileModel();
      file.save({},{
        success: function(model, response, options) {
          var modelId = model.get("id");
          window.open("#file/" + modelId + "/edit", "_blank");
        }
      });
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
      this.$el.html(this.template());
      return this;
    }
  });

  return Header;
});

