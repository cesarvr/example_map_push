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
        'touchend .menu-button': 'toggleButtonColor',
        'swipe': 'toggleMenu'
    },

    initialize: function() {
        // config element to slide here
        this.$container = $('.map');

        this.options = {};
        this.width = (this.$container.width() / 100 * 83);
        this.visible = true;

        // config speed of slide and delay of sidemenu hide here
        this.speed = 200;
        this.hideSpeed = 300;
    },

    render: function() {
        this.$el.html(template());

        return this;
    },

    toggleMenu: function() {
        _log('show menu');

        var self = this;

        this.showHideSideMenu();

        self.options['left'] = this.width;

        this.$container.animate(self.options, self.speed, 'swing');
        this.$('.menu-button').animate(self.options, self.speed, 'swing');

        // toggle values
        this.width = this.width > 0 ? '0' : (this.$container.width() / 100 * 83);
    },

    showHideSideMenu: function() {
        var self = this;

        var showSideMenu = (this.visible === true) ? 'visible' : 'hidden';

        if (this.visible) {
            this.$('.side-menu').css('visibility', showSideMenu);
        } else {
            setTimeout(function() {
                self.$('.side-menu').css('visibility', showSideMenu);
            }, self.hideSpeed);
        }

        this.visible = !this.visible;
    },

    toggleButtonColor: function(evt) {
        var color = evt.type === 'touchstart' ? '#aaaaaa' : '#ffffff';
        this.$('#menu-button-svg').css('fill', color);
    }
};

module.exports = Backbone.View.extend(Menu);
