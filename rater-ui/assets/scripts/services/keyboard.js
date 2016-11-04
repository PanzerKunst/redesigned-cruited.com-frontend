const Keyboard = {
    keyCodes: {
        backspace: 8,
        tab: 9,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        escape: 27,
        space: 32
    },

    isPressedKeyText(e) {
        const keyCode = e.keyCode;

        return keyCode !== this.keyCode.tab &&
            keyCode !== this.keyCode.enter &&
            keyCode !== this.keyCode.shift &&
            keyCode !== this.keyCode.ctrl &&
            keyCode !== this.keyCode.alt &&
            keyCode !== this.keyCode.escape &&
            keyCode !== this.keyCode.space;
    }
};

export {Keyboard as default};
