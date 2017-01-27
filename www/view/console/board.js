'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var util = require('../../utils/util')

/* Load CSS */
require('../../style/board.css');
require('../../style/breadcrumb.css');

var svgBreadCrumbTmpl = require('../../templates/breadcumb.html');

var BOARD_MODE = 2;
var NOTIFY_MODE = 1;

var Board = {
  className: 'console show',

  events: {
    'click':'console'
  },

  show: function(){
    util.defer(function(){
      this.$el.addClass('show')
    }.bind(this), 2500);
  },

  hide: function(){
    this.$el.removeClass('show');
  }

};

var BoardView = Backbone.View.extend(Board);

module.exports = function($element){
  var boardView = new BoardView();
  $element.append(boardView.el);

  return function(object){
    boardView.listenTo(object, 'map:touch:end', boardView.show);
    boardView.listenTo(object, 'map:touch:start', boardView.hide);
  }
};
