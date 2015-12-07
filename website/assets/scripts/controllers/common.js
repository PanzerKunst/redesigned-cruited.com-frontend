"use strict";

CR.Controllers.Common = P(function(c) {
    c.menuOpacityTweenDuration = 0.15;

    c.init = function() {
        this._initElements();
        this._initEvents();
    };

    c._initElements = function() {
        this.$window = $(window);

        this.$siteHeader = $("#container").children("header");
        this.$menuBtn = this.$siteHeader.find("article");
        this.$menu = this.$siteHeader.find("#menu");

        this.$scrollingAnchors = $(".main").find("a[href^=#]");
    };

    c._initEvents = function() {
        this.$window.scroll(_.debounce($.proxy(this._onScroll, this), 15));

        this._initMenuEvents();

        this.$scrollingAnchors.click($.proxy(this._scrollToSection, this));
    };

    c._initMenuEvents = function() {
        this.$menuBtn.click($.proxy(this._toggleMenu, this));
    };

    c._onScroll = function() {
        let isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    };

    c._toggleMenu = function() {
        if (this.$siteHeader.hasClass("menu-open")) {
            let tween = TweenLite.to(this.$menu, this.menuOpacityTweenDuration, {opacity: 0, paused: true});

            tween.eventCallback("onComplete", function() {
                this.$menu.css({"display": "none"});
            }.bind(this));

            tween.resume();

            this.$siteHeader.removeClass("menu-open");
        } else {
            this.$menu.css({"display": "flex", "opacity": 0});
            TweenLite.to(this.$menu, this.menuOpacityTweenDuration, {opacity: 1});

            this.$siteHeader.addClass("menu-open");
        }
    };

    c._scrollToSection = function(e) {
        e.preventDefault();

        let $target = $(e.currentTarget);
        let hash = $target.attr("href");
        let sectionId = hash.substring(1);
        let $section = $(document.getElementById(sectionId));

        let scrollYPos = $section.offset().top - this.$siteHeader.height();
        TweenLite.to(window, 1, {scrollTo: scrollYPos, ease: Power4.easeOut});
    };
});
