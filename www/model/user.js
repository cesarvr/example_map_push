'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var _log = require('../utils/log')('user-model');

var User = {

  defaults: {
    user: '',
    phone: ''
  },

  initialize: function(){
    var userDB = localStorage.getItem('user');

    if(!_.isEmpty(userDB))
      this.attributes = JSON.parse(userDB);
    else
      _log('User not found...');
  },

  checkCredentials: function(){
    var invalid = _.values(this.attributes).filter(_.isEmpty).length > 0;

    if(invalid)
      this.trigger('user:not_found', this);
    else
      this.trigger('user:found', this);
  },

  saveInLocalStorage: function(){
    if(this.isValid()) {
      var userDB = localStorage.setItem('user', JSON.stringify(this.attributes));
      this.checkCredentials();
    }
  },

  validate: function(attrs) {
    delete attrs.id;
    var invalid = _.values(attrs).filter(_.isEmpty).length > 0;

    return invalid;
  }
};

var UserModel = Backbone.Model.extend(User);

module.exports = new UserModel();
