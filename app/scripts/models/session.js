define([
  "backbone",
  "jquery"
], function(Backbone, $) {
  // Session singleton
  var currSession = null;

  var Session = Backbone.Model.extend({

    isLoggedin: false,

    baseUrl: "http://localhost:3000/admin",

    blogUrl: "http://localhost:3000",

    signup: function(username, password, cb) {
      $.ajax(this.baseUrl + "/signup", {
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
      $.ajax(this.baseUrl + "/authen", {
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

    getBaseUrl: function() {
      return this.baseUrl;
    },

    getBlogUrl: function() {
      return this.blogUrl;
    },

    isAuthenticated: function(cb) {
      return this.isLoggedin;
    },

    login: function(username, password, cb) {
      $.ajax(this.baseUrl + "/login", {
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
      $.ajax(this.baseUrl + "/logout", {
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

