"use strict";

$.fn.parallax = function(posX, speed) {
    var bgPosX = posX || "50%";
    var parallaxSpeed = speed || 3;

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

        // To have a smoother parallax on the hero image
        $window.mousewheel(function(e) {
            e.preventDefault();

            var scrollTop = $window.scrollTop();
            var scrollYPos = scrollTop - e.deltaY * 400;

            TweenLite.to(window, CR.defaultAnimationDuration, {scrollTo: scrollYPos, ease: Power1.easeOut});
        });
    }
};
