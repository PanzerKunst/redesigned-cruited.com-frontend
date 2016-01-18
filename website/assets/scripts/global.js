"use strict";

let CR = {};

// Additional namespaces
CR.Controllers = {};
CR.Services = {};
CR.Models = {};

CR.animationDurations = {
    default: 0.5
};

CR.httpStatusCodes = {
    ok: 200,
    created: 201,
    noContent: 204,
    emailAlreadyRegistered: 230,
    linkedinAccountIdAlreadyRegistered: 231,
    couponHasReachedMaxUses: 230
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


// Global functions
