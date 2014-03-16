"use strict"

define([
  "backbone",
  "handlebars",
  "markdown",
  "text!templates/edit-view.html"
], function(Backbone, Handlebars, markdown, editTemplate) {
  var Editor = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(editTemplate),

    events: {
      "click button[name='preview']": "preview"
    },

    preview: function() {
      var previewEl = this.$("#editing-preview");
      var textareaEl = this.$("textarea");
      previewEl.html(markdown.toHTML(textareaEl.val()));
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return Editor;
});

