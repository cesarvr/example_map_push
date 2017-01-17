'use strict';
var Backbone = require('backbone');

var $ = require('jquery');

//API's
var Geo = require('../api/geo').New();
var User = require('../model/user');
var Workflow = require('../api/workflow');

// views
var MapView = require('../view/map/map');
var HomeView = require('../view/home/home');
var LoginView = require('../view/login/login');
var NotificationView = require('../view/console/notification');
var BoardView = require('../view/console/board');


var User = require('../model/user');


var Router = Backbone.Router.extend({

    routes: {
        'home': 'add',
        '*path': 'loadMap',
    },

    initialize: function() {

        this.$body = $('body');

        this.workflow = null;

        this.notify = new NotificationView();
        this.board = new BoardView();

        this.homeView = new HomeView({
            el: this.$body
        });

        Geo.on('geolocation:working', function() {
            this.update('Loading...');
        }, this.notify);

        Geo.on('geolocation:position', this.notify.hide, this.notify);

        this.listenTo(User, 'user:not_found', this.loginScreen);
        User.on('user:found', this.homeView.show, this.homeView);  

    },

    loginScreen: function(model) {

        this.loginView = new LoginView({
            model: model
        });

        this.$body.append(this.loginView.render().el);

        this.loginView.show();
        this.homeView.lock();
    },

    loadRateView: function() {
        this.rate.render().show();
    },

    loadMap: function(user) {

        $('body').append(this.notify.el);
        $('body').append(this.board.el);

        this.mapView = new MapView({
            el: $('.map'),
            geolocationAPI: Geo
        }).loadAPI();


        this.mapView.on('map:ready', Geo.getLocation, Geo);
        this.mapView.on('map:resolve:address', User.checkCredentials, User);
        this.mapView.on('map:resolve:address', this.mapView.setUserInfo);
    }
});

module.exports = Router;
