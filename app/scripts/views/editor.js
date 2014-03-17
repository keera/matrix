"use strict"

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var Markdown = require("markdown");
  var Mousetrap = require("mousetrap");
  var editTemplate = require("text!templates/edit-view.html");

  var Editor = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(editTemplate),

    initialize: function() {
      Mousetrap.bind('mod+s', _.bind(this.save, this));
    },

    events: {
      "click button[name='preview']": "preview"
    },

    preview: function() {
      var previewEl = this.$("#editing-preview");
      var textareaEl = this.$("textarea");
      previewEl.html(Markdown.toHTML(textareaEl.val()));
    },

    save: function(e) {
      e.preventDefault();
      console.log("Saving");
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return Editor;
});

