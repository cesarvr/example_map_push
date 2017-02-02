'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var _log = require('../../utils/log')('home');

var Home = {

    events: {
        'click .down.call': 'callDriver'
    },

    callDriver: function(){
      _log('Calling Driver');
      this.trigger('open:modal');
    }

};

module.exports = Backbone.View.extend(Home);
