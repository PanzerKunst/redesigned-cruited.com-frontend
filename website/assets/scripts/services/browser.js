"use strict";

CR.Services.Browser = {
    regexOfUserAgentsNotSupportingFlexbox: [
        "OS 8_",
        "OS 7_",
        "OS 6_",
        "OS 5_",
        "OS 4_"
    ],

    cssRules: function() {
        if (CR.Services.Browser.allCssRules) {
            return CR.Services.Browser.allCssRules;
        }

        CR.Services.Browser.allCssRules = {};

        const styleSheets = document.styleSheets;

        for (let i = 0; i < styleSheets.length; i++) {
            const styleSheet = styleSheets[i];
            const styleSheetRules = styleSheet.cssRules || styleSheet.rules;  // .rules for IE, .cssRules for other browsers

            if (styleSheetRules) {
                for (let j = 0; j < styleSheetRules.length; j++) {
                    const rule = styleSheetRules[j];
                    CR.Services.Browser.allCssRules[rule.selectorText] = rule.style;
                }
            }
        }

        return CR.Services.Browser.allCssRules;
    },

    getCssRule: function(selector, property) {
        return CR.Services.Browser.cssRules()[selector].getPropertyValue(property);
    },

    getUrlQueryStrings: function() {
        const queryDict = {};
        location.search.substr(1).split("&").forEach(function(item) {
            queryDict[item.split("=")[0]] = item.split("=")[1];
        });
        return queryDict;
    },

    addUserAgentAttributeToHtmlTag: function() {
        document.documentElement.setAttribute("data-useragent", navigator.userAgent);
    },

    isMediumScreen: function() {
        const content = window.getComputedStyle(
            document.querySelector("body"), ":after"
        ).getPropertyValue("content");

        // In some browsers like Firefox, "content" is wrapped by double-quotes, that's why doing "return content === "GLOBAL_MEDIUM_SCREEN_BREAKPOINT" would be false.
        return _.contains(content, "GLOBAL_MEDIUM_SCREEN_BREAKPOINT");
    },

    isLargeScreen: function() {
        const content = window.getComputedStyle(
            document.querySelector("body"), ":after"
        ).getPropertyValue("content");

        return _.contains(content, "GLOBAL_LARGE_SCREEN_BREAKPOINT");
    },

    isSmallScreen: function() {
        return !this.isMediumScreen() && !this.isLargeScreen();
    },

    saveInLocalStorage: function(key, value) {
        if (Modernizr.localstorage && value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    getFromLocalStorage: function(key) {
        if (Modernizr.localstorage) {
            return JSON.parse(localStorage.getItem(key));
        }
    },

    removeFromLocalStorage: function(key) {
        if (Modernizr.localstorage) {
            localStorage.removeItem(key);
        }
    },

    isIOS: function() {
        return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    },

    isWindows: function() {
        return navigator.platform === "Win32" || navigator.platform === "Win64";
    },

    fixFlexboxIndicatorClass: function() {
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
