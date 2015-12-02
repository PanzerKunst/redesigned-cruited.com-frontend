"use strict";

CR.Controllers.OrderedDocumentAssessment = React.createClass({
    render: function() {
        let isBtnDisabled = this.props.order.getStatus() !== CR.Models.OrderStaticProps.statusIds.completed;

        return (
            <li><span>{CR.i18nMessages["product.name." + this.props.productCode]}</span><button className="btn btn-default" onClick={this._handleClick} disabled={isBtnDisabled}>View full report</button></li>
            );
    },

    _handleClick: function() {
        location.href = "/reports/" + this.props.order.getId() + "?productCode=" + this.props.productCode;
    }
});
