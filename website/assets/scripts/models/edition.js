CR.Models.Edition = {
    codes: {
        PRO: "PRO",
        YOUNG_PRO: "YOUNG_PRO",
        EXEC: "EXEC",
        CONSULT: "CONSULT",
        ACADEMIA: "ACADEMIA"
    },

    getOfCode(code) {
        if (!CR.editions) {
            return null;
        }

        return _.find(CR.editions, function(edition) {
            return edition.code === code;
        });
    }
};
