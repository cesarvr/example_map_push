'use strict';

var _ = require('underscore');
var Backbone = require('backbone');



module.exports = function(fn){
  fn.prototype =  _.extend(fn.prototype, Backbone.Events);
  return fn;
};
