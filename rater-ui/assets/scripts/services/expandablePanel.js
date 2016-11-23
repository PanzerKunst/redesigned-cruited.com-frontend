import {animationDurations} from "../global";

export function makeExpandable($panels) {
    _.forEach($panels, panel => {
        const $el = $(panel);
        const $allExpandablePanels = $el.parent().children(".expandable-panel");
        const $allExpandablePanelBodies = $allExpandablePanels.children("div");

        const _expandBody = $body => {
            $body.css({display: "block", opacity: 0});
            TweenLite.to($body, animationDurations.default, {opacity: 1});
        };

        const _toggleBody = e => {
            const $panel = $(e.currentTarget).parent();
            const isOpen = $panel.hasClass("expanded");

            // We close all open
            $allExpandablePanels.removeClass("expanded");
            $allExpandablePanelBodies.css({display: "none"});

            if (!isOpen) {
                _expandBody($panel.children("div"));
                $panel.addClass("expanded");
            }
        };

        $el.children("header").click(_toggleBody);
    });
}
