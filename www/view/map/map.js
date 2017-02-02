'use strict';

var Backbone = require('backbone');
var $script = require("scriptjs");
var $ = require('jquery');
var _ = require('underscore');

var _log = require('../../utils/log')('MapView');

// MapView Class listen to the following events
var MapView = {

    GMAP_API: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDoez83-bCpLCFESHMiNpfkBrplOV36Hbs',


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


        this.listenTo(geo, 'geolocation:position', this.getAddress);

        this.on('map:api:downloaded', this.start);
    },

    /*
     * Start
     * Instanciate the Google Map API.
     *
     */
    start: function() {

        this.geocoder = new google.maps.Geocoder;

        this.map = new google.maps.Map(this.$el[0], {
            zoom: 11,
            disableDefaultUI: true,
            gestureHandling: "greedy",
            center: {
                lat: 18.7357,
                lng: -70.1627
            }
        });

        google.maps.event.addDomListener(this.$el[0], 'touchstart', this.onTouchStart.bind(this));
        google.maps.event.addDomListener(this.$el[0], 'touchend', this.onTouchEnd.bind(this));

        this.trigger('map:created', this.map);

    },

    /*
      The map is being touch.
    */
    onTouchStart: function(){
      this.trigger('map:touch:start');
      return false; // bubble up the touchstart event, means this don't freeze the UI.
    },

    /*
      The map is being touch.
    */
    onTouchEnd: function(){
      this.trigger('map:touch:end');
      return false; // bubble up the touchstart event, means this don't freeze the UI.
    },


    /*
     * Download the Google Map API V3 async and start working, when the API is downloaded
     * we trigger an map:api:downloaded event.
     */
    loadAPI: function() {

        $script(this.GMAP_API, function() {
            this.trigger('map:api:downloaded');
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
