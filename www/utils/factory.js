'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Factory = function(object) {

        return {
            New: function() {

                /* you can mix your objects here. */
                _.extend(object.prototype, Backbone.Events);


                if (arguments.length > 0) {
                    var args = [null];
                    for (var i in arguments) {
                        args.push(arguments[i]);
                    }
                    return new(Function.prototype.bind.apply(object, args));
                } else {
                    return new object(arguments);
                }
            }
        }
    }
    /* to use it just Factory(<you class>).
     * class.New(args) -> and you get back your object + (listenTo, trigger, listenOnce, etc ... )
     */

module.exports = Factory;
