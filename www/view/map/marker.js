'use strict';

var _ = require('underscore');
var $ = require('jquery');
var appendEvents = require('../../utils/factory');
var _log = require('../../utils/log')('Marker');

var cache = {};
var userMark = {};
var InfoView = null;

var MapMarkers = function(Map, _InfoView) {

    InfoView = _InfoView || _.identity;

    //Remove the user from this device from the tracking list.
    function removeUser(User, data) {
        var userName = User.get('user');

        if (!_.isUndefined(data[userName])) {
            delete data[userName];
        }

        return data;
    };

    function createDriversMarker(memo, data, driverName) {
        console.log('data->', data);

        memo[driverName] = {
            data: {
                position: data,
                marker: createMark(data.position)
            }
        };

        return memo;
    };

    function createMark(position) {
        var marker = new google.maps.Marker();

        marker.setAnimation(google.maps.Animation.DROP);
        marker.setPosition(position);
        marker.setMap(Map);

        return marker;
    };

    this.setOrigin = function(driverName) {
        _log('setting:origin -> ' + driverName);
        var driver = cache[driverName];
    };

    this.markDriversInMap = function(user, drivers) {
        var _drivers = removeUser(user, drivers);
        cache = _.reduce(_drivers, createDriversMarker, {});
    };

    this.markUserInMap = function(user, position) {

        userMark.marker = createMark(position);
        userMark.userInfo = user;

        Map.setCenter(position);

        userMark
            .marker
            .setIcon(require("../../assets/user_1.svg"));

        userMark.infoWindow =  new InfoView({
          user: user, 
          marker: userMark.marker
        })

        userMark.infoWindow.updateAddress();
    };

    this.getMap = function() {
        return Map;
    };

    this.update = function(drivers) {
        _log('cloud update [drivers] ->' + JSON.stringify(drivers));
    };
};

module.exports = appendEvents(MapMarkers);
