"use strict"

define([
  "backbone",
  "underscore",
  "handlebars",
  "markdown",
  "mousetrap",
  "select2",
  "jquery",
  "models/session",
  "collections/label-list",
  "text!templates/edit-view.html"
], function(Backbone, _, Handlebars, Markdown,
  Mousetrap, Select2, $, session,
  labelList, editTemplate) {

  session = session.getSession();

  var Editor = Backbone.View.extend({

    el: "#content",

    template: Handlebars.compile(editTemplate),

    initialize: function() {
      Mousetrap.bind("mod+s", _.bind(this.save, this));
      Mousetrap.bind("mod+c", _.bind(this.formatCode, this));
      Mousetrap.bind("mod+b", _.bind(this.boldText, this));
      Mousetrap.bind("mod+l", _.bind(this.linkText, this));
      this.model.fetch({
        success: _.bind(this.render, this)
      });
      this.previewOn = false;
    },

    events: {
      "click a.show-preview": "openPreview",
      "click a.hide-preview": "closePreview",
      "click #urlModal button": "hideModal",
      "keyup textarea": "preview",
      "click #save": "save"
    },

    postInitialize: function() {
      this.setupLabelSearch();
      this.setupFileSearch();
      // select2 issue #1436
      $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    },

    setupLabelSearch: function() {
      var format = function(item) {
        return item.name;
      };
      this.$("#labels").select2({
        multiple: true,
        width: "copy",
        ajax: {
          url: session.getBaseUrl() + "/api/labels",
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
      this.$("#labels").select2("data", this.model.get("labels"));
    },

    setupFileSearch: function() {
      var format = function(item) {
        return item.title;
      };
      this.$("#url").select2({
        id: function(obj) {
          return session.getBlogUrl() + "/file/" + obj.id;
        },
        ajax: {
          url: session.getBaseUrl() + "/api/files/search",
          dataType: "json",
          data: function(term, page) {
            return {q: term}
          },
          results: function(term, page) {
            return {results: term, text: "title"};
          }
        },
        formatSelection: format,
        formatResult: format
      });
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
      this.$("#urlModal").modal("hide");
    },

    linkText: function(e) {
      e.preventDefault();
      var that = this;
      this.$("#urlModal")
        .modal("show")
        .one("hidden.bs.modal", function (e) {
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
      var notificationEl = this.$(".notification");

      var newLabelIds = labelList.getIds(labelsEl.val().split(","));
      var oldLabelIds = labelList.getIds(this.model.get("labels"));
      var content = textareaEl.val();
      var title = titleEl.val();
      var newLabels = this.$("#labels").select2("data");

      var attr = {
        title: title,
        content: content,
        labels: newLabels,
        add_labels: labelList.getAdded(oldLabelIds, newLabelIds),
        delete_labels: labelList.getDeleted(oldLabelIds, newLabelIds)
      };

      this.model.save(attr, {
        wait: true,
        success: function(model) {
          var notificationSuccessEl = notificationEl.find(".alert-success");
          notificationSuccessEl.slideDown();
          setTimeout(function() {
            notificationSuccessEl.slideUp();
          }, 1000);
        },
        error: function(model) {
          var notificationErrorEl = notificationEl.find(".alert-danger");
          notificationErrorEl.slideDown();
          setTimeout(function() {
            notificationErrorEl.slideUp();
          }, 1000);
        }
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.postInitialize();
      return this;
    }
  });

  return Editor;
});

