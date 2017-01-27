'use strict';

var _log = function(title) {
    return function(message) {
        console.log(Date.now()+': ', title || 'generic', ': ', message);
    }
};

module.exports = _log;
