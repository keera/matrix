"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var filelistTemplate = require("text!templates/file-list-view.html");
  var Select2 = require('select2');

  var Filelist = Backbone.View.extend({
    el: "#file-list",

    template: Handlebars.compile(filelistTemplate),

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({reset: true});
    },

    postInit: function() {
      var data=[{id:0,tag:'enhancement'},
        {id:1,tag:'Knuth Morris Pratt'},
        {id:2,tag:'Boyer Moore'},
        {id:3,tag:'Rabin Karp'},
        {id:4,tag:'wontfix'}];
      function format(item) { return item.tag; }
      this.$("#file-search").select2({
          width: "copy",
          data:{ results: data, text: 'tag' },
          formatSelection: format,
          formatResult: format
      });
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

