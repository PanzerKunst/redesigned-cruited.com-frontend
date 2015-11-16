"use strict";

CR.Controllers.OrderedDocumentAssessment = React.createClass({
    render: function() {
        let reportUrl = "/reports/" + this.props.order.id + "?productCode=" + this.props.productCode;

        return (
            <li><span>{CR.i18nMessages["product.name." + this.props.productCode]}</span><a href={reportUrl} className="btn btn-default">View full report</a></li>
            );
    }
});
