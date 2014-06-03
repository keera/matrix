"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "markdown",
  "text!templates/file-view.html"
], function(Backbone, _, Handlebars, Markdown, fileTemplate) {

  var File = Backbone.View.extend({

    el: "#content",

    template: Handlebars.compile(fileTemplate),

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.model.fetch();
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

