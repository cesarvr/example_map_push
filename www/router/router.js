'use strict';
var Backbone = require('backbone');

var $ = require('jquery');

//API's

var User = require('../model/user');
var Workflow = require('../api/workflow');

// views
var MapView = require('../view/map/map');
var HomeView = require('../view/home/home');
var MenuView = require('../view/menu/menu');
var LoginView = require('../view/login/login');
var NotificationView = require('../view/console/notification');
var BoardView = require('../view/console/board');


var geolocationAPI = require('../api/geolocation');
var User = require('../model/user');

var coverObserver = null;

var Router = Backbone.Router.extend({

    routes: {
        '*path': 'loadMap',
    },

    initialize: function() {

        this.$body = $('body');
        this.$wrapper = $('.site-wrapper');
        this.$blurElement = $('.map');

        this.workflow = null;

        this.notify = new NotificationView();

        this.homeView = new HomeView({
            el: this.$menu
        });

        // load menu view specifying the element to slide & optional element to blur
        this.menuView = new MenuView({
            mainContainer: this.$wrapper,
            blurElement: this.$blurElement
        });

        coverObserver = require('../view/modal/cover')(this.$wrapper);

        geolocationAPI.on('geolocation:working', function() {
            this.update('Loading...');
        }, this.notify);

        geolocationAPI.on('geolocation:position', this.notify.hide, this.notify);

        this.createNewModal();
        this.loginScreen(User);
    },

    createNewModal: function() {

    },

    loginScreen: function(user) {
        var login = new LoginView({
            model: user
        });

        this.$body.append(login.render().el);

        coverObserver(login);

        //user auth dictate the behavior of the login.
        user.on('user:not_found', login.show, login);
        user.on('user:found', login.close, login);
    },

    loadRateView: function() {
        this.rate.render().show();
    },


    loadMap: function(user) {

        this.$body.append(this.notify.el);

        this.mapView = new MapView({
            el: $('.map'),
            geolocationAPI: geolocationAPI
        });

        this.mapView.loadAPI();

        this.mapView.on('map:ready', geolocationAPI.getLocation, geolocationAPI);
        this.mapView.on('map:ready', this.$body.append(this.menuView.render().el));
        this.mapView.on('map:resolve:address', User.checkCredentials, User);
        this.mapView.on('map:resolve:address', this.mapView.setUserInfo);

        BoardView(this.$body)(this.mapView);
    }
});

module.exports = Router;
