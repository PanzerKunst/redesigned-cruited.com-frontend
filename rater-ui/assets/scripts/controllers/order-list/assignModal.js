import store from "./store";

// eslint-disable-next-line no-unused-vars
import RaterProfile from "../raterProfile";

const AssignModal = React.createClass({
    getInitialState() {
        return store;
    },

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
                                {store.allRaters.map(account => (
                                        <li key={account.id} onClick={this._handleItemClicked} data-account-id={account.id}>
                                            <RaterProfile account={account} />
                                        </li>)
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount() {
        this._initElements();
    },

    _initElements() {
        this.$modal = $("#assign-modal");

        /* TODO
         $modal.on("show.bs.modal", function(e) {
         // Disable the rater currently assigned to the order
         }); */
    },

    _handleItemClicked(e) {
        const accountId = $(e.currentTarget).data("account-id");

        store.assignOrderTo(_.find(store.allRaters, ["id", accountId]));
        this.$modal.modal("hide");
    }
});

export {AssignModal as default};
