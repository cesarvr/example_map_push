'use strict'

var _ = require('underscore');
var factory = require('../utils/factory');
var $fh = require('fh-js-sdk');
//var push_config = require('../push-config');
var util = require('../utils/util');
var $ = require('jquery');

var mock = {
    step1: "We are in step 1",
    step2: "We are in step 2",
    step3: "We are in step 3",
    step4: "We are in step 4"
};

var Workflow = function(user) {

    if (_.isUndefined(user))
        throw "workflow: need a user object to work.";

    function registration(data) {
        console.log('device: ready to receive push notifications.', user);
    }

    function errorHandler(message) {
        console.log('error: ', message);
    }

    function handleNotification(evt) {

        console.log('message notification->', evt);

        //workflow is setup in the cloud
        var _workflow = evt.payload.workflow;

        this.trigger('workflow:init', _workflow);
        this.trigger('step:change', evt.payload.key);

        if (evt.payload.key === 'COMPLETED')
            this.trigger('step:finish', evt.payload.key);
    }

    this.startWorkflow = function(obj) {

        if (util.isCordovaEnable()) {
            this.trigger('workflow:init', mock);
            this.mockLongPulling(mock);
        }
    };


    this.createNewWorkflow = function(caseDetails) {

        if (!_.isUndefined(window.cordova)) {

            $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    url: "http://your_url.com/case",
                    data: JSON.stringify(caseDetails)
                })
                .done(function(msg) {
                    //  alert("Help is on the way" + JSON.stringify(msg));
                });
        } else {
            console.log('DEBUG MODE: mocking workflow');
        }
    };

    //Mocking for Debuging purposes.
    this.mockLongPulling = function(obj) {

        console.log(obj);
        var x = 1;
        var clock = setInterval(function() {
            var cnt = 0;
            x++;
            this.once = false;
            Object.keys(obj).forEach(function(key) {
                cnt++;
                if (cnt === x)
                    this.trigger('step:change', key);

                if (x === Object.keys(obj).length && !this.once) {
                    clearInterval(clock);
                    this.once = true;
                    this.trigger('step:finish', key);
                }
            }.bind(this));
        }.bind(this), 11000)

        this.trigger('step:change', Object.keys(obj)[0]);
    };

    // Register to the push notification server using Feedhenry Aerogear plugin.
    if (util.isCordovaEnable())
        $fh.push( handleNotification.bind(this),
                  registration,
                  errorHandler,
                  _.extend({
                      alias: user.id
                  }, 
                  push_config));


};

module.exports = factory(Workflow);
