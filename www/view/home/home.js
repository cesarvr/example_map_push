var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var BreakDownView = require('../breakdown/break');
var _log = require('../../utils/log')('home');


var Home = {

    initialize: function(){
      this.$cover =  $('<div>').addClass('cover').appendTo('body');
      this.$site = this.$el.find('.site-wrapper');
    },

    lock: function(){
      this.$site.addClass('blurBackground');

      //just add this to avoid user interaction with the map while login.
      setTimeout(function(){ this.$cover.addClass('show')  }.bind(this),200)
    },

    show: function(){

      if(this.$site) {
        this.$site.removeClass('blurBackground');
        this.$cover.removeClass('show');
      }
    },
};

module.exports = Backbone.View.extend(Home);
