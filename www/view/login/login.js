'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var styles = require('../../style/form.css');
var template = require('../../templates/login.html');
var _log = require('../../utils/log')('Login');
var util = require('../../utils/util');

var Login = {

    className: 'login-form',

    events: {
        'keyup input': 'check',
        'click .register': 'register',
        'touchmove': 'ignore',
    },

    ignore: function(e){
      e.preventDefault();
    },

    render: function() {
      this.$el.html(template());

      this.$user = this.$el.find('#user');
      this.$phone = this.$el.find('#phone');
      this.$register = this.$el.find('.register').prop('disabled', true);

      return this;
    },

    show: function() {
      this.trigger('cover:show');
      this.$el.addClass('show');
    },

    close: function(){
      this.trigger('cover:hide');
      this.remove();
    },

    register: function(e){
      e.preventDefault();
      this.model.saveInLocalStorage();
    },

    check: function() {
      this.model.set('user', this.$user.val());
      this.model.set('phone', this.$phone.val());

      if(this.model.isValid())
        this.$register.prop('disabled', false);
    }
};

module.exports = Backbone.View.extend(Login);
