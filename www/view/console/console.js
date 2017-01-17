'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

function SetAndRemove(Menu, key){

  Menu['add_' + key] = function(){
    this.$el.addClass(key);
    return this;
  }

  Menu['remove_' + key] = function(){
    this.$el.removeClass(key);
    return this;
  }

  return Menu;
};

var Menu = {

  className: 'console',

  show: function(){
    this.$el.removeClass('hide-bar');
    return this;
  },

  hide: function(){
    this.$el.addClass('hide-bar');
    return this;
  }

};

var View = SetAndRemove(Menu, 'think'); //this add add_think & remove_think.
View = SetAndRemove(Menu, 'loading');
View = SetAndRemove(Menu, 'message');


module.exports = Backbone.View.extend(View);
