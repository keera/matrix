"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var Handlebars = require("handlebars");
  var aboutTemplate = require("text!templates/about-view.html");
  var session = require("models/session").getSession();

  var About = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(aboutTemplate),

    events: {
      "click #dashboard-sidebar a": "updateFilelist",
      "click #login-modal button": "login"
    },

    login: function() {
      var username = this.$('#login-modal .username').val();
      var password = this.$('#login-modal .password').val();
      var options = {
        success: function() {
          alert("logged in");
        },
        failure: function() {
          alert("failed login");
        }
      };
      session.login(username, password, options);
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return About;
});

