"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "markdown",
  "mousetrap",
  "select2",
  "jquery",
  "text!templates/dashboard-view.html",
  "models/file",
  "models/label",
  "collections/label-list",
  "collections/file-list",
  "views/file-list",
  "views/dashboard-sidebar"
], function(Backbone, _, Handlebars, Markdown, Mousetrap,
  Select2, $, dashboardTemplate, fileModel,
  labelModel, labelList, fileList, fileListView,
  labelListView) {

  var Dashboard = Backbone.View.extend({

    el: "#content",

    template: Handlebars.compile(dashboardTemplate),

    events: {
      "click #dashboard-sidebar a": "updateFilelist"
    },

    updateActiveLink: function(newLink) {
      var currLabelEl = this.$(".nav li.active");
      currLabelEl.removeClass("active");
      console.log(currLabelEl);
      newLink.addClass("active");
    },

    updateFilelist: function(e) {
      console.log("Updating file list");
      var headerLabelEl = this.$("#header-label");
      var currLinkEl = this.$(e.target);
      this.updateActiveLink(currLinkEl.parent());
      headerLabelEl.html(currLinkEl.html());
      // go iterative through
      // turn everyone except target off
      // Get the name, use it to search for the ID in
      // labels
      // set the url and fetch
      // fileList.fetch();
    },

    render: function() {
      this.$el.html(this.template());
      (new fileListView({collection: (new fileList())})).render();
      (new labelListView({collection: (new labelList())})).render();
      return this;
    }
  });

  return Dashboard;
});

