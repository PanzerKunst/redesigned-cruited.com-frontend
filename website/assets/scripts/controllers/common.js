CR.Controllers.Common = P(function(c) {
    c.menuOpacityTweenDuration = 0.15;

    c.init = function() {
        CR.Services.Browser.addUserAgentAttributeToHtmlTag();
        CR.Services.Browser.fixFlexboxIndicatorClass();

        this._initElements();
        this._initEvents();
    };

    c._initElements = function() {
        this.$window = $(window);

        this.$siteHeader = $("#container").children("header");
        this.$menuBtn = this.$siteHeader.find("article");
        this.$menu = this.$siteHeader.find("#menu");
        this.$contentOverlayWhenMenuOpen = this.$siteHeader.find("#content-overlay-when-menu-open");
    };

    c._initEvents = function() {
        this.$window.scroll(_.debounce(this._onScroll.bind(this), 15));

        this._initMenuEvents();
    };

    c._initMenuEvents = function() {
        this.$menuBtn.click(this._toggleMenu.bind(this));
        this.$contentOverlayWhenMenuOpen.click(this._toggleMenu.bind(this));
    };

    c._onScroll = function() {
        const isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    };

    c._toggleMenu = function() {
        if (this.$siteHeader.hasClass("menu-open")) {
            TweenLite.to(this.$menu, this.menuOpacityTweenDuration, {
                opacity: 0,
                onComplete: () => {
                    this.$menu.css({display: "none"});
                }
            });

            this.$siteHeader.removeClass("menu-open");
        } else {
            this.$menu.css({display: this._getMenuDisplayClass(), opacity: 0});
            TweenLite.to(this.$menu, this.menuOpacityTweenDuration, {opacity: 1});

            this.$siteHeader.addClass("menu-open");
        }
    };

    c._getMenuDisplayClass = function() {
        const $html = $("html");

        if ($html.hasClass("no-flexbox") || _.includes($html.data("useragent"), "OS 7_")) {
            return "block";
        }

        return "flex";
    };
});
