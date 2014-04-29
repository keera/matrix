"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "text!templates/dashboard-sidebar-view.html"
], function(Backbone, _, Handlebars, dashboardsidebarTemplate) {

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
          return model.attributes;
        })
      }));
      return this;
    }
  });

  return Dashboardsidebar;
});

