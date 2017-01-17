var assert = require('chai').assert;
var User = require('../www/model/user');
var Backbone = require('backbone');

Backbone.ajax = function(){ /*console.log('mock ajax->', arguments);*/ };

describe("Testing user model", function() {

    it("Create an model User", function() {
      var user = new User({url: ''}); 
      assert.isObject(user, 'tea selection is an object');
    });

    it("testing validation.", function() {

      var user = new User({url:''}); 
      assert.isObject(user, 'tea selection is an object');

      var evt = Object.create(Backbone.Events);
      
      evt.listenTo(user, 'invalid', function(model, errors){
        assert.equal(errors[0].name, 'Name shouldn\'t be empty.');
        assert.equal(errors[1].email, 'Email shouldn\'t be empty.');
      });

      user.save({name:'', email:''});
    });

    it("testing saving.", function() {
      var model = require('./mock/model.json');

      var user = new User({url:model}); 
      assert.isObject(user, 'tea selection is an object');

      var evt = Object.create(Backbone.Events);
      
      evt.listenTo(user, 'change:name', function(model,attrs){
        assert.equal(attrs, 'cesar');
      });

      evt.listenTo(user, 'change:email', function(model,attrs){
        assert.equal(attrs, 'cvaldezr@redhat.com');
      });

      user.save({name:'cesar', email:'cvaldezr@redhat.com'});
    });


});
