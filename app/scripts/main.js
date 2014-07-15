/*global require*/
"use strict";

require.config({
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: [
        "underscore",
        "jquery"
      ],
      exports: "Backbone"
    },
    handlebars: {
      exports: "Handlebars"
    },
    markdown: {
      exports: "markdown"
    },
    bootstrap: {
      deps: ["jquery"]
    },
    select2: {
      deps: ["jquery"],
      exports: "Select2"
    },
  },
  paths: {
    jquery: "../bower_components/jquery/jquery",
    backbone: "../bower_components/backbone/backbone",
    underscore: "../bower_components/underscore/underscore",
    markdown: "../bower_components/markdown/lib/markdown",
    mousetrap: "../bower_components/mousetrap/mousetrap",
    text: "../bower_components/requirejs-text/text",
    handlebars: "../bower_components/handlebars/handlebars",
    bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
    select2: "../bower_components/select2/select2",
    moment: "../bower_components/momentjs/moment",
    spin: "../bower_components/spin.js/spin"
  }
});

require([
  "backbone",
  "routers/router",
  "bootstrap",
], function (Backbone, router, bootstrap) {
  new router();
  Backbone.history.start();
});

