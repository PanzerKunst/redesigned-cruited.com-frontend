const Account = {

    // Static
    types: {
        customer: 2,
        rater: 3,
        admin: 1
    },

    isAdmin() {
        return this.type === this.types.admin;
    }
};

export {Account as default};