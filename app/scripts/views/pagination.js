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
      this.limitPerPage = 10;
      this.currPage = 1;
      Handlebars.registerHelper("createPageLinks", _.bind(function() {
        var numPages = this.getTotalPages();
        var pageLinks = "";
        for (var page = 1; page <= numPages; page++) {
          if (page == this.currPage) {
            pageLinks += '<li class="active">' +
              '<a class="page-num" href="#">' +
              page + '</a></li>';
          } else {
            pageLinks += '<li><a class="page-num" href="#">' +
              page + '</a></li>';
          }
        }
        return pageLinks;
      }, this));
    },

    events: {
      "click .pagination .page-num": "gotoPage",
      "click .pagination .prev-page": "prevPage",
      "click .pagination .next-page": "nextPage"
    },

    getTotalPages: function() {
      return Math.ceil(this.collection.length / this.limitPerPage);
    },

    gotoPage: function(e) {
      if (e) {
        e.preventDefault();
      }
      var link = this.$(e.target);
      this.currPage = parseInt(link.text(), 10);
      this.collection.trigger("pagination:update");
    },

    nextPage: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.currPage += (this.currPage < this.getTotalPages()) ? 1 : 0;
      this.collection.trigger("pagination:update");
    },

    prevPage: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.currPage -= (this.currPage > 1) ? 1 : 0;
      this.collection.trigger("pagination:update");
    },

    getPageFiles: function() {
      var begin = (this.currPage - 1) * this.limitPerPage;
      var end = begin + this.limitPerPage;
      return _.map(this.collection.slice(begin, end), function(model) {
        return model.attributes;
      });
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

