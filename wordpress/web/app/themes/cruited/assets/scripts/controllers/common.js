"use strict";

CR.Controllers.Common = P(CR.Controllers.Base, function(c) {
    c.menuOpacityTweenDuration = 0.3;

    c.init = function() {
        this._initElements();
        this._initEvents();
    };

    c._initElements = function() {
        this.$window = $(window);

        this.$siteHeader = $("header");
        this.$menuBtn = this.$siteHeader.find("button");
        this.$nav = this.$siteHeader.find("nav");

        this.$scrollingAnchors = $(".main").find("a[href^=#]");
    };

    c._initEvents = function() {
        this.$window.scroll(_.debounce($.proxy(this._onScroll, this), 15));

        this._initMenuEvents();

        this.$scrollingAnchors.click(this._scrollToSection);
    };

    c._initMenuEvents = function() {
        this.$menuBtn.click($.proxy(this._toggleMenu, this));

        Breakpoints.on({
            name: "GLOBAL_LARGE_SCREEN_BREAKPOINT",
            matched: $.proxy(this._onLargeScreenBreakpointMatch, this),
            exit: $.proxy(this._onLargeScreenBreakpointExit, this)
        });
    };

    c._onScroll = function() {
        var isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    };

    c._toggleMenu = function() {
        if (this.$siteHeader.hasClass("menu-open")) {
            var tween = TweenLite.to(this.$nav, this.menuOpacityTweenDuration, {opacity: 0, paused: true});

            tween.eventCallback("onComplete", function() {
                this.$nav.css({"display": "none"});
            }.bind(this));

            tween.resume();

            this.$siteHeader.removeClass("menu-open");
        } else {
            this.$nav.css({"display": "block", "opacity": 0});
            TweenLite.to(this.$nav, this.menuOpacityTweenDuration, {opacity: 1});

            this.$siteHeader.addClass("menu-open");
        }
    };

    c._onLargeScreenBreakpointMatch = function() {
        this.$nav.css({"display": "flex", "opacity": 1});
        this.$siteHeader.removeClass("menu-open");
    };

    c._onLargeScreenBreakpointExit = function() {
        this.$nav.css({"display": "none"});
    };

    c._scrollToSection = function(e) {
        e.preventDefault();

        var $target = $(e.currentTarget);
        var hash = $target.attr("href");
        var sectionId = hash.substring(1);
        var $section = $(document.getElementById(sectionId));

        var scrollYPos = $section.offset().top;
        TweenLite.to(window, 1, {scrollTo: scrollYPos, ease: Power4.easeOut});
    };
});
