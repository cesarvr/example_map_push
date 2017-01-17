var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var BreakDownView = require('../breakdown/break');
var _log = require('../../utils/log')('home');


var Home = {

    lock: function(){
      this.$el.find('.site-wrapper').addClass('blurBackground');
      this.$cover =  $('<div>').addClass('cover').appendTo('body');

      setTimeout(function(){ this.$cover.addClass('show')  }.bind(this),200)

    },

    show: function(){
      if(this.$cover)
        this.$cover.removeClass('blurBackground');
    },

};

module.exports = Backbone.View.extend(Home);
