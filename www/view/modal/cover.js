'use strict';
'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var _log = require('../../utils/log')('Modal');
var styles = require('../../style/modal.css');

var BLUR_STYLE = 'blur-background';
var OPEN_STYLE = "open";

var Cover = {
    className: 'modal-demo',

    events: {
      'ontouchmove': 'ignore',
    },

    ignore: function(e) {
      e.preventDefault();
    },

    initialize: function(opts) {
      this.$layer = opts.layer;
    },

    hide:function() {
      this.$layer.removeClass(BLUR_STYLE)
    },

    show: function() {
      this.$layer.addClass(BLUR_STYLE)
      return this;
    },

    bindTo: function(view){
      this.listenTo(view, 'cover:show', this.show);
      this.listenTo(view, 'cover:hide', this.hide);
    },
};

var View = Backbone.View.extend(Cover);

module.exports = function($element){
  var Cover = new View({layer: $element});
  $element.append(Cover.el);

  return function(view) {
    Cover.bindTo(view);
  }
};
