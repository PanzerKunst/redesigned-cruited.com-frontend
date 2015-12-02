"use strict";

CR.Controllers.Dashboard = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                account: null,
                orders: []
            };
        },

        render: function() {
            if (!this.state.account) {
                return null;
            }

            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["dashboard.title"]}</h1>
                        <a className="btn btn-danger" id="new-assessment" href="/order">{CR.i18nMessages["dashboard.newAssessmentBtn.text"]}
                            <i className="fa fa-plus"></i>
                        </a>
                    </div>
                    <div className="with-circles">
                        <span>{CR.Services.String.template(CR.i18nMessages["dashboard.subtitle"], "firstName", this.state.account.firstName)}</span>
                        <ul className="styleless">
                            {this.state.orders.map(function(order, index) {
                                let reactItemId = "order-" + index;

                                return (
                                    <li key={reactItemId}>
                                        <h2 dangerouslySetInnerHTML={{__html: this._getOrderTitle(order)}} />
                                        <p>
                                            <span>{CR.i18nMessages["order.creationDate.label"]}:</span> {moment(order.getCreationTimestamp()).format("lll")}
                                        </p>
                                        <p>
                                            <span>{CR.i18nMessages["order.status.label"]}:</span> {order.getStatusForHtml()}
                                            <span>{order.getEditionForHtml()}</span>
                                        </p>

                                        <ul className="styleless">
                                            {order.getProducts().map(function(product, i) {
                                                let reactItmId = "product-" + i;

                                                return <CR.Controllers.OrderedDocumentAssessment key={reactItmId} order={order} productCode={product.code} />;
                                            })}
                                        </ul>
                                    </li>
                                );
                            }.bind(this))}
                        </ul>
                    </div>
                </div>
            );
        },

        _getOrderTitle: function(order) {
            let inner = order.getTitleForHtml();

            if (!order.jobAdUrl) {
                return inner;
            }

            let outer = "<a href=\"" + order.jobAdUrl + "\" target=\"_blank\">{inner}</a>";
            return CR.Services.String.template(outer, "inner", inner);
        }
    });

    c.init = function(i18nMessages, account, orders) {
        CR.i18nMessages = i18nMessages;
        this.account = account;
        this.orders = orders.map(function(order) {
            return CR.Models.Order(order);
        });

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();

        // Clearing the current order in local storage
        CR.order = CR.Models.Order();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            account: this.account,
            orders: this.orders
        });
    };
});
