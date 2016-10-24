import {httpStatusCodes} from "../../global";

// eslint-disable-next-line no-unused-vars
import RaterProfile from "../raterProfile";

const AssignModal = React.createClass({
    getInitialState() {
        return {
            allRaters: []
        };
    },

    render() {
        return (
            <div id="assign-modal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-sm" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3 className="modal-title">Assign to</h3>
                        </div>
                        <div className="modal-body">
                            <ul className="styleless">
                                {this.state.allRaters.map(account => (
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
        this._fetchAllRaters();
    },

    _initElements() {
        this.$modal = $("#assign-modal");

        /* TODO
         $modal.on("show.bs.modal", function(e) {
         // Disable the rater currently assigned to the order
         }); */
    },

    _fetchAllRaters() {
        const type = "GET";
        const url = "/api/accounts/raters";

        const httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === httpStatusCodes.ok) {
                    this.setState({
                        allRaters: JSON.parse(httpRequest.responseText)
                    });
                } else {
                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                }
            }
        }.bind(this);
        httpRequest.open(type, url);
        httpRequest.send();
    },

    _handleItemClicked(e) {
        const accountId = $(e.currentTarget).data("account-id");

        this.props.parentController.assignOrderTo(_.find(this.state.allRaters, ["id", accountId]));
        this.$modal.modal("hide");
    }
});

export {AssignModal as default};
