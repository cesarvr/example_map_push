'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var styles = require('../../style/menu.css');
var template = require('../../templates/menu.html');
var _log = require('../../utils/log')('menu');
var Snap = require('../../lib/snap');

var Menu = {

    className: 'menu-container',

    events: {
        'click .menu-button': 'toggleMenu',
        'click .side-menu': 'openLink',
        'touchstart .menu-button': 'toggleButtonColor',
        'touchend .menu-button': 'toggleButtonColor'
    },

    // TODO - close blur etc on swipe close, tap to close...

    initialize: function(options) {
        var self = this;

        // element to slide, menu button, element to blur on drawer open
        this.$mainContainer = options.mainContainer;
        this.$menuButton = options.menuButton;
        this.$blurElement = options.blurElement;

        // change menu button to this color on touch
        this.buttonFocusColor = '#555555';

        this.width = (this.$mainContainer.width() / 100 * 83);
        this.blur = true;
        this.menuShow = true;

        /*this.snapper = new Snap({
            element: this.$mainContainer[0],
            maxPosition: this.width,
            minPosition: this.width
        });

        this.snapper.on('open', function() {
            self.toggleBlur();
            self.menuShow = !self.menuShow;
        });

        this.snapper.on('close', function() {
            self.toggleBlur();
            self.menuShow = !self.menuShow;
        });*/

        /*this.snapper.on('drag', function() {
            self.snapper.close();
        });*/

        this.$menuButton.on('click', this.toggleMenu.bind(this));
        //$('.menu-open').on('touchstart', this.toggleMenu.bind(this));
        this.$menuButton.on('touchstart', this.toggleButtonColor.bind(this));
        this.$menuButton.on('touchend', this.toggleButtonColor.bind(this));
    },

    render: function() {
        this.$el.html(template());

        return this;
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
        // only show menu, snap.js handles close itself
        if (this.menuShow) {
            this.$menuButton.addClass('menu-open');
            this.snapper.open('left');
        } else {
            this.$menuButton.removeClass('menu-open');
            this.snapper.close();
        }
    },

    toggleBlur: function() {
        this.blur ? this.$blurElement.css('filter', 'blur(5px)') : this.$blurElement.css('filter', 'none');
        this.blur = !this.blur;
    },

    toggleButtonColor: function(evt) {
        var color = evt.type === 'touchstart' ? this.buttonFocusColor : '#ffffff';
        $('#menu-button-svg').css('fill', color);
    }
};

module.exports = Backbone.View.extend(Menu);
