"use strict";

define([
  "backbone",
  "views/app",
  "models/file",
  "views/editor",
  "views/file"
], function(Backbone, appView, fileModel, editorView, fileView) {
  var appRouter = Backbone.Router.extend({
    routes: {
      "": "main",
      "file/:id/edit": "edit",
      "file/:id/view": "view"
    },

    main: function() {
      (new appView()).render();
    },

    view: function() {
      var m = new fileModel({title:"Hello World", content: "this is what I'm taling about"});
      (new fileView({model: m}).render());
    },

    edit: function(id) {
      var m = new fileModel({title:"supppp", content: "f"});
      (new editorView({model: m}).render());
    }
  });

  return appRouter;
});
