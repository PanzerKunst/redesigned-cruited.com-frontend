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

        this.$mainPanel = $(".main");
        this.$scrollingAnchors = this.$mainPanel.find("a[href^=#]");
    };

    c._initEvents = function() {
        this.$window.scroll(_.debounce($.proxy(this._onScroll, this), 15));

        // TODO this.$menuBtn.click($.proxy(this._toggleMenu, this));

        this.$scrollingAnchors.click(this._scrollToSection);
    };

    c._onScroll = function() {
        var scrollPos = this.$window.scrollTop();

        var isScrolledDownEnough = scrollPos > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);

        this.scrollPos = scrollPos;
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
        TweenLite.to(window, CR.defaultAnimationDuration, {scrollTo: scrollYPos, ease: Power4.easeOut});
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
