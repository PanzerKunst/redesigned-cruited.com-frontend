import {animationDurations} from "../global";
import Browser from "../services/browser";

const CommonController = {
    init() {
        Browser.addUserAgentAttributeToHtmlTag();
        Browser.fixFlexboxIndicatorClass();

        this._initElements();
        this._initEvents();
    },

    _initElements() {
        this.$window = $(window);

        this.$siteHeader = $("#container").children("header");
        this.$menuBtn = this.$siteHeader.find("article");
        this.$menu = this.$siteHeader.find("#menu");
        this.$contentOverlayWhenMenuOpen = this.$siteHeader.find("#content-overlay-when-menu-open");
    },

    _initEvents() {
        this.$window.scroll(_.debounce(() => this._onScroll(), 15));
        this._initMenuEvents();
    },

    _initMenuEvents() {
        this.$menuBtn.click(this._toggleMenu.bind(this));
        this.$contentOverlayWhenMenuOpen.click(this._toggleMenu.bind(this));
    },

    _onScroll() {
        const isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    },

    _toggleMenu() {
        if (this.$siteHeader.hasClass("menu-open")) {
            TweenLite.to(this.$menu, animationDurations.short, {
                opacity: 0,
                onComplete: () => {
                    this.$menu.css({display: "none"});
                }
            });

            this.$siteHeader.removeClass("menu-open");
        } else {
            this.$menu.css({display: this._getMenuDisplayClass(), opacity: 0});
            TweenLite.to(this.$menu, animationDurations.short, {opacity: 1});

            this.$siteHeader.addClass("menu-open");
        }
    },

    _getMenuDisplayClass() {
        const $html = $("html");

        if ($html.hasClass("no-flexbox") || _.includes($html.data("useragent"), "OS 7_")) {
            return "block";
        }

        return "flex";
    }
};

Object.create(CommonController).init();
