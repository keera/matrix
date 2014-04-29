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
      "click #login-modal #login": "login",
      "click #signup-modal #signup": "signup"
    },

    signup: function() {
      var username = this.$('#signup-modal .username').val();
      var password = this.$('#signup-modal .password').val();
      var options = {
        success: function() {
          window.location = "http://localhost:3000";
        },
        failure: function() {
          alert("Failed signup");
        }
      };
      session.signup(username, password, options);
    },

    login: function() {
      var username = this.$('#login-modal .username').val();
      var password = this.$('#login-modal .password').val();
      var options = {
        success: function() {
          window.location = "http://localhost:3000";
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

