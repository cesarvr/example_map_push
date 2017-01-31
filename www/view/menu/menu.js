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
        'click .menu-button': 'toggleMenu',
        'click .menu-button': 'toggleMenu',
        'touchstart .menu-button': 'toggleButtonColor',
        'touchend .menu-button': 'toggleButtonColor'
    },

    initialize: function() {
        // config element to slide here
        this.$container = $('.map');

        this.options = {};
        this.width = (this.$container.width() / 100 * 83);
        this.visible = true;
        this.blur = true;
    },

    render: function() {
        this.$el.html(template());

        return this;
    },

    hide: function() {
    	this.$('.menu-button').hide();
    },

    show: function() {
    	this.$('.menu-button').show();
    },

    openLink: function() {
        console.log('boom');
    },

    toggleMenu: function() {
        _log('show menu');

        var self = this;

        self.options['left'] = this.width;

        this.$('.menu-button').animate(self.options, self.speed, 'swing');
        this.$container.animate(self.options, self.speed, 'swing');

        this.toggleZIndexes();
        this.toggleBlur();

        // toggle values
        this.width = this.width > 0 ? '0' : (this.$container.width() / 100 * 83);
    },

    toggleZIndexes: function() {
    	var mapValue = $('.site-wrapper').css('z-index');
    	var sideMenuValue = $('.side-menu').css('z-index');

    	$('.site-wrapper').css('z-index', sideMenuValue);
    	$('.side-menu').css('z-index', mapValue);
    },

    toggleBlur: function() {
    	this.blur ? $('.site-wrapper').css('filter', 'blur(5px)') : $('.site-wrapper').css('filter', 'none');
    	this.blur = !this.blur;
    }, 

    toggleButtonColor: function(evt) {
        var color = evt.type === 'touchstart' ? '#aaaaaa' : '#ffffff';
        this.$('#menu-button-svg').css('fill', color);
    }
};

module.exports = Backbone.View.extend(Menu);
