import {httpStatusCodes} from "../../global";

const AssignModal = React.createClass({
    getInitialState() {
        return {
            allRaters: []
        };
    },

    render() {
        return (
            <div ref="modal" id="assign-modal" className="modal fade" tabIndex="-1" role="dialog">
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
                                {this.state.allRaters.map(account => <li key={account.id}>{account.firstName} {account.lastName}</li>)}
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

        // const $modal = $(ReactDOM.findDOMNode(this.refs.modal));

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
    }
});

export {AssignModal as default};
