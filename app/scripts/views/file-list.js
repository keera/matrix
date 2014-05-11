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
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'destroy', this.render);
      this.collection.fetch({reset: true});
      Handlebars.registerHelper("formatDatetime", function(datetime) {
        return moment(datetime).fromNow();
      });
    },

    events: {
      "click .delete-file": "deleteFile"
    },

    deleteFile: function(ev) {
      var model = this.collection.findWhere({
        id: this.$(ev.target).data("id")
      });
      model.destroy({wait: true});
    },

    render: function() {
      var models = this.collection.models;
      this.$el.html(this.template({
        files: _.map(models, function(model) {
          return model.attributes;
        })
      }));
      return this;
    }
  });

  return Filelist;
});

