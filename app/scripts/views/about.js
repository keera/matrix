"use strict";

define([
  "backbone",
  "handlebars",
  "text!templates/about-view.html",
  "models/session",
  "models/user"
], function(Backbone, Handlebars, aboutTemplate, session,
  userValidation) {

  session = session.getSession();

  var About = Backbone.View.extend({

    el: "#content",

    template: Handlebars.compile(aboutTemplate),

    events: {
      "click #dashboard-sidebar a": "updateFilelist",
      "click #login-modal #login": "login",
      "keydown": "login",
      "click #signup-modal #signup": "signup"
    },

    initialize: function() {
      this.userValidation = new userValidation();
      this.userValidation.addRules("signup", {
        "username": {
          "rule": "not empty",
          "id": "signup-username-field"
        },
        "password": {
          "rule": "not empty",
          "id": "signup-password-field"
        }
      });
      this.userValidation.addRules("login", {
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
      var username = this.$("#signup-modal .username").val();
      var password = this.$("#signup-modal .password").val();
      var notificationEl = this.$("#signup-notification");
      if (this.userValidation.isValid("signup", {
        "username": username,
        "password": password
      })) {
        var options = {
          success: function(msg) {
            window.location = session.getBaseUrl();
          },
          failure: function(msg) {
            notificationEl.text(msg).slideDown();
            setTimeout(function() {
              notificationEl.slideUp();
            }, 3000);
          }
        };
        session.signup(username, password, options);
      }
    },

    login: function(e) {
      if (e.keyCode && e.keyCode != "13") {
          return;
      }
      var username = this.$("#login-modal .username").val();
      var password = this.$("#login-modal .password").val();
      var notificationEl = this.$("#login-notification");
      if (this.userValidation.isValid("login", {
        "username": username,
        "password": password
      })) {
        var options = {
          success: function(msg) {
            window.location = session.getBaseUrl();
          },
          failure: function(msg) {
            notificationEl.text(msg).slideDown();
            setTimeout(function() {
              notificationEl.slideUp();
            }, 3000);
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

