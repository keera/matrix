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
  var fileList = require("collections/file-list");
  var fileListView = require("views/file-list");

  var Dashboard = Backbone.View.extend({
    el: "#content",

    template: Handlebars.compile(dashboardTemplate),

    initialize: function() {
    },

    events: {
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      var a = new fileModel({title: "Helllllo there one :)"});
      var b = new fileModel({title: "Helllllo there two :)"});
      var list = new fileList([a,b]);
      var newList = new fileListView({collection: list});
      newList.render();
      return this;
    }
  });

  return Dashboard;
});

