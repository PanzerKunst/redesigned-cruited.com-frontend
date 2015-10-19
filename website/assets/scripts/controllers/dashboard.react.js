"use strict";

CR.Controllers.Dashboard = P(function(c) {
    c.$el = $(document.getElementById("content"));

    c.reactClass = React.createClass({
        render: function() {
            return (
                <div ref="wrapper">
                </div>
                );
        }
    });

    c.init = function(products) {
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
