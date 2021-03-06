"use strict";

CR.Controllers.Common = P(CR.Controllers.Base, function(c) {
    c.menuOpacityTweenDuration = 0.3;

    c.init = function() {
        this._initElements();
        this._initEvents();

        this.$sectionsWithBgImages.parallax();
        this._initPageHeaderBackground();

        this._removeEmptyParagraphTagsAddedByTheWpEditor();
        this._initSmartHeightOfYouCanBookMeIframes();
    };

    c._initElements = function() {
        this.$window = $(window);

        this.$siteHeader = $(".banner");
        this.$menuBtn = this.$siteHeader.find("button");
        this.$smallAndMediumScreenNav = this.$siteHeader.children("#small-medium-screen-menu").children("nav");

        this.$sectionsWithBgImages = $(".img-bg");

        this.$pageHeader = $("body.page .page-header").add("body.single article.post > header");

        this.$scrollingAnchors = $(".main").find("a[href^=#]");
    };

    c._initEvents = function() {
        this.$window.scroll(_.debounce($.proxy(this._onScroll, this), 15));
        this._initMenuEvents();
        this.$scrollingAnchors.click($.proxy(this._scrollToSection, this));
    };

    c._removeEmptyParagraphTagsAddedByTheWpEditor = function() {
        $("p:empty").remove();
    };

    c._initMenuEvents = function() {
        this.$menuBtn.click($.proxy(this._toggleMenu, this));
    };

    c._onScroll = function() {
        var isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    };

    c._toggleMenu = function() {
        if (this.$siteHeader.hasClass("menu-open")) {
            TweenLite.to(this.$smallAndMediumScreenNav, this.menuOpacityTweenDuration, {
                opacity: 0,
                onComplete: function() {
                    this.$smallAndMediumScreenNav.css({"display": "none"});
                }.bind(this)
            });

            this.$siteHeader.removeClass("menu-open");
        } else {
            this.$smallAndMediumScreenNav.css({"display": "block", "opacity": 0});
            TweenLite.to(this.$smallAndMediumScreenNav, this.menuOpacityTweenDuration, {opacity: 1});

            this.$siteHeader.addClass("menu-open");
        }
    };

    c._initPageHeaderBackground = function() {
        var dataUrlBgImgLarge = this.$pageHeader.data("urlBgImgLarge");
        var dataUrlBgImgSmall = this.$pageHeader.data("urlBgImgSmall");

        if (!CR.Services.Browser.isLargeScreen()
            && !window.matchMedia("(min-resolution: 2dppx)").matches
            && dataUrlBgImgSmall) {

            this.$pageHeader.css("background-image", "url(" + dataUrlBgImgSmall + ")");
        } else if (dataUrlBgImgLarge) {
            this.$pageHeader.css("background-image", "url(" + dataUrlBgImgLarge + ")");
        } else {
            this.$pageHeader.addClass("no-img");
        }
    };

    c._scrollToSection = function(e) {
        e.preventDefault();

        var $target = $(e.currentTarget);
        var hash = $target.attr("href");
        var sectionId = hash.substring(1);
        var $section = $(document.getElementById(sectionId));

        var scrollYPos = $section.offset().top - this.$siteHeader.height();
        TweenLite.to(window, 1, {scrollTo: scrollYPos, ease: Power4.easeOut});
    };

    c._initSmartHeightOfYouCanBookMeIframes = function() {
        if (window.addEventListener) {
            window.addEventListener("message", function(e) {
                if (/^https:\/\/\w+\.youcanbook\.me$/.test(e.origin)) {
                    document.getElementById("ycbmiframecruited").style.height = e.data + "px";
                }
            }, false);
        }
    };
});
