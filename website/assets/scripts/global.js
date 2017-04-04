const CR = {};

// Additional namespaces
CR.Controllers = {};
CR.Services = {};
CR.Models = {};

CR.animationDurations = {
    short: 0.2,
    default: 0.5
};

CR.httpStatusCodes = {
    ok: 200,
    created: 201,
    noContent: 204,
    requestEntityTooLarge: 413,
    emailAlreadyRegistered: 230,
    linkedinAccountIdAlreadyRegistered: 231,
    couponExpired: 230,
    paymillError: 230,
    signInNoPassword: 230,
    signInPasswordMismatchLinkedinNotRegistered: 231,
    signInPasswordMismatchLinkedinRegistered: 232
};

CR.localStorageKeys = {
    order: "order",
    positionSought: "positionSought",
    employerSought: "employerSought",
    jobAdUrl: "jobAdUrl",
    customerComment: "customerComment"
};

CR.propertyFile = {
    key: {
        word: {
            separator: "."
        }
    },
    keyValue: {
        separator: "="
    }
};

CR.languageCodes = {
    sv: "sv",
    en: "en"
};


// Global functions
CR.scrollToElement = function($el) {
    const $headerBar = $("#container").children("header");
    const offset = $el[0].getBoundingClientRect().top - document.body.getBoundingClientRect().top - $headerBar.height();

    TweenLite.to(window, 1, {
        scrollTo: offset,
        ease: Power4.easeOut
    });
};

CR.orderLanguage = function() {
    if (window.location.search === "?lang=en") {
        return CR.languageCodes.en;
    }

    return CR.languageCodes.sv;
};
