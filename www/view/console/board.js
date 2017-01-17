'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var util = require('../../utils/util')

/* Load CSS */
require('../../style/workflow.css');
require('../../style/breadcrumb.css');

var svgBreadCrumbTmpl = require('../../templates/breadcumb.html');

var BOARD_MODE = 2;
var NOTIFY_MODE = 1;

var BoardView = Backbone.View.extend({
  className: 'console hide',

  events: {
    'click':'switchMode'
  },

  initialize: function(){
    this.mode = BOARD_MODE;
  },

  addWorkflow: function(_workflow){
    this.$el.removeClass('hide');
    this.workflow = _workflow;
  },

  label: function(msg, cssClazz){
    return $('<p></p>')
    .addClass(cssClazz)
    .html(msg);
  },

  load: function(workflow, create){
    var elements = [];
    Object.keys(workflow)
          .forEach(function(key){
          elements.push( create(workflow[key], key) );
    }, this);

    return elements;
  },

  dismiss: function(){
    var self = this;
    self.$el.addClass('hide');
  },

  updateStep: function(workflowStep){
    if(this.mode === BOARD_MODE)
      this.updateBoardMode(workflowStep);
    else
      this.updateNotifyMode(workflowStep);
  },

  updateBoardMode: function(workflowStep){
    this.$el.find('p').removeClass('active');
    this.$el.find('circle').removeClass('current');
    this.$el.find('p.'+workflowStep).addClass('active');
    this.$el.find('circle.' + workflowStep).addClass('current');

    this.saveStepInformation(workflowStep);
  },

  updateNotifyMode: function(workflowStep){
    this.mode = NOTIFY_MODE;

    this.notifyMode(this.workflow[workflowStep], workflowStep);
  },

  saveStepInformation: function(workflowStep){
    this.currentStep = workflowStep;
    this.currentStepText = this.$el.find('p.'+workflowStep).html();
  },

  switchMode: function() {
    this.reset();

    if(this.mode === BOARD_MODE){
      this.mode = NOTIFY_MODE;
      this.notifyMode();
    }else{
      this.$el.removeClass('notify');
      this.mode = BOARD_MODE;
      this.boardRender(this.workflow);
      this.updateStep(this.currentStep);
    }
  },

  boardRender: function(workflow) {
    this.$el.html(svgBreadCrumbTmpl());

    var $lists = this.load(workflow, this.label);
    this.$el.append($lists);
  },

  breadCrumb: function(workflow){

    var $father = $('<ul></ul>');
    var $lists = this.load(workflow, this.li);

    this.$el.addClass('breadcrumb');

    $father.html($lists);
    this.$el.html($father);
  },

  reset: function(){
    this.$el.removeClass('breadcrumb');
  },

  notifyMode: function(stepDescription, stepAlias) {
    this.$el.addClass('notify');
    this.$el.html('');
    var $txt = this.label(stepDescription || this.currentStepText,
                          stepAlias       || this.currentStep);


    if(!_.isEmpty(stepAlias))
      this.saveStepInformation(stepAlias);

    this.$el
    .html($txt)
    .find('.' + this.currentStep)
    .addClass('active');
  },

  render: function(){
  }

});



module.exports = BoardView;
