'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var styles = require('../../style/info.css');
var template = require('../../templates/info.html');

var _log = require('../../utils/log')('InfoView');

// InfoView Class listen to the following events
var InfoView = {

    initialize: function(options) {
        this.infoWindow = new google.maps.InfoWindow();
        this.geocoder = new google.maps.Geocoder;

        this.user = options.user;
        this.associatedMarker = options.marker;
        this.associatedMap = options.map;

        this.associatedMarker.addListener('click', this.open.bind(this));
        this.infoWindow.addListener('closeclick', this.close.bind(this));

        this.on('resolve:address', this.setAddress);
        this.on('resolve:address', this.render);

        this.rendered = false;
    },

    setAddress: function(address){
      this.address = address;
    },

    getPosition: function(){
        return {
               lat: this.associatedMarker
                        .getPosition()
                        .lat(),
               lng: this.associatedMarker
                        .getPosition()
                        .lng()
           };
    },

    updateAddress: function(){
      this.getAddress(this.getPosition());
    },

    getJSON: function() {
        return {
            user: this.user.get('user'),
            address: this.address || "Loading..."
        }
    },

    close: function() {
        this.infoWindow.close();
        this.rendered = false;
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
                this.trigger('resolve:address', results[0].formatted_address);
        }.bind(this));
    },

    open: function() {
        if (this.rendered) {
            this.close();
            return;
        }

        this.render();

        this.infoWindow.open(
            this.associatedMap,
            this.associatedMarker);

        this.rendered = true;
    },

    render: function() {
        this.$el.html(template(this.getJSON()));
        this.infoWindow.setContent(this.$el.html());
    }
};

module.exports = Backbone.View.extend(InfoView);
