"use strict";

define([
  "backbone",
  "underscore",
  "handlebars",
  "text!templates/pagination.html",
], function(Backbone, _, Handlebars, paginationView) {

  var Pagination = Backbone.View.extend({

    template: Handlebars.compile(paginationView),

    initialize: function() {
      Handlebars.registerHelper("createPageLinks", _.bind(function(numFiles) {
        var filesPerPage = 10;
        var numPages = Math.ceil(numFiles / filesPerPage);
        var pageLinks = "";
        for (var currPage = 1; currPage <= numPages; currPage++) {
          if (this.currPage == currPage) {
            pageLinks += '<li class="active">' +
              '<a class="page-num" href="#">' +
              currPage + '</a></li>';
          } else {
            pageLinks += '<li><a class="page-num" href="#">' +
              currPage + '</a></li>';
          }
        }
        return pageLinks;
      }, this));

      this.currPage = 1;
    },

    events: {
      "click .pagination .page-num": "gotoPage",
      "click .pagination .prev-page": "prevPage",
      "click .pagination .next-page": "nextPage"
    },

    gotoPage: function(e) {
      if (e) {
        e.preventDefault();
      }
      var link = this.$(e.target);
      var currPage = this.currPage;
      this.currPage = link.text();
      this.collection.trigger("pagination:update");
    },

    nextPage: function(e) {
      this.currPage += 1;
      this.collection.trigger("pagination:update");
    },

    prevPage: function(e) {
      this.currPage -= 1;
      this.collection.trigger("pagination:update");
    },

    getPageFiles: function() {
      var begin = (this.currPage - 1) * 10;
      var end = begin + 10;
      var models = this.collection.slice(begin, end);
      var files = _.map(models, function(model) {
        return model.attributes;
      });
      return files;
    },

    render: function() {
      this.$el.html(this.template({
        numFiles: this.collection.length
      }));
      return this;
    }

  });

  return Pagination;
});

