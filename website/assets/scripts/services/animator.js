"use strict";

CR.Services.Animator = {
    fadeIn: function($el, params) {
        if (!$el.is(":visible")) {
            var animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : CR.animationDuration.default;
            var alpha = params && _.isNumber(params.opacity) ? params.opacity : 1;

            TweenLite.set($el, {display: "block", alpha: 0});
            TweenLite.to($el, animationDuration, {
                alpha: alpha,
                onComplete: function() {
                    if (params && _.isFunction(params.onComplete)) {
                        params.onComplete();
                    }
                }
            });
        }
    },

    fadeOut: function($el, params) {
        if ($el.is(":visible")) {
            var animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : CR.animationDuration.default;

            TweenLite.to($el, animationDuration, {
                alpha: 0,
                onComplete: function() {
                    $el.hide().css("opacity", 1);
                    if (params && _.isFunction(params.onComplete)) {
                        params.onComplete();
                    }
                }
            });
        }
    }
};
