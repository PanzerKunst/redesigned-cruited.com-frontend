"use strict";

CR.Controllers.EditionElement = React.createClass({
    render: function() {
        if (!CR.order.getEdition()) {
            return null;
        }

        const editionCode = CR.order.getEdition().code;

        return <span className={`edition ${editionCode}`}>{CR.i18nMessages[`edition.name.${editionCode}`]}</span>;
    }
});
