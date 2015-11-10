"use strict";

CR.Controllers.Dashboard = P(function(c) {
    c.reactClass = React.createClass({
        render: function() {
            return (
                <div id="content">
                    <div id="page-header-bar">
                        <h1>{CR.i18nMessages["dashboard.title"]}</h1>
                    </div>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["dashboard.subtitle"]}</span>
                    </div>
                </div>
                );
        }
    });

    c.init = function(i18nMessages) {
        CR.i18nMessages = i18nMessages;

        this.reactInstance = React.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();

        // Clearing the current order in local storage
        CR.order = CR.Models.Order();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
        });
    };
});
