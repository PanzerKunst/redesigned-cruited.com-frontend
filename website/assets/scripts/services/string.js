"use strict";

CR.Services.String = {
    template: function(text, key, value) {
        const regex = new RegExp("{" + key + "}", "g");
        return text.replace(regex, value);
    }
};
