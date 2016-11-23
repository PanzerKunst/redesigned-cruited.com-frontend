import {animationDurations} from "../global";

export function fadeIn($el, params) {
    if (!$el.is(":visible")) {
        const animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : animationDurations.default;
        const alpha = params && _.isNumber(params.opacity) ? params.opacity : 1;

        TweenLite.set($el, {display: "block", alpha: 0});
        TweenLite.to($el, animationDuration, {
            alpha,
            onComplete() {
                if (params && _.isFunction(params.onComplete)) {
                    params.onComplete();
                }
            }
        });
    }
}

export function fadeOut($el, params) {
    if ($el.is(":visible")) {
        const animationDuration = params && _.isNumber(params.animationDuration) ? params.animationDuration : animationDurations.default;

        TweenLite.to($el, animationDuration, {
            alpha: 0,
            onComplete() {
                $el.hide().css("opacity", 1);
                if (params && _.isFunction(params.onComplete)) {
                    params.onComplete();
                }
            }
        });
    }
}

export function enableLoading($el, text) {
    if ($el.prop("tagName") === "BUTTON") {
        const btn = $el[0];
        const defaultText = btn.innerHTML;
        const loadingText = text || defaultText;

        $el.data("defaultText", defaultText);
        $el.prop("disabled", true);

        btn.innerHTML = `<i class="fa fa-spinner fa-pulse"></i>${loadingText}`;
    }
}

export function disableLoading($el) {
    if ($el.prop("tagName") === "BUTTON") {
        $el.html($el.data("defaultText"));
        $el.prop("disabled", false);
    }
}
