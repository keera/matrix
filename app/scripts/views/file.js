"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "markdown",
  "text!templates/file-view.html"
], function(Backbone, _, Handlebars, Markdown, fileTemplate) {

  var File = Backbone.View.extend({

    template: Handlebars.compile(fileTemplate),

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      Handlebars.registerHelper("markdown", function(content) {
        return Markdown.toHTML(content);
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return File;
});

