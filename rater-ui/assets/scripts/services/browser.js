const Browser = {
    regexOfUserAgentsNotSupportingFlexbox: [
        "OS 8_",
        "OS 7_",
        "OS 6_",
        "OS 5_",
        "OS 4_"
    ],

    cssRules() {
        if (this.allCssRules) {
            return this.allCssRules;
        }

        this.allCssRules = {};

        const styleSheets = document.styleSheets;

        styleSheets.forEach(styleSheet => {
            const styleSheetRules = styleSheet.cssRules || styleSheet.rules;  // .rules for IE, .cssRules for other browsers

            if (styleSheetRules) {
                for (let j = 0; j < styleSheetRules.length; j++) {
                    const rule = styleSheetRules[j];

                    this.allCssRules[rule.selectorText] = rule.style;
                }
            }
        });

        return this.allCssRules;
    },

    getCssRule(selector, property) {
        return this.cssRules()[selector].getPropertyValue(property);
    },

    getUrlQueryStrings() {
        const queryDict = {};

        location.search.substr(1).split("&").forEach(item => {
            queryDict[item.split("=")[0]] = item.split("=")[1];
        });
        return queryDict;
    },

    addUserAgentAttributeToHtmlTag() {
        document.documentElement.setAttribute("data-useragent", navigator.userAgent);
    },

    isMediumScreen() {
        const content = window.getComputedStyle(
            document.querySelector("body"), ":after"
        ).getPropertyValue("content");

        // In some browsers like Firefox, "content" is wrapped by double-quotes, that's why doing "return content === "GLOBAL_MEDIUM_SCREEN_BREAKPOINT" would be false.
        return content.indexOf("GLOBAL_MEDIUM_SCREEN_BREAKPOINT") >= 0;
    },

    isLargeScreen() {
        const content = window.getComputedStyle(
            document.querySelector("body"), ":after"
        ).getPropertyValue("content");

        return content.indexOf("GLOBAL_LARGE_SCREEN_BREAKPOINT") >= 0;
    },

    isXlScreen() {
        const content = window.getComputedStyle(
            document.querySelector("body"), ":after"
        ).getPropertyValue("content");

        return content.indexOf("GLOBAL_XL_SCREEN_BREAKPOINT") >= 0;
    },

    isSmallScreen() {
        return !this.isMediumScreen() && !this.isLargeScreen() && !this.isXlScreen();
    },

    saveInLocalStorage(key, value) {
        if (Modernizr.localstorage && value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    getFromLocalStorage(key) {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.getItem(key));
        }
        return null;
    },

    removeFromLocalStorage(key) {
        if (Modernizr.localstorage) {
            localStorage.removeItem(key);
        }
    },

    clearLocalStorage() {
        if (Modernizr.localstorage) {
            localStorage.clear();
        }
    },

    isIOS() {
        return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    },

    isWindows() {
        return navigator.platform === "Win32" || navigator.platform === "Win64";
    },

    fixFlexboxIndicatorClass() {
        const $html = $("html");
        let isFound = false;

        for (let i = 0; i < this.regexOfUserAgentsNotSupportingFlexbox.length; i++) {
            const userAgent = $html.data("useragent");

            if (new RegExp(this.regexOfUserAgentsNotSupportingFlexbox[i]).test(userAgent)) {
                isFound = true;
                break;
            }
        }

        if (isFound) {
            $html.removeClass("flexbox");
            $html.addClass("no-flexbox");
        }
    }
};

export {Browser as default};
