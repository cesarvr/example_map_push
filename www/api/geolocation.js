'use strict'

var _ = require('underscore');
var factory = require('../utils/factory');
var util = require('../utils/util');
var _log = require('../utils/log')('location');

var Location = function() {
    var self = this;

    var lastKnowPosition = {};

    this.getLocationAPI = function() {

        if ("geolocation" in navigator) {
            this.geo = navigator.geolocation;
            return this;
        }

        swal('Can\'t access the GPS in the device.');
        return this;
    };

    this.getLocation = function() {
        _log('requesting location');

        this.trigger('geolocation:working');

        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            lastKnowPosition.latitude = position.coords.latitude;
            lastKnowPosition.longitude = position.coords.latitude;

            _log('location found: ' + JSON.stringify(pos));
            self.trigger('geolocation:position', pos);
        });
    };

    this.getLastKnowPosition = function() {
        return lastKnowPosition;
    };
};

util.extendWithBackboneEvents(Location);

module.exports = new Location();
