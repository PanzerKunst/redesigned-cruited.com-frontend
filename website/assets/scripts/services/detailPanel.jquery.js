CR.DetailPanel = {
    $list: null,
    $contentPanels: [],

    // Static

    // Instance
    init() {
        this.$listItems = this.$list.children();

        _.forEach(this.$listItems, (li, i) => {
            const $li = $(li);

            $li.click(() => this._showContent($li, i));
        });

        this._showFirst();
    },

    _showContent($li, i) {
        if (!$li.hasClass("expanded")) {
            this.$listItems.removeClass("expanded");
            this.$contentPanels.removeClass("expanded");
            this.$contentPanels.hide();

            const $contentPanel = $(this.$contentPanels.get(i));

            $contentPanel.css({display: "block", opacity: 0});
            TweenLite.to($contentPanel, CR.animationDurations.default, {opacity: 1});

            $li.addClass("expanded");
            $contentPanel.addClass("expanded");
        }
    },

    _showFirst() {
        const $li = $(this.$listItems.get(0));
        const $contentPanel = $(this.$contentPanels.get(0));

        $contentPanel.show();

        $li.addClass("expanded");
        $contentPanel.addClass("expanded");
    }
};
