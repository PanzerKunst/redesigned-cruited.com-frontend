"use strict";

(function($) {
    $.fn.fadeIn = function(params) {
        if (!this.is(":visible")) {
            const animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : CR.animationDurations.default;
            const alpha = params && _.isNumber(params.opacity) ? params.opacity : 1;

            TweenLite.set(this, {display: "block", alpha: 0});
            TweenLite.to(this, animationDuration, {
                alpha: alpha,
                onComplete: function() {
                    if (params && _.isFunction(params.onComplete)) {
                        params.onComplete();
                    }
                }
            });
        }
    };

    $.fn.fadeOut = function(params) {
        if (this.is(":visible")) {
            const animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : CR.animationDurations.default;

            TweenLite.to(this, animationDuration, {
                alpha: 0,
                onComplete: function() {
                    this.hide().css("opacity", 1);
                    if (params && _.isFunction(params.onComplete)) {
                        params.onComplete();
                    }
                }.bind(this)
            });
        }
    };

    $.fn.enableLoading = function(text) {
        if (this.prop("tagName") === "BUTTON") {
            const btn = this[0];
            const defaultText = btn.innerHTML;
            const loadingText = text || defaultText;

            this.data("defaultText", defaultText);
            this.prop("disabled", true);

            btn.innerHTML = "<i class=\"fa fa-spinner fa-pulse\"></i>" + loadingText;
        }
    };

    $.fn.disableLoading = function() {
        if (this.prop("tagName") === "BUTTON") {
            this.html(this.data("defaultText"));
            this.prop("disabled", false);
        }
    };
}(jQuery));
