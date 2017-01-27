'use strict';

var _ = require('underscore');

function DetectCordova(){
  var cordova = !_.isUndefined(window.cordova);
  return function(){
    return cordova;
  }
};

module.exports = {
  extendWithBackboneEvents: function(functor){
    return functor.prototype = _.extend(functor.prototype, Backbone.Events);
  },

  defer: function(){
    var tmr = null;
    return function(functor,  milliseconds){

      if(tmr === null)
      clearTimeout(this.timer);

      this.timer = setTimeout(function(){
        functor();
        tmr = null;
      }.bind(this), milliseconds);
    }
  }(),

  isCordovaEnable: DetectCordova()
}
