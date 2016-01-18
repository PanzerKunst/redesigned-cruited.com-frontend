"use strict";

(function($) {
    $.fn.makeExpandable = function() {
        $(this).each(function() {
            let $el = $(this);
            let $allExpandablePanels = $el.parent().children(".expandable-panel");
            let $allExpandablePanelBodies = $allExpandablePanels.children("div");

            function _expandBody($body) {
                $body.css({"display": "block", "opacity": 0});
                TweenLite.to($body, CR.animationDurations.default, {opacity: 1});
            }

            function _toggleBody(e) {
                let $panel = $(e.currentTarget).parent();
                let isOpen = $panel.hasClass("expanded");

                // We close all open
                $allExpandablePanels.removeClass("expanded");
                $allExpandablePanelBodies.css({"display": "none"});

                if (!isOpen) {
                    _expandBody($panel.children("div"));
                    $panel.addClass("expanded");
                }
            }

            $el.children("header").click(_toggleBody);
        });
    };
}(jQuery));
