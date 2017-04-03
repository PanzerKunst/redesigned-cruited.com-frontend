CR.Services.String = {
    template(text, key, value) {
        const regex = new RegExp("{" + key + "}", "g");

        return text.replace(regex, value);
    }
};
