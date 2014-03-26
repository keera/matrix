"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var dashboardsidebarTemplate = require("text!templates/dashboard-sidebar-view.html");

  var Dashboardsidebar = Backbone.View.extend({
    el: "#dashboard-sidebar",

    template: Handlebars.compile(dashboardsidebarTemplate),

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({reset: true});
    },

    render: function() {
      var models = this.collection.models;
      this.$el.html(this.template({
        labels: _.map(models, function(model) {
          console.log(model.attributes);
          return model.attributes;
        })
      }));
      return this;
    }
  });

  return Dashboardsidebar;
});

