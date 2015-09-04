"use strict";

CR.Controllers.Index = P(CR.Controllers.Base, function(c) {
    c.init = function() {
        this._initElements();
        this._initEvents();
    };

    c._initElements = function() {
        this.$window = $(window);

        this.$siteHeader = $(".banner");
        /* TODO this.$menuBtnWrapper = this.$siteHeader.children("#menu-btn-wrapper");
         this.$menuBtn = this.$menuBtnWrapper.children(); */

        this.$sectionsWithBgImages = $("section.img-bg");

        this.$mainPanel = $(".main");
        this.$scrollingAnchors = this.$mainPanel.find("a[href^=#]");

        this.$faqItems = $("#faq").find("li");
        this.$faqHeaders = this.$faqItems.children("div");
        this.$faqBodies = this.$faqItems.children("p");
    };

    c._initEvents = function() {
        this.$window.scroll(_.debounce($.proxy(this._onScroll, this), 15));

        this.$sectionsWithBgImages.parallax();

        // TODO this.$menuBtn.click($.proxy(this._toggleMenu, this));

        this.$scrollingAnchors.click(this._scrollToSection);

        this.$faqHeaders.click($.proxy(this._toggleFaqBody, this));
    };

    c._onScroll = function() {
        var scrollPos = this.$window.scrollTop();

        var isScrolledDownEnough = scrollPos > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);

        this.scrollPos = scrollPos || 0;
    };

    c._toggleMenu = function() {
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

    c._toggleFaqBody = function(e) {
        var $target = $(e.currentTarget);
        var $faqItem = $target.parent();
        var $faqBody = $faqItem.children("p");

        var isOpen = $faqItem.hasClass("expanded");

        // We close all open
        this.$faqItems.removeClass("expanded");
        this.$faqBodies.css({"display": "none"});

        if (!isOpen) {
            this._expandFaqBody($faqBody);
            $faqItem.addClass("expanded");
        }
    };

    c._expandFaqBody = function($faqBody) {
        $faqBody.css({"display": "block", "opacity": 0});
        TweenLite.to($faqBody, CR.defaultAnimationDuration, {opacity: 1});
    };

    c._isScrollUp = function(scrollPos) {
        var scrollPosition = scrollPos || this.$window.scrollTop();
        return scrollPosition < this.scrollPos;
    };

    c._isScrollDown = function(scrollPos) {
        var scrollPosition = scrollPos || this.$window.scrollTop();
        return scrollPosition > this.scrollPos;
    };
});
