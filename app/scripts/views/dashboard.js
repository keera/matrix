"use strict";

define(function(require) {
  var Backbone = require("backbone");
  var _ = require("underscore");
  var Handlebars = require("handlebars");
  var Markdown = require("markdown");
  var Mousetrap = require("mousetrap");
  var Select2 = require("select2");
  var $ = require("jquery");
  var dashboardTemplate = require("text!templates/dashboard-view.html");
  var fileModel = require("models/file");
  var labelModel = require("models/label");
  var labelList = require("collections/label-list");
  var fileList = require("collections/file-list");
  var fileListView = require("views/file-list");
  var labelListView = require("views/dashboard-sidebar");

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

