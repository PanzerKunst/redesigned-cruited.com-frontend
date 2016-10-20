import Order from "../models/order";
import moment from "moment";

const AssessmentListController = {
    ordersAssignedToMe: [],

    init() {
        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        // TODO: remove
        console.log("orders", this.ordersAssignedToMe);

        this._reRender();
    },

    _reRender() {
        this.reactInstance.replaceState({
            ordersAssignedToMe: this.ordersAssignedToMe
        });
    },

    reactComponent: React.createClass({
        getInitialState() {
            return {
                ordersAssignedToMe: []
            };
        },

        render() {
            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>Orders</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <ul className="styleless">
                        {this.state.ordersAssignedToMe.map(order =>
                            (<li className={this._cssClassForStatus(order.status)}>
                                <section>
                                    {this._raterProfile(order.rater)}
                                    <p>#{order.id}</p>
                                    {this._timeRemaining(order.paymentTimestamp)}
                                    <p>{moment(order.paymentTimestamp).format("YYYY-MM-DD H:mm")}</p>
                                </section>
                                <section>
                                    <div>
                                        <p>{order.employerSought}</p>
                                        <p>{order.positionSought}</p>
                                    </div>
                                    <div>
                                        <p>{order.customer.firstName}</p>
                                        <p>{order.customer.emailAddress}</p>
                                    </div>
                                </section>
                            </li>)
                        )}
                        </ul>
                    </div>
                </div>
            );
        },

        _cssClassForStatus(status) {
            switch (status) {
                case Order.statusIds.paid:
                    return "paid";
                case Order.statusIds.inProgress:
                    return "in-progress";
                case Order.statusIds.awaitingFeedback:
                    return "awaiting-feedback";
                case Order.statusIds.scheduled:
                    return "scheduled";
                case Order.statusIds.completed:
                    return "completed";
                default:
                    return "not-paid";
            }
        },

        _raterProfile(rater) {
            if (!rater) {
                return null;
            } else {
                let myProfilePictureStyleAttr = null;
                const myLinkedinProfile = rater.linkedinProfile;

                if (myLinkedinProfile) {
                    myProfilePictureStyleAttr = {"background-image": "url(" + myLinkedinProfile.pictureUrl + ")"};
                }

                return (
                    <article className="rater-profile">
                        <div className="profile-picture" style={myProfilePictureStyleAttr}></div>
                        <span>{rater.firstName} {rater.lastName}</span>
                    </article>
                );
            }
        },

        _timeRemaining(paymentTimestamp) {
            const dueDate = moment(paymentTimestamp).add(1, "d").subtract(90, "m");
            const timeLeft = moment.duration(dueDate.valueOf() - moment().valueOf());

            return <p>{timeLeft.hours()}h{timeLeft.minutes()}m left</p>;
        }
    })
};

Object.assign(Object.create(AssessmentListController), CR.ControllerData).init();
