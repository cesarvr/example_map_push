'use strict';
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

//API's
var Workflow = require('../api/workflow');
var Driver = require('../api/driver');
var geolocationAPI = require('../api/geolocation');

//model
var User = require('../model/user');

// views
var HomeView = require('../view/home/home');
var LoginView = require('../view/login/login');
var NotificationView = require('../view/console/notification');

// map views 
var MapView = require('../view/map/map');
var InfoView = require('../view/map/info');
var Markers = require('../view/map/marker');

var driver = null,
    coverView = null,
    marker = null;

var Router = Backbone.Router.extend({

    routes: {
        '*path': 'loadMap',
    },

    initialize: function() {
        this.$body = $('body');
        this.$wrapper = $('.site-wrapper');
        this.workflow = null;
        this.notify = new NotificationView();
        this.homeView = new HomeView({
            el: this.$body
        });

        coverView = require('../view/modal/cover')(this.$wrapper);

        geolocationAPI.on('geolocation:working', function() {
            this.update('Loading, please be patient.');
        }, this.notify);

        this.notify.listenToOnce(geolocationAPI, 'geolocation:position', this.notify.hide);

        this.loginScreen(User);
        this.$body.append(this.notify.el);
    },

    start: function(marker, driver) {

        marker.listenTo(driver,
            'update:drivers',
            _.partial(marker.markDriversInMap, User));

        marker.listenToOnce(geolocationAPI,
            'geolocation:position',
            _.partial(marker.markUserInMap, User));

        geolocationAPI.on('geolocation:position', driver.publishLocation);

        geolocationAPI.getLocation();
        driver.getDriverStatus();
    },

    initMapAPI: function(user, map) {
        marker = new Markers(map, InfoView);
        driver = new Driver(User);

        user.on('user:found', function(){
          this.start(marker, driver);
        }, this);

        user.checkCredentials();
    },

    loginScreen: function(user) {
        var login = new LoginView({
            model: user
        });

        this.$body.append(login.render().el);
        coverView(login);

        //user auth ditacte the behavior of the login.
        user.on('user:not_found', login.show, login);
        user.on('user:found', login.close, login);
    },

    loadMap: function(user) {

        this.mapView = new MapView({
            el: $('.map'),
            geolocationAPI: geolocationAPI
        });

        this.mapView.on('map:created', _.partial(this.initMapAPI, User), this);

        this.mapView.loadAPI();
    }
});

module.exports = Router;
