'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var styles = require('../../style/notify.css');

var NotifyView = {

  className: 'notify loading',

  initialize: function(options){
    this.$msg = $('<p>');
    this.$el.html(this.$msg);
  },

  update: function(msg){
    this.$msg.html(msg);
    this.show();
  },

  show:function(){
    this.$el.removeClass('hide-notification');
  },

  hide: function(){
   this.$el.addClass('hide-notification');
  },

};

module.exports =  Backbone.View.extend(NotifyView);
