import store from "./store";

// eslint-disable-next-line no-unused-vars
import PositionSought from "../components/positionSought";

// eslint-disable-next-line no-unused-vars
import EmployerSought from "../components/employerSought";

// eslint-disable-next-line no-unused-vars
import OrderTags from "../components/orderTags";

// eslint-disable-next-line no-unused-vars
import TimeLeft from "../components/timeLeft";

const Component = React.createClass({
    render() {
        const order = store.order;

        return (
            <div id="order-details">
                <section>
                    <div>
                        <PositionSought position={order.positionSought} />
                        <EmployerSought employer={order.employerSought} />
                    </div>
                    {this._customerComment(order.customerComment)}
                    {this._jobAdUrl(order.jobAdUrl)}
                </section>
                <section>
                    <OrderTags order={order} config={store.config} />
                    {this._linkedinProfilePic(order.customer.linkedinProfile)}
                    <p>{order.customer.firstName} {order.customer.lastName}</p>
                    <p>{order.customer.emailAddress}</p>
                </section>
                <section>
                    <div>
                        {this._previewBtn(order.isReadOnlyBy(store.account.id))}
                    </div>
                    <TimeLeft order={order} />
                </section>
            </div>
        );
    },

    _customerComment(customerComment) {
        if (!customerComment) {
            return null;
        }
        return <p>{customerComment}</p>;
    },

    _jobAdUrl(jobAdUrl) {
        if (!jobAdUrl) {
            return null;
        }
        return <a href={jobAdUrl} target="_blank">Job ad</a>;
    },

    _linkedinProfilePic(linkedinProfile) {
        if (!linkedinProfile) {
            return null;
        }

        const style = {backgroundImage: `url(${linkedinProfile.pictureUrl})`};

        return <div style={style}></div>;
    },

    _previewBtn(isReadOnly) {
        if (isReadOnly) {
            return null;
        }
        return <button className="btn btn-primary">Preview assessment</button>;
    }
});

export {Component as default};
