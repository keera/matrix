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
      Mousetrap.bind('mod+c', _.bind(this.formatCode, this));
      Mousetrap.bind('mod+b', _.bind(this.boldText, this));
      Mousetrap.bind('mod+l', _.bind(this.linkText, this));
    },

    events: {
      "click button[name='preview']": "preview"
    },

    replaceText: function(sStartTag, sEndTag) {
      var bDouble = arguments.length > 1,
        oMsgInput = this.$("textarea")[0],
        nSelStart = oMsgInput.selectionStart,
        nSelEnd = oMsgInput.selectionEnd,
        sOldText = oMsgInput.value,
        sHighlightedText = sOldText.substring(nSelStart, nSelEnd);
      // Add corresponding spaces
      if (sStartTag === "    ") {
        sStartTag = "";
        sHighlightedText = sHighlightedText.split("\n").map(function(line) {
          return "    " + line;
        }).join("\n");
      }
      oMsgInput.value = sOldText.substring(0, nSelStart) +
        (bDouble ? sStartTag + sHighlightedText +
        sEndTag : sStartTag + sHighlightedText) + sOldText.substring(nSelEnd);
      oMsgInput.setSelectionRange(bDouble || nSelStart === nSelEnd ?
        nSelStart + sStartTag.length :
        nSelStart, (bDouble ? nSelEnd : nSelStart) + sStartTag.length);
      oMsgInput.focus();
    },

    formatCode: function(e) {
      e.preventDefault();
      this.replaceText("    ");
    },

    boldText: function(e) {
      e.preventDefault();
      this.replaceText("**", "**");
    },

    linkText: function(e) {
      e.preventDefault();
      console.log("linking text");
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

