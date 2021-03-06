import {localStorageKeys} from "../../global";
import {animationDurations} from "../../global";
import {enableLoading} from "../../services/animator";
import Browser from "../../services/browser";
import Category from "../../models/category";
import Product from "../../models/product";
import Order from "../../models/order";

import store from "./store";

import PositionSought from "../common-components/positionSought";   // eslint-disable-line no-unused-vars
import EmployerSought from "../common-components/employerSought";   // eslint-disable-line no-unused-vars
import OrderTags from "../common-components/orderTags"; // eslint-disable-line no-unused-vars
import TimeLeft from "../common-components/timeLeft";   // eslint-disable-line no-unused-vars
import CustomerProfile from "../common-components/customerProfile"; // eslint-disable-line no-unused-vars

import GreenRedAssessmentComment from "./greenRedAssessmentComment";    // eslint-disable-line no-unused-vars
import ReportCategory from "./reportCategory";  // eslint-disable-line no-unused-vars
import OrderStatusChangeBtn from "./orderStatusChangeBtn";  // eslint-disable-line no-unused-vars
import DocAssessmentNav from "./docAssessmentNav";  // eslint-disable-line no-unused-vars
import VariationsModal from "./variationsModal";    // eslint-disable-line no-unused-vars
import ConfirmResetCommentModal from "./confirmResetCommentModal";  // eslint-disable-line no-unused-vars
import ConfirmRemoveReportCommentModal from "./confirmRemoveReportCommentModal";  // eslint-disable-line no-unused-vars

const controller = {
    init() {
        store.reactComponent = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        store.init();
    },

    reactComponent: React.createClass({
        largeScreenWidthPx: 960,

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
                        <div id="order-details" className="collapsed">
                            <div>
                                <section className="order-details-section first">
                                    <div className="position-and-employer">
                                        <PositionSought position={order.positionSought} />
                                        <EmployerSought employer={order.employerSought} />
                                    </div>
                                    {this._customerComment(order.customerComment)}
                                    {this._jobAdLink()}
                                </section>
                                <section className="order-details-section second">
                                    <OrderTags order={order} config={store.config} />
                                    <CustomerProfile customer={order.customer} />
                                    {this._previousOrdersAndScores()}
                                </section>
                                <section className="order-details-section third">
                                    {this._previewOrViewBtn()}
                                    <OrderStatusChangeBtn />
                                    <TimeLeft order={order} />
                                </section>
                            </div>
                            <div className="centered-contents">
                                <button className="styleless fa fa-chevron-down" onClick={this._handleExpandCollapseClick}/>
                            </div>
                        </div>

                        <VariationsModal />
                        <ConfirmResetCommentModal />
                        <ConfirmRemoveReportCommentModal />

                        <div className="nav-panel">
                            <ul className="nav nav-tabs" role="tablist">
                                {this._tab(Category.productCodes.cv, "CV")}
                                {this._tab(Category.productCodes.coverLetter, "Cover Letter")}
                                {this._tab(Category.productCodes.linkedinProfile, "Linkedin")}
                            </ul>
                        </div>
                        <div className="tab-content">
                            {this._tabPane(Category.productCodes.cv)}
                            {this._tabPane(Category.productCodes.coverLetter)}
                            {this._tabPane(Category.productCodes.linkedinProfile)}
                        </div>
                    </div>
                </div>);
        },

        componentDidUpdate() {
            this._initState();
            this._initElements();
            this._initEvents();

            this._setNavPanelLocation();
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
            this.$window = $(window);
            this.$withCircles = $(".with-circles");

            this.$orderDetails = this.$withCircles.children("#order-details");
            this.$collapseExpandBtn = this.$orderDetails.children(".centered-contents").children();

            this.$navPanel = this.$withCircles.children(".nav-panel");

            this.$tabListItems = this.$navPanel.children(".nav-tabs").children();
            this.$tabLinks = this.$tabListItems.children();
            this.$firstTab = this.$tabListItems.first().children();

            this.$assessmentNavPanels = this.$withCircles.find(".nav.assessment");
        },

        _initEvents() {
            this._showCorrectAssessmentNavPanels();
            this.$window.resize(() => this._setNavPanelLocation());
            this.$window.scroll(_.debounce(() => this._onScroll(), 15));
        },

        _setNavPanelLocation() {
            if (Browser.isXlScreen()) {
                const locationX = this.largeScreenWidthPx + (window.innerWidth - this.largeScreenWidthPx) / 2;

                this.$navPanel.css("left", locationX);
            }
        },

        _showCorrectAssessmentNavPanels() {
            this.$tabLinks.on("shown.bs.tab", e => {
                this.$assessmentNavPanels.hide();

                if (Browser.isXlScreen()) {
                    $(e.target).siblings(".nav.assessment").show();
                    this._updateActiveCategoryInAssessmentNav();
                }
            });
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
            return <p className="customer-comment">{customerComment}</p>;
        },

        _jobAdLink() {
            const order = store.order;
            let url = null;
            let linkText = null;
            let classes = "job-ad-link";

            if (order.jobAdUrl) {
                url = order.jobAdUrl;
                linkText = order.jobAdUrl;
            }

            if (order.jobAdFileName) {
                url = order.jobAdFileUrl(store.config);
                linkText = order.jobAdFileName;
                classes += " pdf-link";
            }

            if (url && linkText) {
                return <a href={url} target="_blank" className={classes}>{linkText}</a>;
            }

            return null;
        },

        _previousOrdersAndScores() {
            if (!store.scoresOfOtherOrders) {
                return null;
            }

            return (
                <ul className="styleless">
                {store.scoresOfOtherOrders.map(orderAndScores => {
                    const order = orderAndScores.order;
                    const orderDueMoment = moment(orderAndScores.order.dueTimestamp);
                    const rater = orderAndScores.order.rater;
                    const cvScore = orderAndScores.scores.cvReportScores ? `CV ${orderAndScores.scores.cvReportScores.globalScore}%, ` : "";
                    const coverLetterScore = orderAndScores.scores.coverLetterReportScores ? `CL ${orderAndScores.scores.coverLetterReportScores.globalScore}%, ` : "";
                    const linkedinProfileScore = orderAndScores.scores.linkedinProfileReportScores ? `LI ${orderAndScores.scores.linkedinProfileReportScores.globalScore}%, ` : "";

                    return (
                    <li key={order.id}>
                        <a href={`/assessments/${order.id}`} target="_blank">{`${orderDueMoment.format("YYYY-MM-DD")} [${cvScore}${coverLetterScore}${linkedinProfileScore}${rater.firstName} ${rater.lastName}]`}</a>
                    </li>);
                })}
                </ul>);
        },

        _previewOrViewBtn() {
            if (store.order.status === Order.statuses.scheduled || store.order.status === Order.statuses.completed) {
                return <a className="btn btn-primary" href={store.order.reportUrl(store.config)}>View report</a>;
            }

            if (!store.isOrderReadOnly() && store.areAllListCommentsSelected()) {
                return <button className="btn btn-primary" onClick={this._handlePreviewBtnClick}>Preview report</button>;
            }

            return null;
        },

        _tab(categoryProductCode, label) {
            if (!_.includes(store.order.containedProductCodes, Product.codes[categoryProductCode])) {
                return null;
            }

            const attr = this._tabAttr(categoryProductCode);
            const validationErrors = store.reportFormValidationErrors ? store.reportFormValidationErrors[categoryProductCode] : null;

            const linkClasses = classNames({
                "has-errors": !_.isEmpty(validationErrors)
            });

            let docScore = 0;

            if (store.assessment) {
                docScore = store.assessment.docScore(categoryProductCode);
            }

            return (
                <li role="presentation">
                    <a href={`#${attr}`} aria-controls={attr} role="tab" data-toggle="tab" className={linkClasses} onClick={this._handleTabClick}><span>{label}</span><span>{docScore}</span></a>
                    <DocAssessmentNav categoryProductCode={categoryProductCode} validationErrors={validationErrors} />
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
                <form id={`${categoryProductCode}-report-form`} className="report-form single-column-panel">
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
                        const validationErrors = store.reportFormValidationErrors && store.reportFormValidationErrors[categoryProductCode] ? store.reportFormValidationErrors[categoryProductCode][categoryId] : null;

                        reportCategory.id = categoryId;

                        return <ReportCategory key={categoryId} reportCategory={reportCategory} validationErrors={validationErrors} />;
                    })}
                    </ul>);
            }

            return null;
        },

        _handleTabClick(e) {
            e.preventDefault();
            $(e.currentTarget).tab("show");

            // Scrolling near top
            TweenLite.to(window, animationDurations.long, {scrollTo: 250, ease: Power4.easeOut});
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

            const textareaValue = $textarea.val().trim();
            const overallComment = textareaValue === "" ? null : textareaValue;

            store.assessment.updateOverallComment(categoryProductCode, overallComment);
        },

        _handlePreviewBtnClick(e) {
            const $btn = $(e.currentTarget);

            store.validateReportForm();

            if (!store.reportFormValidationErrors) {
                enableLoading($btn, "Saving");
                this._saveCurrentlyAssessedDoc();
                store.saveCurrentReport();
            }
        },

        _handleExpandCollapseClick() {
            if (this.$orderDetails.hasClass("collapsed")) {
                this.$collapseExpandBtn.removeClass("fa-chevron-down");
                this.$collapseExpandBtn.addClass("fa-chevron-up");
            } else {
                this.$collapseExpandBtn.removeClass("fa-chevron-up");
                this.$collapseExpandBtn.addClass("fa-chevron-down");
            }

            this.$orderDetails.toggleClass("collapsed");
        },

        _categoryProductCodeFromOverallCommentTextarea($textarea) {
            return $textarea.closest(".tab-pane").data("productCode");
        },

        _saveCurrentlyAssessedDoc() {
            Browser.saveInLocalStorage(localStorageKeys.currentlyAssessedDoc, this._currentlyActiveCategoryProductCode());
        },

        _onScroll() {
            this._updateFloatingOrderDetailsPanel();
            this._updateActiveCategoryInAssessmentNav();
        },

        _updateFloatingOrderDetailsPanel() {
            if (Browser.isMediumScreen() || Browser.isLargeScreen() || Browser.isXlScreen()) {
                if (this.$window.scrollTop() > 150) {
                    if (!this.defaultOrderDetailsHeight) {
                        this.defaultOrderDetailsHeight = this.$orderDetails.outerHeight();
                    }

                    this.$withCircles.css("margin-top", this.defaultOrderDetailsHeight);
                    this.$withCircles.addClass("fixed-order-details");
                } else {
                    this.$withCircles.css("margin-top", 0);
                    this.$withCircles.removeClass("fixed-order-details");
                }
            }
        },

        _updateActiveCategoryInAssessmentNav() {
            if (Browser.isXlScreen()) {

                const categoryIdsForCurrentDoc = store.assessment.categoryIds(this._currentlyActiveCategoryProductCode());

                for (const categoryId of categoryIdsForCurrentDoc) {
                    const navPanelTopPos = this.$navPanel.offset().top;

                    const $categoryPanel = $(`#list-category-${categoryId}`);
                    const categoryPanelTopPos = $categoryPanel.offset().top;
                    const categoryPanelBottomPos = categoryPanelTopPos + $categoryPanel.height();

                    if (navPanelTopPos >= categoryPanelTopPos && navPanelTopPos <= categoryPanelBottomPos) {
                        $(`[href="#list-category-${categoryId}"]`).parent().addClass("active");
                    } else {
                        $(`[href="#list-category-${categoryId}"]`).parent().removeClass("active");
                    }
                }
            }
        },

        _currentlyActiveCategoryProductCode() {
            const activeLinkHref = this.$tabListItems.filter(".active").children().attr("href");

            return activeLinkHref.substring(1, activeLinkHref.indexOf("-"));
        }
    })
};

controller.init();
