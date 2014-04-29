"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "text!templates/file-view.html"
], function(Backbone, _, Handlebars, fileTemplate) {

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

