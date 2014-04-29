"use strict"

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var Markdown = require("markdown");
  var Mousetrap = require("mousetrap");
  var Select2 = require("select2");
  var $ = require("jquery");
  var editTemplate = require("text!templates/edit-view.html");

  var Editor = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(editTemplate),

    initialize: function() {
      Mousetrap.bind('mod+s', _.bind(this.save, this));
      Mousetrap.bind('mod+c', _.bind(this.formatCode, this));
      Mousetrap.bind('mod+b', _.bind(this.boldText, this));
      Mousetrap.bind('mod+l', _.bind(this.linkText, this));
      this.listenTo(this.model, "change", this.render);
      this.model.fetch();
      this.previewOn = false;
    },

    postInitialize: function() {
      var format = function(item) {
        return item.name;
      };
      this.$('#labels').select2({
        multiple: true,
        width: "copy",
        ajax: {
          url: "api/labels",
          dataType: "json",
          data: function(term, page) {
            return {q: term}
          },
          results: function(data, page) {
            return {results: data, text:"name"};
          }
        },
        formatResult: format,
        formatSelection: format
      });
      // Set existing labels
      this.$('#labels').select2('data', this.model.get('labels'));
      this.$("#url").select2({
        ajax: {
          url: "http://api",
          dataType: "json",
          data: function(term, page) {
            return {q: term}
          },
          results: function(term, page) {
            return {results: term};
          }
        },
        formatSelection: format,
        formatResult: format
      });
      // select2 issue #1436
      $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    },

    events: {
      "click a.show-preview": "openPreview",
      "click a.hide-preview": "closePreview",
      "click #urlModal button": "hideModal",
      "keyup textarea": "preview",
      "click #save": "save"
    },

    replaceText: function(sStartTag, sEndTag, cb) {
      var oMsgInput = this.$("textarea")[0],
        nSelStart = oMsgInput.selectionStart,
        nSelEnd = oMsgInput.selectionEnd,
        sOldText = oMsgInput.value,
        sHighlightedText = sOldText.substring(nSelStart, nSelEnd);
      if (cb) {
        sHighlightedText = cb(sHighlightedText);
      }
      oMsgInput.value = sOldText.substring(0, nSelStart) +
        sStartTag + sHighlightedText + sEndTag +
        sOldText.substring(nSelEnd);
      oMsgInput.setSelectionRange(nSelStart + sStartTag.length,
        nSelEnd + sStartTag.length);
      oMsgInput.focus();
    },

    formatCode: function(e) {
      e.preventDefault();
      this.replaceText("", "", function(text) {
        return text.split("\n").map(function(line) {
          return "    " + line;
        }).join("\n");
      });
    },

    boldText: function(e) {
      e.preventDefault();
      this.replaceText("**", "**");
    },

    hideModal: function(e) {
      this.$('#urlModal').modal('hide');
    },

    linkText: function(e) {
      e.preventDefault();
      var that = this;
      this.$('#urlModal')
        .modal('show')
        .one('hidden.bs.modal', function (e) {
        that.replaceText("[","](" + that.$("#url").val() + ")");
      });
    },

    openPreview: function() {
      this.previewOn = true;
      this.preview();
    },

    preview: function() {
      if (!this.previewOn) return;
      var previewEl = this.$("#editing-preview");
      var previewContentEl = previewEl.find(".panel-body");
      var textareaEl = this.$("textarea");
      previewContentEl.html(Markdown.toHTML(textareaEl.val()));
      previewEl.slideDown(400);
    },

    closePreview: function() {
      this.previewOn = false;
      this.$("#editing-preview").slideUp(400);
    },

    save: function(e) {
      e.preventDefault();
      var labelsEl = this.$("#labels");
      var textareaEl = this.$("textarea");
      var titleEl = this.$("#title");

      var labels = labelsEl.val();
      var content = textareaEl.val();
      var title = titleEl.val();
      var attr = {
        title: title,
        content: content,
        labels: labels.split(",")
      };
      this.model.save(attr);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.postInitialize();
      return this;
    }
  });

  return Editor;
});

