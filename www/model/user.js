'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var User = Backbone.Model.extend({

  initialize: function(){
    var userDB = localStorage.getItem('user');

    if(!_.isEmpty(userDB)) {
      this.attributes = JSON.parse(userDB);
    }else
      console.log('User not found...');
  },

  checkCredentials: function(){
    if(_.isEmpty(this.attributes) || _.isEmpty(this.attributes.phone) )
      this.trigger('user:not_found', this);
    else
      this.trigger('user:found', this);
  },

  saveInLocalStorage: function(){
    if(this.isValid()) {
      delete this.attributes.id;
      var userDB = localStorage.setItem('user', JSON.stringify(this.attributes));
      this.checkCredentials();
    }
  },

  validate: function(attrs){
    debugger;
    delete attrs.id;
    var empty = _.values(attrs).filter(_.isEmpty);

    return empty.length > 0;
  },

});


module.exports = new User();
