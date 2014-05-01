"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "text!templates/file-list-view.html",
  "select2"
], function(Backbone, _, Handlebars, filelistTemplate,
  Select2) {

  var Filelist = Backbone.View.extend({

    el: "#file-list",

    template: Handlebars.compile(filelistTemplate),

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({reset: true});
    },

    postInit: function() {
      var format = function(item) {
        return item.title;
      };
      // Should search by the label
      // TODO: modularize select field setup
      this.$("#file-search").select2({
        id: function(obj) {
          return "http://localhost:3000/#file/" + obj.id + "/view";
        },
        ajax: {
          url: "api/files/search",
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
      // Attach selection change handler
      this.$("#file-search").on("change", _.bind(this.openFile, this));
    },

    openFile: function(ev) {
      alert(ev.val);
    },

    render: function() {
      var models = this.collection.models;
      this.$el.html(this.template({
        files: _.map(models, function(model) {
          return model.attributes;
        })
      }));
      this.postInit();
      return this;
    }
  });

  return Filelist;
});

