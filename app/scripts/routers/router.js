"use strict";

define([
  "backbone",
  "views/header",
  "models/file",
  "views/editor",
  "views/file",
  "views/dashboard"
], function(Backbone, headerView, fileModel, editorView, fileView, dashboardView) {
  var appRouter = Backbone.Router.extend({
    routes: {
      "": "main",
      "file/:id/edit": "edit",
      "file/:id/view": "view"
    },

    main: function() {
      new headerView();
      (new dashboardView()).render();
    },

    view: function() {
      new headerView();
      var m = new fileModel({title:"Hello World", content: "this is what I'm taling about"});
      (new fileView({model: m}).render());
    },

    edit: function(id) {
      new headerView();
      var m = new fileModel({id: id});
      (new editorView({model: m}).render());
    }
  });

  return appRouter;
});
