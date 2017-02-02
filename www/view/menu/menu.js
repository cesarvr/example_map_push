'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var styles = require('../../style/menu.css');
var button = require('../../templates/menu-button.html');
var template = require('../../templates/menu.html');
var _log = require('../../utils/log')('menu');

var Menu = {

    className: 'menu-container',

    events: {
        'click .menu-button': 'toggleMenu',
        'click .side-menu': 'openLink',
        'touchstart .menu-button': 'toggleButtonColor',
        'touchend .menu-button': 'toggleButtonColor'
    },

    initialize: function(options) {
        var self = this;

        // element to slide and element to blur on drawer open
        this.$mainContainer = options.mainContainer;
        this.$blurElement = options.blurElement;

        this.width = (this.$mainContainer.width() / 100 * 83);
        this.blur = true;
        this.menuOpen = true;

        // CONFIGURATION
        // menu button color on touch
        this.buttonFocusColor = '#555555';
        // speed of slide, blur value
        this.speed = 5;
        this.blurValue = 5;

        // allow clicking main content to close menu when open
        this.$mainContainer.on('click', this.mainContainerClose.bind(this))
    },

    render: function() {
        this.$el.html(template());
        this.$mainContainer.append(this.createMenuButton());

        return this;
    },

    createMenuButton: function() {
        return $('<div>').addClass('menu-button')
            .append(button())
            .on('click', this.toggleMenu.bind(this))
            .on('touchstart', this.toggleButtonColor.bind(this))
            .on('touchend', this.toggleButtonColor.bind(this));
    },

    hide: function() {
        $('.menu-button').hide();
        this.$el.find('.side-menu').hide();
    },

    show: function() {
        $('.menu-button').show();
        this.$el.find('.side-menu').show();
    },

    openLink: function() {
        console.log('boom');
    },

    toggleMenu: function(e) {
    	if(e){
    		e.stopPropagation();
    	}

        this.$mainContainer.css({
            '-webkit-transform': 'translateX(' + this.width + 'px)',
            '-moz-transform': 'translateX(' + this.width + 'px)',
            '-ms-transform': 'translateX(' + this.width + 'px)',
            '-o-transform': 'translateX(' + this.width + 'px)',
            'transform': 'translateX(' + this.width + 'px)'
        });

        this.toggleBlur();
        this.menuOpen = !this.menuOpen;

        // toggle width value to reverse animation direction
        this.width = this.width > 0 ? 0 : (this.$mainContainer.width() / 100 * 83);    
    },

    mainContainerClose: function() {
    	if(!this.menuOpen) {
    		this.toggleMenu();
    	}
    },

    toggleBlur: function() {
        this.blur ? this.$blurElement.css('filter', 'blur(' + this.blurValue + 'px)') : this.$blurElement.css('filter', 'none');
        this.blur = !this.blur;
    },

    toggleButtonColor: function(evt) {
        var color = evt.type === 'touchstart' ? this.buttonFocusColor : '#ffffff';
        $('#menu-button-svg').css('fill', color);
    }
};

module.exports = Backbone.View.extend(Menu);
