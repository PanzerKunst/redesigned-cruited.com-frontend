import Category from "../../models/category";
import Assessment from "../../models/assessment";
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
import ReportCategory from "./reportCategory";

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
                            {this._tab(Category.productCodes.cv, "CV", true)}
                            {this._tab(Category.productCodes.coverLetter, "Cover Letter")}
                            {this._tab(Category.productCodes.linkedinProfile, "Linkedin Profile")}
                        </ul>
                        <div className="tab-content">
                            {this._tabPane(Category.productCodes.cv, true)}
                            {this._tabPane(Category.productCodes.coverLetter)}
                            {this._tabPane(Category.productCodes.linkedinProfile)}
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

        _tab(categoryProductCode, label, isActive = false) {
            const classes = classNames({
                active: isActive
            });
            const attr = `${categoryProductCode}-comments-selection-panel`;

            return (
                <li role="presentation" className={classes}>
                    <a href={`#${attr}`} aria-controls={attr} role="tab" data-toggle="tab" onClick={this._handleTabClick}>{label}</a>
                </li>);
        },

        _tabPane(categoryProductCode, isActive = false) {
            const classes = classNames({
                "tab-pane fade in": true,
                active: isActive
            });
            const attr = `${categoryProductCode}-comments-selection-panel`;

            return (
                <div role="tabpanel" className={classes} id={attr} data-product-code={categoryProductCode}>
                    {this._listCategory(categoryProductCode)}
                    {this._assessmentForm(categoryProductCode)}
                </div>);
        },

        _listCategory(categoryProductCode) {
            if (store.categoryIds) {
                return store.categoryIds[categoryProductCode].map(categoryId => {
                    const elId = `list-category-${categoryId}`;
                    const listCommentsForThisCategory = _.filter(Assessment.listComments(categoryProductCode), ac => ac.categoryId === categoryId);

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
                <form className="report-form single-column-panel">
                    <div className="form-group">
                        <label>Overall comment</label>
                        <textarea className="form-control overall-comment" />
                    </div>
                    {this._reportCategories(categoryProductCode)}
                </form>);
        },

        _reportCategories(categoryProductCode) {
            if (store.categoryIds && Assessment.areAllListCommentsSelected(categoryProductCode)) {
                return (
                    <ul className="styleless">
                    {store.categoryIds[categoryProductCode].map(categoryId =>
                        <ReportCategory key={`top-comment-category-${categoryId}`} categoryProductCode={categoryProductCode} categoryId={categoryId} />
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
