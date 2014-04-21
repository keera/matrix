define([
  "backbone"
], function(Backbone) {
  var currSession = null;
  var Session = Backbone.Model.extend({

    isAuthenticated: function(cb) {
      return false;
    },

    login: function() {
      console.log("Logging in");
    },

    logout: function() {
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

