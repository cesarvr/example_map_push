'use strict';

var _ = require('underscore');
var $ = require('jquery');
var appendEvents = require('../../utils/factory');
var _log = require('../../utils/log')('Marker');

var cache = {};
var MapMarkers = function(Map){

  function copyPosition(p1, p2){
    p1.position = p2.position;
  }

  function showUserInfo(driverName){
    var driver = cache[driverName];
    var infoWindow = getInstance(driverName, 'InfoWindow');

    infoWindow.setContent($('<div class=\"info\"></div>').html(driverName).html());
    infoWindow.open(Map, driver.Marker);
  };

  function getInstance(key, objName){
    if(!cache[key].hasOwnProperty(objName)){
      cache[key][objName] = new google.maps[objName]();
      return cache[key][objName];
    }else
      return cache[key][objName];
  };

  function drawAll(){
    Object.keys(cache).forEach(function(key){
      addMarkers(key, cache[key]);
      showUserInfo(key);
    },this);
  };

  function addMarkers(key, mark){
     _log('marking -> ' + key);

     var marker = new google.maps.Marker();
     marker.setAnimation(google.maps.Animation.DROP);
     marker.setPosition(mark.position);
     marker.setMap(Map);

     return marker;
  };


  function diffUpdate(drivers){
    for(var key in drivers) {
      if( !_.isEqual(drivers[key].position, cache[key].position) ){
        copyPosition(cache[key], drivers[key]);
        addMarkers(key, drivers[key]);
      }
    }
  };

  this.setOrigin = function(driverName){
    _log('setting:origin -> '+ driverName);
    var driver = cache[driverName];
    driver.Marker.setIcon(require("../../assets/user_1.svg"));
  };


  this.centerAt = function(driverName, zoom){
    _log('centering -> '+ driverName);
    var driver = cache[driverName];
    Map.setCenter(driver.position);
  };


  this.user = function(username, position){
    cache[username] = addMarkers
  }



  this.update = function(drivers){

    if(_.isEmpty(cache)){
      cache = drivers;
      drawAll();
    }else{
      diffUpdate(drivers);
    }
  };




};

module.exports = appendEvents(MapMarkers);
