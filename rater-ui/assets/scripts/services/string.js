const StringUtils = {
    template(text, key, value) {
        const regex = new RegExp(`{${key}}`, "g");

        return text.replace(regex, value);
    },

    uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }
};

export {StringUtils as default};
