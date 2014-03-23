"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var fileTemplate = require("text!templates/file-view.html");

  var File = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(fileTemplate),

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return File;
});

