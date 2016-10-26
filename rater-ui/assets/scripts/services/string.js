const StringService = {
    template(text, key, value) {
        const regex = new RegExp(`{${key}}`, "g");

        return text.replace(regex, value);
    }
};

export {StringService as default};
