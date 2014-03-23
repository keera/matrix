"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var filelistTemplate = require("text!templates/file-list-view.html");

  var Filelist = Backbone.View.extend({
    el: "#file-list",

    template: Handlebars.compile(filelistTemplate),

    render: function() {
      var models = this.collection.models;
      this.$el.html(this.template({
        files: _.map(models, function(model) {
          return model.attributes;
        })
      }));
      return this;
    }
  });

  return Filelist;
});

