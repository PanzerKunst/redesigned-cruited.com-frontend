import store from "./store";

import RaterProfile from "./raterProfile";  // eslint-disable-line no-unused-vars

const Component = React.createClass({
    render() {
        return (
            <div id="assign-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">Assign to</h3>
                        </div>
                        <div className="modal-body">
                            <ul className="styleless">
                            {store.allRaters.map(account =>
                                <li key={account.id} onClick={this._handleItemClick} data-account-id={account.id}>
                                    <RaterProfile account={account} />
                                </li>
                            )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>);
    },

    componentDidUpdate() {
        this._initElements();

        if (!this.isOnModalShowEventInitialised) {
            this._initOnModalShowEvent();
            this.isOnModalShowEventInitialised = true;
        }
    },

    _initElements() {
        this.$modal = $("#assign-modal");
        this.$listItems = this.$modal.find("li");
    },

    _initOnModalShowEvent() {
        this.$modal.on("show.bs.modal", () => {
            this.$listItems.removeClass("disabled");

            // Disable the rater currently assigned to the order
            const liCurrentlyAssigned = _.find(this.$listItems, li => {
                const accountId = $(li).data("account-id");
                const raterOfCurrentOrder = store.currentOrder.rater;

                return raterOfCurrentOrder && raterOfCurrentOrder.id === accountId;
            });

            $(liCurrentlyAssigned).addClass("disabled");
        });
    },

    _handleItemClick(e) {
        const $li = $(e.currentTarget);

        if (!$li.hasClass("disabled")) {
            const accountId = $li.data("account-id");

            store.assignOrderTo(_.find(store.allRaters, ["id", accountId]));
            this.$modal.modal("hide");
        }
    }
});

export {Component as default};
