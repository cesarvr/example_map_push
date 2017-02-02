'use strict';
var socketIO = require('socket.io-client');
var _ = require('underscore');
var appendEvents = require('../utils/factory');
var _log = require('../utils/log')('DriversSocket');

var WEBSOCKET_URL = 'http://localhost:8001'

var Driver = function(User) {
    var self = this,
        cloud = socketIO(WEBSOCKET_URL);

    /*
      This method get call, each time there is a change in the cloud.
    */
    function update(obj) {
        _log('cloud updates' + obj);
        self.trigger('update:drivers', obj);
    }

    function _prepareRequest(data) {
        return {
            user: User.get('user'),
            position: data
        };
    };

    this.publishLocation = function(location) {
        _log('publishing location: ' + location);
        cloud.emit('update:location', _prepareRequest(location));
    };

    this.getDriverStatus = function(){
      cloud.emit('driver:status', {});
    };

    cloud.on('update:location', update);
};

module.exports = appendEvents(Driver);
