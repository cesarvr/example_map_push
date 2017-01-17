var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
global.jQuery = $;
require('bootstrap');

var _slider_style = require('../../style/slider.css');
var styles = require('../../style/rate.css');
var template = require('../../templates/rate.html');

var RateView = {

    events: {
        'click .sendRate': 'sendRate',
        'change .rate': 'update',
        'blur .rate': 'update',
        'click .closeRate': 'closeRate',
    },

    update: function(evt){
      var x = evt.target.value;

      this.updateRate(parseInt(x));
    },

    updateRate: function(value){
      var rates = ['Poor', 'Not Bad', 'Good', 'Very Good', 'Excellent'];

      this.$el.find('.exp').html(rates[(value -1)]);
    },

    render: function() {
        this.$el.html(template());
        this.$body = this.$el.find('.modal-body');


        return this;
    },

    sendRate: function() {
      var self = this;
        $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                url: "https:/your_cloud.com/rate",
                data: JSON.stringify({ referenceId: '11111111111111111111111111111110',
                                       rating: this.$el.find('.rate').val()
                                     })

            })
            .done(function(msg) {
              console.log('all good');
            });

            self.closeRate();
    },

    closeRate: function() {
        this.$el.modal('hide');
    },

    show: function() {
        this.$el.modal('show');
        var rate = this.$el.find('.rate').val(5);
        this.updateRate(parseInt(rate.val()));
        return this;
    }
};

module.exports = Backbone.View.extend(RateView);
