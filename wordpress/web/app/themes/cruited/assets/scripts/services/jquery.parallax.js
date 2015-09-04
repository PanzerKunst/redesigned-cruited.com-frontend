"use strict";

$.fn.parallax = function(bgPosX, parallaxSpeed) {
    bgPosX = bgPosX || "50%";
    parallaxSpeed = parallaxSpeed || 3;

    var $window = $(window);
    var $elements = $(this);

    function update() {
        var scrollPos = $window.scrollTop();

        $elements.each(function() {
            var $el = $(this);
            var elementPosY = $el.offset().top;

            if (scrollPos >= elementPosY) {
                var newParallaxPosition = -Math.round((scrollPos - elementPosY) / parallaxSpeed) + "px";
                $el.css("backgroundPosition", bgPosX + " " + newParallaxPosition);
            }
        });
    }

    if (!Modernizr.touch) {
        $window.scroll(update).resize(update);
    }
};
