import Category from "../../models/category";
import Product from "../../models/product";
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

// eslint-disable-next-line no-unused-vars
import OrderStatusChangeBtn from "./orderStatusChangeBtn";

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
            return {
                overallComments: {
                    cv: null,
                    coverLetter: null,
                    linkedinProfile: null
                }
            };
        },

        render() {
            const order = store.order;

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{`Assessment #${order.id}`}</h1>
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
                                {this._previewBtn(order)}
                                <OrderStatusChangeBtn />
                                <TimeLeft order={order} />
                            </section>
                        </div>

                        <ul className="nav nav-tabs" role="tablist">
                            {this._tab(Category.productCodes.cv, "CV")}
                            {this._tab(Category.productCodes.coverLetter, "Cover Letter")}
                            {this._tab(Category.productCodes.linkedinProfile, "Linkedin Profile")}
                        </ul>
                        <div className="tab-content">
                            {this._tabPane(Category.productCodes.cv)}
                            {this._tabPane(Category.productCodes.coverLetter)}
                            {this._tabPane(Category.productCodes.linkedinProfile)}
                        </div>

                        <div className="centered-contents">
                            {this._previewBtn(order)}
                        </div>
                    </div>
                </div>);
        },

        componentDidUpdate() {
            this._initState();
            this._initElements();

            $(".overall-comment").prop("disabled", store.isOrderReadOnly());
            this._selectFirstTab();
        },

        _initState() {
            if (store.assessment && !this.isStateInitialised) {
                this.setState({
                    overallComments: {
                        cv: store.assessment.overallComment(Category.productCodes.cv),
                        coverLetter: store.assessment.overallComment(Category.productCodes.coverLetter),
                        linkedinProfile: store.assessment.overallComment(Category.productCodes.linkedinProfile)
                    }
                });

                this.isStateInitialised = true;
            }
        },

        _initElements() {
            this.$firstTab = $(".with-circles").children(".nav-tabs").children().first().children();
        },

        _selectFirstTab() {
            if (!this.isFirstTabSelectionDone) {
                this.$firstTab.tab("show");
                this.isFirstTabSelectionDone = true;
            }
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

        _previewBtn() {
            if (store.areAllReportCommentsCheckedForAtLeastOneCategory()) {
                return <button className="btn btn-primary" onClick={this._handlePreviewBtnClick}>Preview assessment</button>;
            }

            return null;
        },

        _tab(categoryProductCode, label) {
            if (!_.includes(store.order.containedProductCodes, Product.codes[categoryProductCode])) {
                return null;
            }

            const attr = this._tabAttr(categoryProductCode);

            return (
                <li role="presentation">
                    <a href={`#${attr}`} aria-controls={attr} role="tab" data-toggle="tab" onClick={this._handleTabClick}>{label}</a>
                </li>);
        },

        _tabPane(categoryProductCode) {
            if (!_.includes(store.order.containedProductCodes, Product.codes[categoryProductCode])) {
                return null;
            }

            const attr = this._tabAttr(categoryProductCode);

            return (
                <div role="tabpanel" className="tab-pane fade in" id={attr} data-product-code={categoryProductCode}>
                    {this._listCategory(categoryProductCode)}
                    {this._reportForm(categoryProductCode)}
                </div>);
        },

        _tabAttr(categoryProductCode) {
            return `${categoryProductCode}-comments-selection-panel`;
        },

        _listCategory(categoryProductCode) {
            if (store.assessment) {
                return store.assessment.categoryIds(categoryProductCode).map(categoryId => {
                    const elId = `list-category-${categoryId}`;
                    const listCommentsForThisCategory = _.filter(store.assessment.listComments(categoryProductCode), ac => ac.categoryId === categoryId);

                    return (
                        <section key={elId} id={elId}>
                            <h3>{store.i18nMessages[`category.title.${categoryId}`]}</h3>

                            <ul className="styleless">
                            {listCommentsForThisCategory.map(ac =>
                                    <GreenRedAssessmentComment key={ac.id} comment={ac} />
                            )}
                            </ul>
                        </section>);
                });
            }

            return null;
        },

        _reportForm(categoryProductCode) {
            return (
                <form className="report-form single-column-panel">
                    <div className="form-group">
                        <label>Overall comment</label>
                        <textarea className="form-control overall-comment" value={this.state.overallComments[categoryProductCode] || ""} onChange={this._handleOverallCommentChange} onBlur={this._handleOverallCommentBlur} />
                    </div>
                    {this._reportCategories(categoryProductCode)}
                </form>);
        },

        _reportCategories(categoryProductCode) {
            if (store.assessment && store.assessment.areAllListCommentsSelected(categoryProductCode)) {
                return (
                    <ul className="styleless">
                    {store.assessment.categoryIds(categoryProductCode).map(categoryId => {
                        const reportCategory = store.assessment.reportCategory(categoryProductCode, categoryId, true);

                        reportCategory.id = categoryId;

                        return <ReportCategory key={categoryId} reportCategory={reportCategory} />;
                    })}
                    </ul>);
            }

            return null;
        },

        _handleTabClick(e) {
            e.preventDefault();
            $(e.currentTarget).tab("show");
        },

        _handleOverallCommentChange(e) {
            const $textarea = $(e.currentTarget);
            const categoryProductCode = this._categoryProductCodeFromOverallCommentTextarea($textarea);
            const newState = this.state;

            newState.overallComments[categoryProductCode] = $textarea.val();
            this.setState(newState);
        },

        _handleOverallCommentBlur(e) {
            const $textarea = $(e.currentTarget);
            const categoryProductCode = this._categoryProductCodeFromOverallCommentTextarea($textarea);

            const textareaValue = $textarea.val();
            const overallComment = textareaValue === "" ? null : textareaValue;

            store.updateOverallComment(categoryProductCode, overallComment);
        },

        _handlePreviewBtnClick() {

            // TODO: first, check that all report comments are checked in all tabs

            store.saveCurrentReport();
        },

        _categoryProductCodeFromOverallCommentTextarea($textarea) {
            return $textarea.closest(".tab-pane").data("productCode");
        }
    })
};

controller.init();
