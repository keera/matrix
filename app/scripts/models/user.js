define([
  "backbone",
  "jquery"
], function(Backbone, $) {
  var User = Backbone.Model.extend({

    rules: {},

    setupValidation: function(rules) {
      this.rules = rules;
    },

    isValid: function(attr) {
      var hasError = false;
      for (var field in this.rules) {
        var inputVal = attr[field];
        var key = this.rules[field].id;
        if (inputVal.length < 1) {
          hasError = true;
          $("#" + key).text("shit is empty bro");
        }
      }
      return !hasError;
    },

  });

  return User;
});

