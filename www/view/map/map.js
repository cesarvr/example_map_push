'use strict';

var Backbone = require('backbone');
var $script = require("scriptjs");
var $ = require('jquery');
var _ = require('underscore');


var geo = require('../../api/geo');


//Quick and dirty Logger function 

var _log = function(title) {
    return function(message) {
        console.log(title || 'generic', ': ', message, ' ->', Date.now());
    }
}('Map');

/*
 *
 *
 */

var MapView = {

    GMAP_API: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoez83-bCpLCFESHMiNpfkBrplOV36Hbs',

    singleton: function() {
        var objects = {};

        return function(name) {
            var instance = null;

            if (_.isUndefined(objects[name]))
                instance = new google.maps[name];
            else
              return objects[name];

            objects[name] = instance;
            return instance;
        }
    }(),

    setUserPosition: function(position) {
        this.userMarker = this.singleton('Marker');

        this.userMarker.setAnimation(google.maps.Animation.DROP);
        this.userMarker.setPosition(position);
        this.userMarker.setMap(this.map);
    },

    setUserInfo: function(info) {
        var infoWindow = this.singleton('InfoWindow');

        infoWindow.setContent($('<div class=\"info\"></div>').html(info).html());
        infoWindow.open(this.map, this.userMarker);
    },

    center: function(position, zoom) {
        this.map.setCenter(position);
        this.map.setZoom(zoom || 15);
    },

    /*  We need to inyect here a geolocation API, we listen for 
     *  the following events:
     *
     *    geolocation:position
     *
     *      params  {
     *        lat: 'latitude',
     *        lng: 'longitude'
     *      }
     *
     */

    initialize: function(options) {
        if (_.isEmpty(options.geolocationAPI)) throw "Not GeoAPI Inyected";

        var geo = options.geolocationAPI;

        this.listenTo(geo, 'geolocation:position', this.center);
        this.listenTo(geo, 'geolocation:position', this.setUserPosition);
        this.listenTo(geo, 'geolocation:position', this.getAddress);

        this.on('map:ready', this.start);
    },

    /* 
     * Start
     * Method to load Google Map API.
     *
     */
    start: function() {

        this.geocoder = new google.maps.Geocoder;

        this.map = new google.maps.Map(this.$el[0], {
            zoom: 5,
            disableDefaultUI: true,
            gestureHandling: "greedy",
            center: {
                lat: 18.7357,
                lng: -70.1627
            }
        });
    },

    /* 
     * Download the Google Map API V3 and start working
     */
    loadAPI: function() {

        $script(this.GMAP_API, function() {
            this.trigger('map:ready');
        }.bind(this));

        return this;
    },


    /*
     * Quick and dirty example of using inverse Geocode Google API.
     */
    getAddress: function(position) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$position$&key=$key$";

        this.geocoder.geocode({
            'location': position
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK)
                this.trigger('map:resolve:address', results[0].formatted_address);

        }.bind(this));
    }
};

module.exports = Backbone.View.extend(MapView);
