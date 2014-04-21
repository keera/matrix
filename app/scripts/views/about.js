"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var aboutTemplate = require("text!templates/about-view.html");

  var About = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(aboutTemplate),

    events: {
      "click #dashboard-sidebar a": "updateFilelist"
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return About;
});

