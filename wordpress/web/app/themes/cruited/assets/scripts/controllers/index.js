"use strict";

CR.Controllers.Index = P(CR.Controllers.Base, function(c) {
    c.init = function() {
        this._initElements();
        this._initEvents();
    };

    c._initElements = function() {
        this.$sectionsWithBgImages = $("section.img-bg");

        this.$faqItems = $("#faq").find("li");
        this.$faqHeaders = this.$faqItems.children("div");
        this.$faqBodies = this.$faqItems.children("p");
    };

    c._initEvents = function() {
        this.$sectionsWithBgImages.parallax();
        this.$faqHeaders.click($.proxy(this._toggleFaqBody, this));
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
});
