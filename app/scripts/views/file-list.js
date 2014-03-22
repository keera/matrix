"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var filelistTemplate = require("text!templates/file-list-view.html");

  var Filelist = Backbone.View.extend({
    el: "#file-list",

    template: Handlebars.compile(filelistTemplate),

    initialize: function() {
    },

    events: {
    },

    render: function() {
      this.$el.html(this.template({files: this.collection.models.map(function(model) {
        return model.attributes;
      })}));
      return this;
    }
  });

  return Filelist;
});

