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
        }
    },
    paths: {
        jquery: "../bower_components/jquery/jquery",
        backbone: "../bower_components/backbone/backbone",
        underscore: "../bower_components/underscore/underscore",
        markdown: "../bower_components/markdown/lib/markdown",
        mousetrap: "../bower_components/mousetrap/mousetrap",
        text: "../bower_components/requirejs-text/text",
        handlebars: "../bower_components/handlebars/handlebars",
        bootstrap: "../bower_components/bootstrap/bootstrap"
    }
});

require([
    "backbone",
    "models/file",
    "views/editor"
], function (Backbone, fileModel, editorView) {
    var newFile = new fileModel({content: "Helllllo there :)"});
    (new editorView({model: newFile})).render();
    Backbone.history.start();
    console.log("Hello from Backbone!");
});
