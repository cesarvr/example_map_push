'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var styles = require('../../style/login.css');

var template = require('../../templates/login.html');

var Login = {

    className: 'login-form',

    events: {
        'change input': 'check',
        'click .register': 'register'
    },

    initialize: function() {

        this.listenTo(this.model, 'invalid', this.validate);
        this.listenTo(this.model, 'save', function(){
          debugger;
          console.log('boom _???')
        });

        this.on('login:correct', function() {
            this.$el.modal('hide');
        }, this);

        this.on('open:dialog', this.open, this);
    },

    render: function() {
        this.$el.html(template());

        this.$user = this.$el.find('#user');
        this.$phone = this.$el.find('#phone');
        this.$register = this.$el.find('.register').prop('disabled', true);

        return this;
    },

    validate:function(){
      console.log('boom')
    },

    show: function() {
      this.$el.addClass('show');
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
