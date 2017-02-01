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

    // TODO - close blur etc on swipe close, tap to close, animate button

    initialize: function(options) {
        var self = this;

        // element to slide, menu button, element to blur on drawer open
        this.$mainContainer = options.mainContainer;
        this.$menuButton = options.menuButton;
        this.$blurElement = options.blurElement;

        // change menu button to this color on touch
        this.buttonFocusColor = '#555555';

        this.options = {};
        this.width = (this.$mainContainer.width() / 100 * 83);
        this.blur = true;
        this.menuOpen = true;

        // config speed of slide, blur value
        this.speed = 5;
        this.blurValue = 5;
    },

    render: function() {
        this.$el.html(template());
        this.$mainContainer.append(this.createMenu());

        return this;
    },

    createMenu: function() {
        return $('<div>').addClass('menu-button')
            .append(button())
            .on('click', this.toggleMenu.bind(this))
            .on('touchstart', this.toggleButtonColor.bind(this))
            .on('touchend', this.toggleButtonColor.bind(this));
    },

    hide: function() {
        $('.menu-button').hide();
    },

    show: function() {
        $('.menu-button').show();
    },

    openLink: function() {
        console.log('boom');
    },

    toggleMenu: function() {
        var self = this;

        this.$mainContainer.css({
            '-webkit-transform': 'translateX(' + self.width + 'px)',
            '-moz-transform': 'translateX(' + self.width + 'px)',
            '-ms-transform': 'translateX(' + self.width + 'px)',
            '-o-transform': 'translateX(' + self.width + 'px)',
            'transform': 'translateX(' + self.width + 'px)'
        });

        this.toggleBlur();
        //this.toggleListener();

        // toggle width values
        this.width = this.width > 0 ? 0 : (this.$mainContainer.width() / 100 * 83);    
    },

    toggleListener: function() {
    	// toggle listener to close
        this.menuOpen ? this.$mainContainer.on('click', this.toggleMenu.bind(this)) : this.$mainContainer.off('click', this.toggleMenu.bind(this));
        this.menuOpen = !this.menuOpen;
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
