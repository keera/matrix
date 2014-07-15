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
  "models/session",
  "collections/label-list",
  "collections/file-list",
  "views/file-list",
  "views/dashboard-sidebar",
  "spin"
], function(Backbone, _, Handlebars, Markdown, Mousetrap,
  Select2, $, dashboardTemplate, fileModel,
  labelModel, session, labelList, fileList, fileListView,
  labelListView, spin) {

  session = session.getSession();

  var Dashboard = Backbone.View.extend({

    el: "#content",

    template: Handlebars.compile(dashboardTemplate),

    events: {
      "click #dashboard-sidebar a": "updateFilelist"
    },

    postInit: function() {
      var format = function(item) {
        return item.title;
      };
      this.$("#file-search").select2({
        id: function(obj) {
          return session.getBaseUrl() + "/#file/" + obj.id + "/edit";
        },
        ajax: {
          url: session.getBaseUrl() + "/api/files/search",
          dataType: "json",
          data: function(term, page) {
            return {q: term}
          },
          results: function(term, page) {
            return {results: term, text: "title"};
          }
        },
        formatSelection: format,
        formatResult: format
      });
      // Attach selection change handler
      this.$("#file-search").on("change", _.bind(this.openFile, this));
      // Add spinner
      var opts = {
        lines: 7, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 7, // The radius of the inner circle
        corners: 0.5, // Corner roundness (0..1)
        rotate: 56, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#bcf', // #rgb or #rrggbb or array of colors
        speed: 1.3, // Rounds per second
        trail: 84, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
      };
      // Spinner closure
      this.toggleSpinner = function() {
        var spinner = new spin(opts),
          spinning = false,
          target = document.getElementById("spinner");
        return function() {
          if (spinning) {
            spinner.stop();
            spinning = false;
          } else {
            // Takes DOM element as arg
            spinner.spin(target);
            spinning = true;
          }
        }
      }();
    },

    openFile: function(ev) {
      window.open(ev.val, "_blank");
    },

    updateActiveLink: function(newLink) {
      var currLabelEl = this.$(".nav li.active");
      currLabelEl.removeClass("active");
      newLink.addClass("active");
    },

    updateFilelist: function(e) {
      var headerLabelEl = this.$("#header-label");
      var currLinkEl = this.$(e.target);
      this.updateActiveLink(currLinkEl.parent());
      // Update header
      headerLabelEl.html(currLinkEl.html());
      // Get selected label and fetch
      var linkText = currLinkEl.text();
      var selectedLabel = this.labelCollection.findWhere({
        "name": linkText
      });
      var toggleSpinnerClosure = _.bind(function() { this.toggleSpinner(); }, this);
      toggleSpinnerClosure();
      // Let it spin cuz I lik3 spinna$
      if (linkText === "All" || !selectedLabel) {
        setTimeout(_.bind(function() {
          this.fileCollection.fetchAll(toggleSpinnerClosure);
        }, this), 200);
      } else {
        setTimeout(_.bind(function() {
          this.fileCollection.fetchByLabel({
            label_id: selectedLabel.get("id")
          }, toggleSpinnerClosure);
        }, this), 200);
      }
    },

    render: function() {
      this.$el.html(this.template());
      this.labelCollection = new labelList();
      this.fileCollection = new fileList();
      (new fileListView({collection: this.fileCollection})).render();
      (new labelListView({collection: this.labelCollection})).render();
      this.postInit();
      return this;
    }
  });

  return Dashboard;
});

