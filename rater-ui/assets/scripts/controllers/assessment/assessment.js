import Category from "../../models/category";
import store from "./store";

// eslint-disable-next-line no-unused-vars
import PositionSought from "../common-components/positionSought";

// eslint-disable-next-line no-unused-vars
import EmployerSought from "../common-components/employerSought";

// eslint-disable-next-line no-unused-vars
import OrderTags from "../common-components/orderTags";

// eslint-disable-next-line no-unused-vars
import TimeLeft from "../common-components/timeLeft";

// eslint-disable-next-line no-unused-vars
import GreenRedAssessmentComment from "./greenRedAssessmentComment";

// eslint-disable-next-line no-unused-vars
import TopComment from "./topComment";

const controller = {
    init() {
        store.reactComponent = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        store.init();
    },

    reactComponent: React.createClass({
        getInitialState() {
            return store;
        },

        render() {
            const order = store.order;

            return (
                <div id="content">
                    <header>
                        <div>
                            {this._heading()}
                        </div>
                    </header>
                    <div className="with-circles">
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
                                <div>{this._previewBtn(order.isReadOnlyBy(store.account.id))}</div>
                                <TimeLeft order={order} />
                            </section>
                        </div>

                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className="active">
                                <a href="#CV_REVIEW-comments-selection-panel" aria-controls="CV_REVIEW-comments-selection-panel" role="tab" data-toggle="tab" onClick={this._handleTabClick}>CV</a>
                            </li>
                            <li role="presentation">
                                <a href="#COVER_LETTER_REVIEW-comments-selection-panel" aria-controls="COVER_LETTER_REVIEW-comments-selection-panel" role="tab" data-toggle="tab" onClick={this._handleTabClick}>Cover Letter</a>
                            </li>
                            <li role="presentation">
                                <a href="#LINKEDIN_PROFILE_REVIEW-comments-selection-panel" aria-controls="LINKEDIN_PROFILE_REVIEW-comments-selection-panel" role="tab" data-toggle="tab" onClick={this._handleTabClick}>Linkedin Profile</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div role="tabpanel" className="tab-pane fade in active" id="CV_REVIEW-comments-selection-panel">
                                {this._listCategory(Category.productCodes.cv)}
                                {this._assessmentForm(Category.productCodes.cv)}
                            </div>
                            <div role="tabpanel" className="tab-pane fade" id="COVER_LETTER_REVIEW-comments-selection-panel">
                                {this._listCategory(Category.productCodes.coverLetter)}
                                {this._assessmentForm(Category.productCodes.coverLetter)}
                            </div>
                            <div role="tabpanel" className="tab-pane fade" id="LINKEDIN_PROFILE_REVIEW-comments-selection-panel">
                                {this._listCategory(Category.productCodes.linkedinProfile)}
                                {this._assessmentForm(Category.productCodes.linkedinProfile)}
                            </div>
                        </div>
                    </div>
                </div>);
        },

        _heading() {
            const text = `Assessment #${store.order.id}`;

            return <h1>{text}</h1>;
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
        },

        _listCategory(categoryProductCode) {
            if (store.categoryIds) {
                return store.categoryIds[categoryProductCode].map(categoryId => {
                    const elId = `list-category-${categoryId}`;
                    const listCommentsForThisCategory = _.filter(store.assessment.listComments(categoryProductCode), ac => ac.categoryId === categoryId);

                    return (
                        <section key={elId} id={elId}>
                            <h3>{Category.titles[store.order.languageCode][categoryId]}</h3>

                            <ul className="styleless">
                        {listCommentsForThisCategory.map(ac =>
                                <GreenRedAssessmentComment key={`assessment-list-comment-${ac.id}`} comment={ac} />
                        )}
                            </ul>
                        </section>);
                });
            }

            return null;
        },

        _assessmentForm(categoryProductCode) {
            return (
                <form className="assessment-form single-column-panel">
                    <div className="form-group">
                        <label>Overall comment</label>
                        <textarea className="form-control overall-comment" />
                    </div>
                    {this._topComments(categoryProductCode)}
                </form>);
        },

        _topComments(categoryProductCode) {
            if (store.categoryIds) {
                return (
                    <ul className="styleless">
                    {store.categoryIds[categoryProductCode].map(categoryId =>
                            <li key={`assessment-category-${categoryId}`}>
                                <h3>{Category.titles[store.order.languageCode][categoryId]}</h3>
                                {this._topCommentsForCategory(categoryProductCode, categoryId)}
                            </li>
                    )}
                    </ul>);
            }

            return null;
        },

        _topCommentsForCategory(categoryProductCode, categoryId) {
            if (store.assessment.areAllListCommentsSelected(categoryProductCode)) {
                return (
                    <ul className="styleless">
                    {store.assessment.topComments(categoryProductCode, categoryId).map(comment =>
                            <TopComment key={`top-comment-${comment.id}`} comment={comment} />
                    )}
                    </ul>);
            }

            return null;
        },

        _handleTabClick(e) {
            e.preventDefault();
            $(e.currentTarget).tab("show");
        }
    })
};

controller.init();
