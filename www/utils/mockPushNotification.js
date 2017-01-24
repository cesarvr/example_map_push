'use strict';

module.exports = function(obj, backboneObject) {

    console.log(obj);
    var x = 1;
    var clock = setInterval(function() {
        var cnt = 0;
        x++;
        this.once = false;
        Object.keys(obj)
              .forEach(function(key) {
            cnt++;
            if (cnt === x)
                backboneObject.trigger('step:change', key);

            if (x === Object.keys(obj).length && !this.once) {
                clearInterval(clock);
                this.once = true;
                backboneObject.trigger('step:finish', key);
            }
        }.bind(this));
    }.bind(this), 11000)

    backboneObject.trigger('step:change', Object.keys(obj)[0]);
};
