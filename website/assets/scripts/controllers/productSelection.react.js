"use strict";

CR.Controllers.ProductSelection = P(function(c) {
    c.$el = $(document.getElementById("content"));

    c.reactClass = React.createClass({
        render: function() {
            return (
                <div ref="wrapper">Product selection
                </div>
            );
        }
    });

    c.init = function(i18nMessages, products) {
        this.products = products;

        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            this.$el[0]
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            products: this.products
        });
    };
});
