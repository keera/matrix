define([
  "backbone",
  "jquery"
], function(Backbone, $) {

  var User = Backbone.Model.extend({

    rules: {},

    addRules: function(form, rules) {
      this.rules[form] = rules;
    },

    isValid: function(form, attr) {
      var rules = this.rules[form];
      var hasError = false;
      for (var field in rules) {
        var inputVal = attr[field];
        var key = rules[field].id;
        if (inputVal.length < 1) {
          hasError = true;
          $("#" + key).text(field + " cannot be empty");
        } else {
          $("#" + key).text("");
        }
      }
      return !hasError;
    },

  });

  return User;
});

