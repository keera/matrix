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
    },

    postInitialize: function() {
      var preload_data = [
        {id: 2, text: 'algorithms'},
        {id: 3, text: 'interviews'},
        {id: 4, text: 'career'}
      ];
      this.$('#labels').select2({
        width: "copy",
        multiple: true,
        query: function (query){
          var data = {results: []};
          $.each(preload_data, function(){
            if (query.term.length == 0 ||
              this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
              data.results.push({id: this.id, text: this.text });
            }
          });
          query.callback(data);
        }
      });
      var data=[{id:0,tag:'enhancement'},
        {id:1,tag:'bug'},
        {id:2,tag:'duplicate'},
        {id:3,tag:'invalid'},
        {id:4,tag:'wontfix'}];
      function format(item) { return item.tag; }
      this.$("#url").select2({
          data:{ results: data, text: 'tag' },
          formatSelection: format,
          formatResult: format
      });
      // select2 issue #1436
      $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    },

    events: {
      "click ul a.show-preview": "preview",
      "click ul a.hide-preview": "hidePreview",
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

    preview: function() {
      console.log("previewing");
      var previewEl = this.$("#editing-preview");
      var textareaEl = this.$("textarea");
      previewEl.html(Markdown.toHTML(textareaEl.val()));
      previewEl.show();
    },

    hidePreview: function() {
      this.$("#editing-preview").hide();
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
      console.log("Saving");
      console.log(attr);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.postInitialize();
      return this;
    }
  });

  return Editor;
});

