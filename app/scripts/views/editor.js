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
        {id: 'user0', text: 'Disabled User', locked: true},
        {id: 'user1', text: 'Jane Doe'},
        {id: 'user7', text: 'Inigo Montoya' }
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
      // get tag data
      console.log(this.$("#labels").val());
      console.log("Saving");
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.postInitialize();
      return this;
    }
  });

  return Editor;
});

