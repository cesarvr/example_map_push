'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var styles = require('../../style/menu.css');
var template = require('../../templates/menu.html');
var _log = require('../../utils/log')('menu');

var Menu = {

    className: 'menu-container',

    events: {
        'click': 'toggleMenu'
    },

    initialize: function() {
    	// config element to slide here
    	// look at mediator pattern here
    	this.$map = $('.map');
    },

    render: function() {
        this.$el.html(template());

        return this;
    },

    toggleMenu: function() {
        _log('show menu');
        var direction = "left";
        var width = (this.$map.width()/100*83);
        this.$map.animate({ "left": width }, "slow" );
        this.$el.animate({ "left": width }, "slow" );
    }
};

module.exports = Backbone.View.extend(Menu);
