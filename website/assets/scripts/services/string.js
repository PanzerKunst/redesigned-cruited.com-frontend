"use strict";

CR.Services.String = {
    template: function(text, key, value) {
        var regex = new RegExp("{" + key + "}", "g");
        return text.replace(regex, value);
    }
};
