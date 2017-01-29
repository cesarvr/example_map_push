'use strict'

var _ = require('underscore');
var factory = require('../utils/factory');
var util = require('../utils/util');
var _log = require('../utils/log')('location');

var DEBUG = true;

var Location = function() {
    var self = this;

    var lastKnowPosition = {};

    function rndi(min,max)
    {
      return (Math.random() * (max - min) + min).toFixed(5)
    }

    this.getLocationAPI = function() {

        if ("geolocation" in navigator) {
            this.geo = navigator.geolocation;
            return this;
        }

        alert('Can\'t access the GPS in the device.');
        return this;
    };

    this.getLocation = function() {
        _log('requesting location');

        self.trigger('geolocation:working');

        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {};
          if(DEBUG){
            pos = {
                lat: position.coords.latitude  + parseFloat(rndi(0,0.04)),
                lng: position.coords.longitude + parseFloat(rndi(0,0.06))
            };
          }else{
            pos = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
           };
          }

            lastKnowPosition.latitude = position.coords.latitude;
            lastKnowPosition.longitude = position.coords.latitude;

            _log('location found: ' + JSON.stringify(pos));
            self.trigger('geolocation:position', pos);
        });
    };

    this.track = function(){
      self.trackTimer =  setInterval(this.getLocation, 15000);
    };

    this.stopTracking = function(){
      clearInterval(self.trackTime);
    };

    this.getLastKnowPosition = function() {
        return lastKnowPosition;
    };
};

util.extendWithBackboneEvents(Location);

module.exports = new Location();
