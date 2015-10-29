"use strict";

CR.Controllers.Dashboard = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            return (
                <div id="content">
                </div>
                );
        }
    });

    c.init = function() {
        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            $("[role=main]")[0]
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
        });
    };
});
