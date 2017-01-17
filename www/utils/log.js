'use strict';

var _log = function(title) {
    return function(message) {
        console.log(title || 'generic', ': ', message, ' ->', Date.now());
    }
};

module.exports = _log; 
