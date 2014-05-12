define([
  "backbone",
  "jquery"
], function(Backbone, $) {
  var currSession = null;
  var Session = Backbone.Model.extend({

    isLoggedin: false,

    signup: function(username, password, cb) {
      $.ajax("http://localhost:3000/api/signup", {
        type: "POST",
        data: {
          username: username,
          password: password
        },
        success: function(data, text) {
          cb.success(data.msg);
        },
        error: function(data, text) {
          cb.failure(data.responseJSON.msg);
        }
      });
    },
    // Authen user
    authenticate: function(cb) {
      var that = this;
      $.ajax("http://localhost:3000/api/authen", {
          success: function() {
            that.isLoggedin = true;
            cb.success();
          },
          error: function() {
            cb.failure();
          }
        }
      );
    },

    isAuthenticated: function(cb) {
      return this.isLoggedin;
    },

    login: function(username, password, cb) {
      $.ajax("http://localhost:3000/api/login", {
          type: "POST",
          data: {
            username: username,
            password: password
          },
          success: function(data) {
            console.log(data);
            cb.success(data.msg);
          },
          error: function(data) {
            cb.failure(data.responseJSON.msg);
          }
        }
      );
    },

    logout: function(cb) {
      $.ajax("http://localhost:3000/api/logout", {
          type: "POST",
          success: function() {
            cb.success();
          }
        }
      );
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

