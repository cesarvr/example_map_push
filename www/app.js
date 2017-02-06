'use strict'

var Backbone = require('backbone');
var AgendaRouter = require('./router/router');
var _ = require('underscore');
var $ = require('jquery');
var FastClick = require('fastclick');

function init(){
  new AgendaRouter();
  Backbone.history.start();
  FastClick.attach(document.body);
}

//this forbid the user to drag the main-container.
$('body, .modal').on('touchmove', function(e){
  e.preventDefault()
})

if(_.isUndefined(window.cordova))
  init();
else
  document.addEventListener('deviceready', init);
