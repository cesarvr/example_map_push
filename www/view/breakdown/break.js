
'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
global.jQuery = $;
require('bootstrap');

var FLAT_TYRE = 1;

var util = require('../../utils/util');
var _log = require('../../utils/log')('breakdown_report');
var _styles = require('../../style/options.css');
var _slider_style = require('../../style/slider.css');
var SVG = require('svg.js');


var screenOne = require('../../templates/breakdown-first.html');
var screenLast = require('../../templates/breakdown-last.html');
var template = require('../../templates/breakdown.html');


/* TODO Debug */
var payload = require('./file.json');


var BreakDown = {

    events: {
        'click .flat-tire': 'flatTires',
        'click .next-step': 'goToLastScreen',
        'click .open-case': 'openCase',
        'click input[type=checkbox] ': 'checkBox',
        'touchend .tires-ammount': 'updateAmmount',
        'touchend .peoples' : 'updatePeopleAmmount',
        'click .tires-ammount': 'updateAmmount',
        'click .peoples' : 'updatePeopleAmmount',
        'change .reportBreak': 'breakReport',
    },

    initialize: function(options) {
        payload = _.extend(payload, options.location)
        this.additionalInfo = {};
        this.user = options.user;

        this.case = {
            towing: false,
            skibox: false,
            replacement: false,
            flat_tire: false
        };
    },

    breakReport: function(evt){
      var caseScenarios = {
        'flat_tyre': "Flat Tyre",
        'stopWorking': "Car Stop Working",
        'no_fuel': "No Fuel",
        'no_break': "Breaks Not Working",
        'engine_issue': "Engine Issue"
      };

      this.caseType = caseScenarios[evt.target.value];

      if(evt.target.value === 'flat_tyre') {
        this.$next.prop('disabled', false);
        this.$tyres_sub.collapse('show');
        this.additionalInfo.flatTyreCount = this.$el.find('.tires-ammount').val();

      }else if(evt.target.value === 'stopWorking') {
        this.$next.prop('disabled', false);
        this.$tyres_sub.collapse('hide');
      }else{
        this.$next.prop('disabled', true);
        this.$tyres_sub.collapse('hide');
      }

    },

    setAdditionalInfo: function(object){
      debugger;
      this.additionalInfo.hasFourWeelDrive = this.getWheelDrive();
      this.additionalInfo.hasRoofBox = this.$el.find('#skibox').val()==='on'?true:false;
      this.additionalInfo.hasTrailer = this.$el.find('#towing').val()==='on'?true:false;

      return _.extend(this.additionalInfo, object);
    },

    getWheelDrive: function(){
      debugger;
      if(_.isUndefined(this.user.profile))
        return false;

      return this.user.profile.wheelDrive.indexOf('4WD') > 0;
    },

    updateAmmount: function(e){
      this.$el.find('.wheels').html('How many flat tires: ' + e.target.value);
    },

    updatePeopleAmmount: function(e){
      this.$el.find('.peoples_msg').html('Amount of people: ' + e.target.value);
    },

    checkBox: function(evt) {
        var key =  evt.target.parentElement.querySelector('input').id;
        var state = false;
        var el = evt.target.parentElement.querySelector('svg');

        if(!_.isUndefined(state = this.case[key] ) ){
          if(state)
            SVG(el).clear()
          else
            SVG(el)
                .path('M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16')
                .fill('#D45C4E');

          this.case[key] = !state;
        }
    },

    render: function() {
        this.$el.html(template());
        this.$body = this.$el.find('.modal-body');

        this.$el.on('transitionend', this.resizeElements.bind(this) );

        return this;
    },

    flatTires: function(evt){
      $(evt.target).tooltip('show');
    },

    resizeElements: function(){
      this.$btnOptions = this.$body.find('.btn-group');
      if(_.isElement(this.$btnOptions[0]))
        util.sparse(this.$btnOptions[0])
    },

    goToScreenOne: function() {
        this.$body.html(screenOne());
        this.$next = this.$el.find('.next-step');
        this.$next.prop('disabled', true);
        this.$tyres_sub = this.$el.find('#collapseExample');
        return this;
    },

    goToLastScreen: function() {
        this.$el.find('.modal-title').html('Additional information.');
        this.$body.html(screenLast());
        return this;
    },

    close: function() {
        this.$el.modal('hide');
    },

    openCase: function() {
      debugger;
        if (!_.isUndefined(window.cordova)) {
          var ncase = _.extend( payload , {
            registrationNumber: this.user.plate,
            phoneNumber: this.user.id,
            breakdownAddress: "Arturo Soria, Madrid 28017",
            caseType: this.caseType,
            breakdownAddress: this.user.address
          });
        this.trigger('open:case', this.setAdditionalInfo(ncase));
      }else{
        this.trigger('workflow:start');
      }


        this.close();
    },

    show: function() {
        this.$el.modal();

        return this;
    }

};

module.exports = Backbone.View.extend(BreakDown);
