const Category = {

    // Static
    productCodes: {
        cv: "cv",
        coverLetter: "coverLetter",
        linkedinProfile: "linkedinProfile"
    },

    titles: {
        sv: {

            // CV
            12: "Redovisa resultat och skapa trovärdighet",
            13: "Översiktligt och korrekt",
            14: "Rikta och var relevant",

            // Cover letter
            7: "Framhäv potential",
            8: "Fokusera på arbetsgivaren",
            10: "Redovisa resultat och skapa trovärdighet",
            11: "Aktivt, kort och korrekt",

            // Linkedin profile
            16: "Rikta och var relevant",
            17: "Skapa effekt och bygg räckvidd",
            18: "Översiktligt och korrekt",
            20: "Redovisa resultat och skapa trovärdighet"
        },

        en: {
            12: "Present achievements and build credibility",
            13: "Ensure completeness and correctness",
            14: "Be relevant and targeted",

            7: "Highlight your potential",
            8: "Focus on the employer",
            10: "Present achievements and build credibility",
            11: "Active, brief and correct",

            16: "Be relevant and targeted",
            17: "Network and outreach",
            18: "Complete and correct profile",
            20: "Present achievements and build credibility"
        }
    },

    productCodeFromCategoryId(categoryId) {
        switch (categoryId) {
            case 12:
                return this.productCodes.cv;
            case 13:
                return this.productCodes.cv;
            case 14:
                return this.productCodes.cv;

            case 7:
                return this.productCodes.coverLetter;
            case 8:
                return this.productCodes.coverLetter;
            case 10:
                return this.productCodes.coverLetter;
            case 11:
                return this.productCodes.coverLetter;

            case 16:
                return this.productCodes.linkedinProfile;
            case 17:
                return this.productCodes.linkedinProfile;
            case 18:
                return this.productCodes.linkedinProfile;
            default:
                return this.productCodes.linkedinProfile;
        }
    }
};

export {Category as default};
