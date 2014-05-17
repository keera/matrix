"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "text!templates/file-list-view.html",
  "moment"
], function(Backbone, _, Handlebars, filelistTemplate,
  moment) {

  var Filelist = Backbone.View.extend({

    el: "#file-list",

    template: Handlebars.compile(filelistTemplate),

    initialize: function() {
      this.listenTo(this.collection, "reset", this.render);
      this.listenTo(this.collection, "change", this.render);
      this.listenTo(this.collection, "add", this.render);
      this.collection.fetch({reset: true});
      Handlebars.registerHelper("formatDatetime", function(datetime) {
        return moment(datetime).fromNow();
      });
      Handlebars.registerHelper("hasFiles", function(files) {
        return (files.length > 0) ? true : false;
      });
      // Keep updated
      setInterval(_.bind(this.collection.fetch, this.collection), 10000);
    },

    events: {
      "click .delete-file": "deleteFile",
      "click .toggle-publish": "togglePublish"
    },

    deleteFile: function(ev) {
      var linkEl = this.$(ev.target);
      linkEl.parents("tr").fadeOut(300);
      this.collection
        .get(linkEl.data("id"))
        .destroy({wait: true});
    },

    togglePublish: function(ev) {
      this.collection
        .get(this.$(ev.target).data("id"))
        .togglePublish();
    },

    render: function() {
      var models = this.collection.models;
      var files = _.map(models, function(model) {
        return model.attributes;
      });
      this.$el.html(this.template({
        files: files,
        hasFiles: (files.length > 0) ? true : false
      }));
      this.$el.hide().fadeIn(300);
      return this;
    }
  });

  return Filelist;
});

