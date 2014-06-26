"use strict";

define([
  "backbone",
  "underscore",
  "views/nav",
  "models/file",
  "models/session",
  "views/editor",
  "views/file",
  "views/dashboard",
  "views/about"
], function(Backbone, _, navView, fileModel, session,
  editorView, fileView, dashboardView, aboutView) {

  session = session.getSession();

  var appRouter = Backbone.Router.extend({

    routes: {
      "": "main",
      "file/:id/edit": "edit",
      "file/:id/view": "view",
      "about": "about"
    },

    navigateToAbout: function() {
      this.navigate("about", {replace: true});
      this.about();
    },

    main: function() {
      session.authenticate({
        success: function() {
          (new navView()).render("main");
          (new dashboardView()).render();
        },
        failure: _.bind(function() {
          this.navigateToAbout();
        }, this)
      });
    },

    view: function(id) {
      session.authenticate({
        success: function() {
          (new navView()).render("view");
          (new fileView({model: new fileModel({id: id})}).render());
        },
        failure: _.bind(function() {
          this.navigateToAbout();
        }, this)
      });
    },

    edit: function(id) {
      session.authenticate({
        success: function() {
          (new navView()).render("edit");
          (new editorView({model: new fileModel({id: id})}).render());
        },
        failure: _.bind(function() {
          this.navigateToAbout();
        }, this)
      });
    },

    about: function() {
      (new navView()).render("about");
      (new aboutView()).render();
    }
  });

  return appRouter;
});
