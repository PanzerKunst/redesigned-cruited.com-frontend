"use strict";

CR.Controllers.Report = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState: function() {
            return {
                order: null,
                cvReport: null,
                coverLetterReport: null,
                linkedinProfileReport: null,
                cvReportScores: null,
                coverLetterReportScores: null,
                linkedinProfileReportScores: null,
                selectedProductCode: null,
                dwsRootUrl: null
            };
        },

        render: function() {
            if (!this.state.order) {
                return null;
            }

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{CR.i18nMessages["report.title"]}</h1>
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{this.state.order.getTitleForHtml()}</span>
                        {this._getGlobalSection()}
                        <section>
                            <ul className="nav nav-pills" role="tablist">
                                <li role="presentation">
                                    <a href="#CV_REVIEW-report-panel" aria-controls="CV_REVIEW-report-panel" role="tab" data-toggle="pill">{CR.i18nMessages["product.name.CV_REVIEW"]}</a>
                                </li>
                                <li role="presentation">
                                    <a href="#COVER_LETTER_REVIEW-report-panel" aria-controls="COVER_LETTER_REVIEW-report-panel" role="tab" data-toggle="pill">{CR.i18nMessages["product.name.COVER_LETTER_REVIEW"]}</a>
                                </li>
                                <li role="presentation">
                                    <a href="#LINKEDIN_PROFILE_REVIEW-report-panel" aria-controls="LINKEDIN_PROFILE_REVIEW-report-panel" role="tab" data-toggle="pill">{CR.i18nMessages["product.name.LINKEDIN_PROFILE_REVIEW"]}</a>
                                </li>
                            </ul>

                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane fade in active" id="CV_REVIEW-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.CV_REVIEW)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="COVER_LETTER_REVIEW-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.COVER_LETTER_REVIEW)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="LINKEDIN_PROFILE_REVIEW-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW)}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            );
        },

        componentDidUpdate: function() {
            this._initElements();
            this._selectTabForSelectedProduct();
        },

        _initElements: function() {
            this.$tabList = $("#content").find("ul[role=tablist]");
            this.$tabs = this.$tabList.find("a");
        },

        _selectTabForSelectedProduct: function() {
            this.$tabs.filter("[aria-controls=" + this.state.selectedProductCode + "-report-panel]").tab("show");
        },

        _getGlobalSection: function() {
            return (
                <section>
                    <p>
                        <span>{CR.i18nMessages["order.creationDate.label"]}:</span> {moment(this.state.order.getCreationTimestamp()).format("lll")}
                    </p>
                    <div>
                        <span>{CR.i18nMessages["order.status.label"]}:</span> {this.state.order.getStatusForHtml()}
                        <span>{this.state.order.getEditionForHtml()}</span>
                    </div>
                </section>
            );
        },

        _getDocumentReportSection: function(productCode) {
            if (_.find(this.state.order.getProducts(), "code", productCode)) {
                let documentUrl = this._getDocumentUrl(this.state.order.getId(), this.state.order.getIdInBase64(), productCode);
                let thumbnailUrl = this._getThumbnailUrl(this.state.order.getId(), productCode);

                let docReport = this.state.cvReport;
                let docReportScores = this.state.cvReportScores;
                if (productCode === CR.Models.Product.codes.COVER_LETTER_REVIEW) {
                    docReport = this.state.coverLetterReport;
                    docReportScores = this.state.coverLetterReportScores;
                } else if (productCode === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW) {
                    docReport = this.state.linkedinProfileReport;
                    docReportScores = this.state.linkedinProfileReportScores;
                }

                let categoriesAndTheirComments = [];

                // For each red comment
                docReport.redComments.forEach(function(comment) {
                    let categoryIndex = -1;
                    for (let i = 0; i < categoriesAndTheirComments.length; i++) {
                        if (categoriesAndTheirComments[i].categoryId === comment.category.id) {
                            categoryIndex = i;
                            break;
                        }
                    }

                    // If the comment's category is not in categoriesAndTheirComments
                    if (categoryIndex === -1) {
                        // Add the category to categoriesAndTheirComments
                        categoriesAndTheirComments.push({
                            categoryId: comment.category.id,
                            redComments: [comment]
                        });
                    } else {    // If it's already in categoriesAndTheirComments
                        // Then add the comment to the list of comments for that category
                        categoriesAndTheirComments[categoryIndex].redComments.push(comment);
                    }
                });

                docReport.topComments.forEach(function(comment) {
                    let categoryIndex = -1;
                    for (let i = 0; i < categoriesAndTheirComments.length; i++) {
                        if (categoriesAndTheirComments[i].categoryId === comment.category.id) {
                            categoryIndex = i;
                            break;
                        }
                    }

                    if (categoryIndex === -1) {
                        categoriesAndTheirComments.push({
                            categoryId: comment.category.id,
                            topComment: comment
                        });
                    } else {
                        categoriesAndTheirComments[categoryIndex].topComment = comment;
                    }
                });

                return (
                    <div>
                        <section className="summary">
                            <h2>{CR.i18nMessages["report.summary.title"]}</h2>
                            <img src={thumbnailUrl} />
                            <a href={documentUrl}>{CR.i18nMessages["report.document.link.text"]}</a>
                            <span>{CR.i18nMessages["report.document.score.label"]}:</span>
                            <span>{docReportScores.globalScore}</span>
                        </section>
                        <section className="report-analysis">
                            <h2>{CR.i18nMessages["report.analysis.title"]}</h2>
                            <ul className="styleless">
                            {categoriesAndTheirComments.map(function(categoryAndItsComments) {
                                let reactItemId = "category-" + categoryAndItsComments.categoryId;

                                let topCommentParagraph = null;
                                if (categoryAndItsComments.topComment) {
                                    topCommentParagraph = <p>{categoryAndItsComments.topComment.text}</p>;
                                }

                                let redCommentList = null;
                                if (!_.isEmpty(categoryAndItsComments.redComments)) {
                                    redCommentList = (
                                        <ul className="styleless">
                                            {categoryAndItsComments.redComments.map(function(comment) {
                                                let reactSubItemId = "comment-" + comment.id;

                                                return <li key={reactSubItemId} className="red-comment">{comment.text}</li>;
                                            })}
                                        </ul>
                                    );
                                }

                                return (
                                    <li key={reactItemId}>
                                        <h3>{CR.i18nMessages["category." + productCode + "." + categoryAndItsComments.categoryId + ".title"]}</h3>
                                        <p>{CR.i18nMessages["category." + productCode + "." + categoryAndItsComments.categoryId + ".shortDesc"]}</p>
                                        <span>{docReportScores.categoryScores[categoryAndItsComments.categoryId]}</span>
                                        {topCommentParagraph}
                                        {redCommentList}
                                    </li>
                                );
                            })}
                            </ul>
                        </section>
                    </div>
                );
            }

            return <a>Order this assessment</a>;
        },

        _getDocumentUrl: function(orderId, orderIdInBase64, productCode) {
            switch (productCode) {
                case CR.Models.Product.codes.CV_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cv?token=" + orderIdInBase64;
                case CR.Models.Product.codes.COVER_LETTER_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cover-letter?token=" + orderIdInBase64;
                default:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/linkedin-profile?token=" + orderIdInBase64;
            }
        },

        _getThumbnailUrl: function(orderId, productCode) {
            switch (productCode) {
                case CR.Models.Product.codes.CV_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cv/thumbnail";
                case CR.Models.Product.codes.COVER_LETTER_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cover-letter/thumbnail";
                default:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/linkedin-profile/thumbnail";
            }
        }
    });

    c.init = function(i18nMessages, assessmentReport, assessmentReportScores, selectedProductCode, dwsRootUrl) {
        CR.i18nMessages = i18nMessages;
        this.order = CR.Models.Order(assessmentReport.order);

        this.cvReport = assessmentReport.cvReport;
        this.coverLetterReport = assessmentReport.coverLetterReport;
        this.linkedinProfileReport = assessmentReport.linkedinProfileReport;

        this.cvReportScores = assessmentReportScores.cvReportScores;
        this.coverLetterReportScores = assessmentReportScores.coverLetterReportScores;
        this.linkedinProfileReportScores = assessmentReportScores.linkedinProfileReportScores;

        this.selectedProductCode = selectedProductCode;
        this.dwsRootUrl = dwsRootUrl;

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            order: this.order,
            cvReport: this.cvReport,
            coverLetterReport: this.coverLetterReport,
            linkedinProfileReport: this.linkedinProfileReport,
            cvReportScores: this.cvReportScores,
            coverLetterReportScores: this.coverLetterReportScores,
            linkedinProfileReportScores: this.linkedinProfileReportScores,
            selectedProductCode: this.selectedProductCode,
            dwsRootUrl: this.dwsRootUrl
        });
    };
});
