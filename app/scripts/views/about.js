"use strict";

define([
  "backbone",
  "handlebars",
  "text!templates/about-view.html",
  "models/session",
  "models/user"
], function(Backbone, Handlebars, aboutTemplate, session,
  user) {

  session = session.getSession();

  var About = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(aboutTemplate),

    events: {
      "click #dashboard-sidebar a": "updateFilelist",
      "click #login-modal #login": "login",
      "click #signup-modal #signup": "signup"
    },

    initialize: function() {
      this.signupValidation = new user();
      this.loginValidation = new user();
      this.signupValidation.setupValidation({
        "username": {
          "rule": "not empty",
          "id": "signup-username-field"
        },
        "password": {
          "rule": "not empty",
          "id": "signup-password-field"
        }
      });
      this.loginValidation.setupValidation({
        "username": {
          "rule": "not empty",
          "id": "login-username-field"
        },
        "password": {
          "rule": "not empty",
          "id": "login-password-field"
        }
      });
    },

    signup: function() {
      var username = this.$('#signup-modal .username').val();
      var password = this.$('#signup-modal .password').val();
      if (this.signupValidation.isValid({
        "username": username,
        "password": password
      })) {
        var options = {
          success: function() {
            window.location = "http://localhost:3000";
          },
          failure: function() {
            alert("Failed signup");
          }
        };
        session.signup(username, password, options);
      }
    },

    login: function() {
      var username = this.$('#login-modal .username').val();
      var password = this.$('#login-modal .password').val();
      if (this.loginValidation.isValid({
        "username": username,
        "password": password
      })) {
        var options = {
          success: function() {
            window.location = "http://localhost:3000";
          },
          failure: function() {
            alert("failed login");
          }
        };
        session.login(username, password, options);
      }
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  return About;
});

