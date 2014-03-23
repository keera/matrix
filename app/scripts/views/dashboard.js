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

    initialize: function() {
    },

    events: {
      "click #dashboard-sidebar a": "updateFilelist"
    },

    updateFilelist: function(e) {
      console.log("Updating file list");
      // Get the name, use it to search for the ID in
      // labels
      // set the url and fetch
      // fileList.fetch();
    },

    render: function() {
      this.$el.html(this.template());
      // Test models
      var a = new fileModel({title: "Helllllo there one :)"});
      var b = new fileModel({title: "Helllllo there two :)"});
      var list = new fileList([a,b]);
      var newList = new fileListView({collection: list});
      newList.render();

      var al = new labelModel({name: "algorithms"});
      var bl = new labelModel({name: "history"});
      var listl = new labelList([al,bl]);
      var newListl = new labelListView({collection: listl});

      newListl.render();
      return this;
    }
  });

  return Dashboard;
});

