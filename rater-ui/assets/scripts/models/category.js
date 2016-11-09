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

    wellDoneComments: {
        sv: {
            12: "Bra jobbat i denna kategori! Du har lyckats beskriva dina erfarenheter på ett bra sätt.",
            13: "Bra jobbat på detta område! Du har en snygg och överskådlig cv.",
            14: "Bra jobbat på detta område! Din cv är riktad till den tjänst du söker på ett bra sätt.",

            7: "Bra jobbat i denna kategori! Du har lyckats framhäva din potential på ett bra sätt.",
            8: "Bra jobbat på detta område! Du visar att du är påläst om arbetsgivaren och varför du passar för tjänsten.",
            10: "Bra jobbat på detta område! Du framhäver dina egenskaper på ett bra och trovärdigt vis.",
            11: "Bra jobbat i denna kategori! Ditt brev är tydligt, snyggt och korrekt.",

            16: "Bra jobbat på detta område! Din profil har en tydlig inriktning och du är relevant för din målgrupp.",
            17: "Bra jobbat på detta område! Fortsätt att bygga ditt nätverk och var aktiv på LinkedIn.",
            18: "Bra jobbat på detta område! Du har en tydlig och korrekt profil.",
            20: "Bra jobbat i denna kategori! Din profil ger ett trovärdigt intryck och du har beskrivit dina erfarenheter och utbildningar väl."
        },
        en: {
            12: "Very well done in this area!",
            13: "Very well done in this area! You have a professional looking cv, that meets all the expected qualities.",
            14: "Very well done in this area!",

            7: "Very well done in this area!",
            8: "Very well done in this area!",
            10: "Very well done in this area!",
            11: "Very well done in this area!",

            16: "Very well done in this area!",
            17: "Very well done in this area!",
            18: "Very well done in this area!",
            20: "Very well done in this area!"
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

    // Instance
};

export {Category as default};
