'use strict';
var Backbone = require('backbone');
var $ = require('jquery');

//API's
var Workflow = require('../api/workflow');
var Driver = require('../api/driver');
var geolocationAPI = require('../api/geolocation');

//model
var User = require('../model/user');

// views
var MapView = require('../view/map/map');
var Markers = require('../view/map/marker');

var HomeView = require('../view/home/home');
var LoginView = require('../view/login/login');
var NotificationView = require('../view/console/notification');
var BoardView = require('../view/console/board');

var driver = null,
    coverView =  null,
    marker = null;

var Router = Backbone.Router.extend({

    routes: {
        '*path': 'loadMap',
    },

    initialize: function() {
        this.$body    = $('body');
        this.$wrapper = $('.site-wrapper');
        this.workflow = null;
        this.notify   = new NotificationView();
        this.homeView = new HomeView({
            el: this.$body
        });

        coverView = require('../view/modal/cover')(this.$wrapper);

        geolocationAPI.on('geolocation:working', function() {
            this.update('Loading...');
        }, this.notify);

        geolocationAPI.on('geolocation:position', this.notify.hide, this.notify);
        this.loginScreen(User);
    },

    start: function(map){
      marker = new Markers(map);
      driver = new Driver(User);

      driver.on('update:drivers', marker.update);
      geolocationAPI.on('geolocation:position', driver.publishLocations);
      geolocationAPI.getLocation();
    },

    loginScreen: function(user) {
        var login = new LoginView({
            model: user
        });

        this.$body.append(login.render().el);
        coverView(login)

        //user auth ditacte the behavior of the login.
        user.on('user:not_found', login.show, login);
        user.on('user:found', login.close, login);
    },

    loadMap: function(user) {

        this.$body.append(this.notify.el);

        this.mapView = new MapView({
            el: $('.map'),
            geolocationAPI: geolocationAPI
        });


        this.mapView.on('map:created', this.start);
        this.mapView.on('map:resolve:address', User.checkCredentials, User);
        this.mapView.on('map:resolve:address', this.mapView.setUserInfo);

        this.mapView.loadAPI();
        BoardView(this.$body)(this.mapView);
    }
});

module.exports = Router;
