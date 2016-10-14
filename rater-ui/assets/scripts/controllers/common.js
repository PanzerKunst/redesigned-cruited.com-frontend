CR.Controllers.Common = Object.create(Object.prototype, {
    init() {
        CR.Services.Browser.addUserAgentAttributeToHtmlTag();
        CR.Services.Browser.fixFlexboxIndicatorClass();

        this._initElements();
        this._initEvents();
    },

    _initElements() {
        this.$window = $(window);

        this.$siteHeader = $("#container").children("header");
    },

    _initEvents() {
        this.$window.scroll(_.debounce(this._onScroll.bind(this), 15));
    },

    _onScroll() {
        const isScrolledDownEnough = this.$window.scrollTop() > 0;

        this.$siteHeader.toggleClass("scrolled-down", isScrolledDownEnough);
    }
});
