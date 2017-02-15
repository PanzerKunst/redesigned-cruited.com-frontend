import {localStorageKeys} from "../../global";
import Browser from "../../services/browser";
import String from "../../services/string";
import {makeExpandable} from "../../services/expandablePanel";
import Category from "../../models/category";
import Product from "../../models/product";
import Order from "../../models/order";
import store from "./store";

const controller = {
    init() {
        store.reactComponent = ReactDOM.render(
            React.createElement(this.reactComponent),
            document.querySelector("[role=main]")
        );

        store.init();
    },

    reactComponent: React.createClass({
        render() {
            const order = store.order;
            const editionCode = order.editionCode;

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{store.i18nMessages["report.title"]}</h1>
                            {this._headerButtons()}
                        </div>
                    </header>
                    <div className="with-circles">
                        {this._subTitle()}
                        <header>
                            <p>
                                <span className="assessment-label light-font">{store.i18nMessages["report.orderCreationDate.label"]}:</span>{moment(order.creationTimestamp).format("lll")}
                            </p>
                            <span className={`edition ${editionCode}`}>{store.i18nMessages[`edition.name.${editionCode}`]}</span>
                        </header>
                        <section>
                            <ul className="nav nav-pills" role="tablist">
                                {this._tab(Category.productCodes.cv, true)}
                                {this._tab(Category.productCodes.coverLetter)}
                                {this._tab(Category.productCodes.linkedinProfile)}
                            </ul>

                            <div className="tab-content">
                                {this._tabPane(Category.productCodes.cv, true)}
                                {this._tabPane(Category.productCodes.coverLetter)}
                                {this._tabPane(Category.productCodes.linkedinProfile)}
                            </div>
                        </section>
                    </div>
                </div>);
        },

        componentDidMount() {
            this._initElements();

            this._disableHeaderButtonsIfRequired();
            this._placeScoreCursors();
            this.$tabs.on("shown.bs.tab", this._placeScoreCursors);
            makeExpandable(this.$expandablePanels);

            this._selectTabOfCurrentlyAssessedDoc();
        },

        _initElements() {
            const $content = $("#content");

            const $headerButtons = $content.find(".header-buttons").children();

            this.$headerActionButtons = $headerButtons.filter(".btn-primary");

            this.$tabList = $content.find("ul[role=tablist]");
            this.$tabs = this.$tabList.find("a");

            const $docPanels = $(".tab-pane");

            this.$cvPanel = $docPanels.filter(`#${Category.productCodes.cv}-report-panel`);
            this.$cvScoreCursor = this.$cvPanel.find("#score-bar").children("span");

            this.$coverLetterPanel = $docPanels.filter(`#${Category.productCodes.coverLetter}-report-panel`);
            this.$coverLetterScoreCursor = this.$coverLetterPanel.find("#score-bar").children("span");

            this.$linkedinProfilePanel = $docPanels.filter(`#${Category.productCodes.linkedinProfile}-report-panel`);
            this.$linkedinProfileScoreCursor = this.$linkedinProfilePanel.find("#score-bar").children("span");

            this.$expandablePanels = $docPanels.find(".expandable-panel");
        },

        _headerButtons() {
            let forFeedbackBtn = null;
            let scheduleBtn = null;

            if (store.order.status === Order.statuses.paid || store.order.status === Order.statuses.inProgress) {
                forFeedbackBtn = <button className="btn btn-primary" onClick={this._handleForFeedbackBtnClick}>Mark for feedback</button>;
            }

            if (store.order.status === Order.statuses.paid || store.order.status === Order.statuses.inProgress || store.order.status === Order.statuses.awaitingFeedback) {
                scheduleBtn = <button className="btn btn-primary" onClick={this._handleScheduleBtnClick}>Schedule</button>;
            }

            return (
                <div className="header-buttons">
                    <button className="btn secondary" onClick={this._handleBackLinkClick}>Go back</button>
                    {forFeedbackBtn}
                    {scheduleBtn}
                </div>);
        },

        _subTitle() {
            const order = store.order;

            if (order.positionSought && order.employerSought) {
                return <span>{`${order.positionSought} - ${order.employerSought}`}</span>;
            }
            if (order.positionSought) {
                return <span>{order.positionSought}</span>;
            }
            if (order.employerSought) {
                return <span>{order.employerSought}</span>;
            }

            return null;
        },

        _disableHeaderButtonsIfRequired() {
            if (this._isOneOfTheReportsMissing()) {
                this.$headerActionButtons.prop("disabled", true);
            }
        },

        _isOneOfTheReportsMissing() {
            return (_.includes(store.order.containedProductCodes, Product.codes.cv) && !store.cvReport) ||
                (_.includes(store.order.containedProductCodes, Product.codes.coverLetter) && !store.coverLetterReport) ||
                (_.includes(store.order.containedProductCodes, Product.codes.linkedinProfile) && !store.linkedinProfileReport);
        },

        _placeScoreCursors() {
            const cvReportScores = store.cvReportScores;
            const coverLetterReportScores = store.coverLetterReportScores;
            const linkedinProfileReportScores = store.linkedinProfileReportScores;

            if (cvReportScores) {
                this._animateScoreCursor(this.$cvScoreCursor, cvReportScores.globalScore);
            }

            if (coverLetterReportScores) {
                this._animateScoreCursor(this.$coverLetterScoreCursor, coverLetterReportScores.globalScore);
            }

            if (linkedinProfileReportScores) {
                this._animateScoreCursor(this.$linkedinProfileScoreCursor, linkedinProfileReportScores.globalScore);
            }
        },

        _animateScoreCursor($cursor, score) {
            $cursor.css("left", 0);
            TweenLite.to($cursor, 1, {left: `${score}%`, ease: Power4.easeInOut});
        },

        _selectTabOfCurrentlyAssessedDoc() {
            const categoryProductCode = Browser.getFromLocalStorage(localStorageKeys.currentlyAssessedDoc);

            if (categoryProductCode) {
                this.$tabs.filter(`[aria-controls=${categoryProductCode}-report-panel]`).tab("show");
            }
        },

        _tab(categoryProductCode, isActive = false) {
            const classes = classNames({
                active: isActive
            });
            const attr = this._tabAttr(categoryProductCode);
            const label = Browser.isSmallScreen() ? store.i18nMessages[`report.tabNameSmallScreen.${categoryProductCode}`] : store.i18nMessages[`report.tabName.${categoryProductCode}`];

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
            const attr = this._tabAttr(categoryProductCode);

            return (
                <div role="tabpanel" className={classes} id={attr}>
                    {this._documentReportSection(categoryProductCode)}
                </div>);
        },

        _tabAttr(categoryProductCode) {
            return `${categoryProductCode}-report-panel`;
        },

        _documentReportSection(categoryProductCode) {
            const productCode = Product.codes[categoryProductCode];

            if (!_.includes(store.order.containedProductCodes, productCode)) {
                return (
                    <div className="sheet-of-paper centered-contents">
                        <p>{store.i18nMessages["report.unorderedAssessment.text"]}</p>
                        <a className="btn btn-danger new-assessment" href="/order">
                            <span>{store.i18nMessages["report.unorderedAssessment.orderBtn.text"]}</span>
                            <i className="fa fa-plus"/>
                        </a>
                    </div>);
            }

            const documentUrl = store.order.documentUrl(store.config, productCode);
            const thumbnailUrl = store.order.thumbnailUrl(store.config, productCode);

            let docReport = store.cvReport;
            let docReportScores = store.cvReportScores;

            if (categoryProductCode === Category.productCodes.coverLetter) {
                docReport = store.coverLetterReport;
                docReportScores = store.coverLetterReportScores;
            } else if (categoryProductCode === Category.productCodes.linkedinProfile) {
                docReport = store.linkedinProfileReport;
                docReportScores = store.linkedinProfileReportScores;
            }

            if (!docReport) {
                return (
                    <div className="sheet-of-paper centered-contents">
                        <p>Assessment incomplete</p>
                    </div>);
            }

            const reportAnalysisExplanationText = store.i18nMessages["report.analysis.explanation.text"];
            const docLabel = store.i18nMessages[`report.analysis.explanation.docLabel.${categoryProductCode}`];
            const templatedExplanationText = String.template(reportAnalysisExplanationText, "docLabel", docLabel);

            const overallCommentParagraph = docReport.overallComment ? <p>{docReport.overallComment}</p> : null;

            return (
                <div>
                    <section className="sheet-of-paper summary">
                        <h2>{store.i18nMessages["report.summary.title"]}</h2>
                        <section>
                            <div className="doc-preview centered-contents">
                                <a href={documentUrl} target="_blank">
                                    <img src={thumbnailUrl} />
                                </a>
                                <div>
                                    <a href={documentUrl} target="_blank" className="pdf-link">{store.i18nMessages["report.summary.documentLink.text"]}</a>
                                </div>
                            </div>
                            <div className="report-summary-text">
                                {overallCommentParagraph}
                                <p className="light-font" dangerouslySetInnerHTML={{__html: this._summary(categoryProductCode, docReportScores.globalScore)}} />
                            </div>
                        </section>
                        <article className="global-score-wrapper">
                            <section>
                                <p>{store.i18nMessages["report.summary.score.label"]}:</p>
                                <p>{docReportScores.globalScore}</p>
                            </section>
                            <section>
                                <div className="score-bar-text-labels">
                                    <span className="score-bar-text-label weak">{store.i18nMessages["report.summary.score.bar.label.weak"]}</span>
                                    <span className="score-bar-text-label good">{store.i18nMessages["report.summary.score.bar.label.good"]}</span>
                                    <span className="score-bar-text-label excellent">{store.i18nMessages["report.summary.score.bar.label.excellent"]}</span>
                                </div>
                                <div id="score-bar">
                                    <img src="/assets/images/score-bar.png" />
                                    <span/>
                                </div>
                                <div className="score-bar-number-labels">
                                    <span>0</span>
                                    <span>100</span>
                                </div>
                            </section>
                        </article>
                        <article className="expandable-panel">
                            <header>
                                <span>{store.i18nMessages["report.summary.understandYourScore.title"]}</span>
                                <button className="styleless"/>
                            </header>
                            <div>
                                <p className="score-explanation-paragraph" dangerouslySetInnerHTML={{__html: store.i18nMessages["report.summary.understandYourScore.cScoreExplanation.text"]}} />
                                <ul className="styleless">
                                    <li>
                                        <div className="highlighted-number weak">
                                            <span>0</span>
                                            <span className="separator small-screen">|</span>
                                            <span className="separator large-screen">-</span>
                                            <span>36</span>
                                        </div>
                                        <p className="score-explanation-text light-font">{store.i18nMessages["report.summary.understandYourScore.weak.text"]}</p>
                                    </li>
                                    <li>
                                        <div className="highlighted-number good">
                                            <span>37</span>
                                            <span className="separator small-screen">|</span>
                                            <span className="separator large-screen">-</span>
                                            <span>79</span>
                                        </div>
                                        <p className="score-explanation-text light-font">{store.i18nMessages["report.summary.understandYourScore.good.text"]}</p>
                                    </li>
                                    <li>
                                        <div className="highlighted-number excellent">
                                            <span>80</span>
                                            <span className="separator small-screen">|</span>
                                            <span className="separator large-screen">-</span>
                                            <span>100</span>
                                        </div>
                                        <p className="score-explanation-text light-font">{store.i18nMessages["report.summary.understandYourScore.excellent.text"]}</p>
                                    </li>
                                </ul>
                            </div>
                        </article>
                    </section>
                    <section className="report-analysis">
                        <header className="sheet-of-paper">
                            <h2>{store.i18nMessages["report.analysis.title"]}</h2>
                            <p className="light-font" dangerouslySetInnerHTML={{__html: templatedExplanationText}} />
                        </header>
                        <ul className="styleless">
                            {this._categoriesAndTheirComments(docReport).map(categoryAndItsComments => {
                                let topCommentParagraph = null;

                                if (categoryAndItsComments.topComment) {
                                    topCommentParagraph = <p className="well">{categoryAndItsComments.topComment.text}</p>;
                                }

                                let redCommentList = null;

                                if (!_.isEmpty(categoryAndItsComments.redComments)) {
                                    redCommentList = (
                                        <ul className="red-comments light-font">
                                            {categoryAndItsComments.redComments.map(comment => <li key={comment.defaultCommentId || String.uuid()} dangerouslySetInnerHTML={{__html: this._commentWithProcessedLinks(comment.text)}} />)}
                                        </ul>
                                    );
                                }

                                const categoryId = categoryAndItsComments.categoryId;

                                return (
                                    <li key={categoryId} className={`category sheet-of-paper id-${categoryId}`}>
                                        <header>
                                            <div className="category-title">
                                                <h3>{store.i18nMessages[`category.title.${categoryId}`]}</h3>
                                                <span className="highlighted-number">{docReportScores.categoryScores[categoryId]}</span>
                                            </div>
                                            <p className="category-short-desc">{store.i18nMessages[`category.shortDesc.${categoryId}`]}</p>
                                        </header>
                                        {topCommentParagraph}
                                        {redCommentList}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </div>);
        },

        _commentWithProcessedLinks(commentText) {
            return commentText.replace(/\{link:(.+)}(.+)\{\/link}/, "<a href=\"$1\" target=\"_blank\">$2</a>");
        },

        _categoriesAndTheirComments(docReport) {
            const categoriesAndTheirComments = [];

            // For each red comment
            docReport.redComments.forEach(comment => {
                let categoryIndex = -1;

                for (let i = 0; i < categoriesAndTheirComments.length; i++) {
                    if (categoriesAndTheirComments[i].categoryId === comment.categoryId) {
                        categoryIndex = i;
                        break;
                    }
                }

                // If the comment's category is not in categoriesAndTheirComments
                if (categoryIndex === -1) {

                    // Add the category to categoriesAndTheirComments
                    categoriesAndTheirComments.push({
                        categoryId: comment.categoryId,
                        redComments: [comment]
                    });
                } else {    // If it's already in categoriesAndTheirComments
                    // Then add the comment to the list of comments for that category
                    categoriesAndTheirComments[categoryIndex].redComments.push(comment);
                }
            });

            docReport.wellDoneComments.forEach(comment => {
                let categoryIndex = -1;

                for (let i = 0; i < categoriesAndTheirComments.length; i++) {
                    if (categoriesAndTheirComments[i].categoryId === comment.categoryId) {
                        categoryIndex = i;
                        break;
                    }
                }

                if (categoryIndex === -1) {
                    categoriesAndTheirComments.push({
                        categoryId: comment.categoryId,
                        topComment: comment
                    });
                } else {
                    categoriesAndTheirComments[categoryIndex].topComment = comment;
                }
            });

            return categoriesAndTheirComments;
        },

        _summary(categoryProductCode, globalScore) {
            const reportSummaryKey = this._correctReportSummaryKey(categoryProductCode, globalScore);

            return this._templatedSummary(categoryProductCode, globalScore, reportSummaryKey);
        },

        _correctReportSummaryKey(categoryProductCode, globalScore) {
            return _.find(Object.keys(store.i18nMessages).sort().reverse(), key => {
                const keyPrefix = `report.summary.${categoryProductCode}.`;

                if (_.startsWith(key, keyPrefix)) {
                    const startIndex = keyPrefix.length;
                    const minScore = key.substring(startIndex);

                    return globalScore >= minScore;
                }

                return false;
            });
        },

        _templatedSummary(categoryProductCode, globalScore, reportSummaryKey) {
            const summaryWithOneVariableReplaced = String.template(store.i18nMessages[reportSummaryKey], "score", globalScore);
            const summaryWithTwoVariablesReplaced = String.template(summaryWithOneVariableReplaced, "nbLastAssessmentsToTakeIntoAccount", store.config.nbLastAssessmentsToTakeIntoAccount);

            let thirdReplacementValue = store.cvAverageScore;

            if (categoryProductCode === Category.productCodes.coverLetter) {
                thirdReplacementValue = store.coverLetterAverageScore;
            } else if (categoryProductCode === Category.productCodes.linkedinProfile) {
                thirdReplacementValue = store.linkedinProfileAverageScore;
            }

            return String.template(summaryWithTwoVariablesReplaced, "averageScore", thirdReplacementValue);
        },

        _handleBackLinkClick() {
            history.back();
        },

        _handleScheduleBtnClick() {
            store.updateOrderStatus(Order.statuses.scheduled);
        },

        _handleForFeedbackBtnClick() {
            store.updateOrderStatus(Order.statuses.awaitingFeedback);
        }
    })
};

controller.init();
