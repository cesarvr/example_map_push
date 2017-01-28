'use strict';

var _ = require('underscore');
var appendEvents = require('../../utils/factory');

var MapMarkers = function(Map){

  this.update = function(obj){

    console.log('MapMarkers----> ' , obj);
  };

  this.addMarkers = function(obj){
    debugger;
     var marker = new google.maps.Marker(obj.position);
     marker.setAnimation(google.maps.Animation.DROP);
     marker.setPosition(position);
     marker.setMap(Map);
  };
};

module.exports = appendEvents(MapMarkers);
