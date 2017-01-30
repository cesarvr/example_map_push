'use strict';

var Backbone = require('backbone');
var $script = require("scriptjs");
var $ = require('jquery');
var _ = require('underscore');

var _log = require('../../utils/log')('MapView');

// MapView Class listen to the following events
var MapView = {

    GMAP_API: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoez83-bCpLCFESHMiNpfkBrplOV36Hbs',

    // Sometimes you just want the same instance, to avoid duplication and Heap memory bloat.
    singleton: function() {
        var cachedInstances = {};

        return function(name) {
            var instance = null;

            if (_.isUndefined(cachedInstances[name]))
                instance = new google.maps[name];
            else
              return cachedInstances[name];

            cachedInstances[name] = instance;
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
     *  Take a look at api/geo.js
     */

    initialize: function(options) {
        if (_.isEmpty(options.geolocationAPI)) throw "Not geolocationAPI Injected";

        var geo = options.geolocationAPI;

        this.listenTo(geo, 'geolocation:position', this.center);
        this.listenTo(geo, 'geolocation:position', this.setUserPosition);
        this.listenTo(geo, 'geolocation:position', this.getAddress);

        this.on('map:ready', this.start);
    },

    /*
     * Start
     * Instanciate the Google Map API.
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

        google.maps.event.addDomListener(this.$el[0], 'touchstart', this.onTouchStart.bind(this));
        google.maps.event.addDomListener(this.$el[0], 'touchend', this.onTouchEnd.bind(this));

    },

    /*
      The map is being touch.
    */
    onTouchStart: function(){
      this.trigger('map:touch:start');
      return true; // bubble up the touchstart event, means this don't freeze the UI.
    },

    /*
      The map is being touch.
    */
    onTouchEnd: function(){
      this.trigger('map:touch:end');
      return true; // bubble up the touchstart event, means this don't freeze the UI.
    },


    /*
     * Download the Google Map API V3 async and start working, when the API is downloaded
     * we trigger an map:ready event.
     */
    loadAPI: function() {

        $script(this.GMAP_API, function() {
            this.trigger('map:ready');
        }.bind(this));

        return this;
    },

    /*
     * Quick and dirty example of using inverse Geocode Google API.
     *
     * When google maps resolve the address, we trigger an map:resolve:address and we pass a string parameter with
     * the address.
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
