define([
  "backbone",
  "jquery"
], function(Backbone, $) {
  var currSession = null;
  var Session = Backbone.Model.extend({

    // Authen user
    authenticate: function(cb) {
      $.ajax("http://localhost:3000/api/authen", {
          success: function() {
            cb.success();
          },
          error: function() {
            cb.failure();
          }
        }
      );
    },

    isAuthenticated: function(cb) {
      return false;
    },

    login: function(username, password, cb) {
      $.ajax("http://localhost:3000/api/login", {
          type: "POST",
          data: {
            username: username,
            password: password
          },
          success: function() {
            cb.success();
          },
          error: function() {
            cb.failure();
          }
        }
      );
    },

    logout: function(cb) {
      console.log("Logging out");
    }

  });

  return {
    getSession: function() {
      if (!currSession) {
        currSession = new Session();
      }
      return currSession;
    },
  };
})

