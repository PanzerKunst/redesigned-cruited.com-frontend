"use strict";

CR.Controllers.CompletePayment = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                order: null
            };
        },

        render: function() {
            if (!this.state.order) {
                return null;
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["order.payment.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.payment.subtitle"]}</span>

                        <CR.Controllers.OrderSummary order={this.state.order} />
                        <CR.Controllers.PaymentForm price={this.state.order.getTotalPrice()} currency={this.state.order.getProducts()[0].price.currencyCode} />
                    </div>
                </div>
            );
        }
    });

    c.init = function(i18nMessages, products, reductions, order) {
        CR.i18nMessages = i18nMessages;
        CR.products = products;
        CR.reductions = reductions;

        this.order = CR.Models.Order(order);

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            order: this.order
        });
    };
});
