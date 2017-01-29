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

        this.notify.listenToOnce(geolocationAPI, 'geolocation:position', this.notify.hide);
        this.loginScreen(User);

        this.$body.append(this.notify.el);
    },

    start: function(map){
      marker = new Markers(map);
      driver = new Driver(User);

      driver.on('update:drivers',marker.update);
      geolocationAPI.on('geolocation:position', marker.user);
      /* function(driverList){
        var user = User.get('user');
        marker.update(driverList);
        /*
        marker.centerAt(user);
        marker.setOrigin(user);

      });*/

      geolocationAPI.on('geolocation:position', driver.publishLocation);
      geolocationAPI.getLocation();
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

        this.mapView.on('map:created', this.start);
        this.mapView.on('map:resolve:address', User.checkCredentials, User);
        this.mapView.on('map:resolve:address', this.mapView.setUserInfo);

        this.mapView.loadAPI();
    }
});

module.exports = Router;
