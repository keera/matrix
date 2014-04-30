"use strict";

define([
  "backbone",
  "views/header",
  "models/file",
  "models/session",
  "views/editor",
  "views/file",
  "views/dashboard",
  "views/about"
], function(Backbone, headerView, fileModel, session,
  editorView, fileView, dashboardView, aboutView) {

  var appRouter = Backbone.Router.extend({

    routes: {
      "": "main",
      "file/:id/edit": "edit",
      "file/:id/view": "view",
      "about": "about"
    },

    main: function() {
      // Check authentication
      var success = function() {
        (new headerView()).render();
        (new dashboardView()).render();
      };
      var failure = function() {
        this.navigate("about");
        this.about();
        return;
      }.bind(this);
      session.getSession().authenticate({
        success: success,
        failure: failure
      });
    },

    view: function(id) {
      (new headerView()).render();
      var m = new fileModel({id: id});
      (new fileView({model: m}).render());
    },

    edit: function(id) {
      (new headerView()).render();
      var m = new fileModel({id: id});
      (new editorView({model: m}).render());
    },

    about: function() {
      (new headerView()).render();
      (new aboutView()).render();
    }
  });

  return appRouter;
});
