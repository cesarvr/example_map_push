'use strict'

var _ = require('underscore');
var factory = require('../utils/factory');
var $fh = require('fh-js-sdk');

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
        } else {
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
                  // Handle server response.
                });
        } else {
            console.log('DEBUG MODE: mocking workflow');
        }
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

util.extendWithBackboneEvents(Workflow);

module.exports = Workflow;
