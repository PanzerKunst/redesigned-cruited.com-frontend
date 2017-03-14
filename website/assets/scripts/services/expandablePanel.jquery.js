(function($) {
    $.fn.makeExpandable = function() {
        $(this).each(function(i, el) {
            const $el = $(el);
            const $allExpandablePanels = $el.parent().children(".expandable-panel");
            const $allExpandablePanelBodies = $allExpandablePanels.children("div");

            function _expandBody($body) {
                $body.css({display: "block", opacity: 0});
                TweenLite.to($body, CR.animationDurations.default, {opacity: 1});
            }

            function _toggleBody(e) {
                const $panel = $(e.currentTarget).parent();
                const isOpen = $panel.hasClass("expanded");

                // We close all open
                $allExpandablePanels.removeClass("expanded");
                $allExpandablePanelBodies.hide();

                if (!isOpen) {
                    _expandBody($panel.children("div"));
                    $panel.addClass("expanded");
                }
            }

            $el.children("header").click(_toggleBody);
        });
    };
}(jQuery));


(function($) {
    $.fn.makeAltExpandable = function() {
        $(this).each(function(i, el) {
            const $el = $(el);
            const $allExpandablePanels = $el.parent().children(".expandable-panel.alt");
            const $allExpandablePanelBodies = $allExpandablePanels.children("div");

            function _expandBody($body) {
                $body.css({display: "block", opacity: 0});
                TweenLite.to($body, CR.animationDurations.default, {opacity: 1});
            }

            function _expandBodyIfCollapsed(e) {
                const $panel = $(e.currentTarget).parent();
                const isOpen = $panel.hasClass("expanded");

                if (!isOpen) {

                    // We close all open
                    $allExpandablePanels.removeClass("expanded");
                    $allExpandablePanelBodies.hide();

                    _expandBody($panel.children("div"));
                    $panel.addClass("expanded");
                }
            }

            $el.children("header").click(_expandBodyIfCollapsed);
        });
    };
}(jQuery));
