(function () {
    'use strict';

    // Polyfill for window.performance.now()
    window.performance = (window.performance || {
        'now': function now() {
            return Date.now();
        }
    });
}());
