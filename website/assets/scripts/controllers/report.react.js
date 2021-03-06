CR.Controllers.Report = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState() {
            return {
                order: null,
                cvReport: null,
                coverLetterReport: null,
                linkedinProfileReport: null,
                cvReportScores: null,
                coverLetterReportScores: null,
                linkedinProfileReportScores: null,
                cvAverageScore: null,
                coverLetterAverageScore: null,
                linkedinProfileAverageScore: null,
                nbLastAssessmentsToTakeIntoAccount: null,
                selectedProductCode: null,
                dwsRootUrl: null
            };
        },

        render() {
            if (!this.state.order) {
                return null;
            }

            const order = this.state.order;
            const editionCode = order.getEdition().code;

            const editionClasses = "edition " + editionCode;
            const contentPanelClasses = order.isForConsultant() ? "consult" : null;
            const newAssessmentBtnLabel = CR.Services.Browser.isSmallScreen() ? null : CR.i18nMessages["dashboard.newAssessmentBtn.text"];
            const subTitle = order.getSoughtPosition() || order.getSoughtEmployer() ? <span>{order.getTitleForHtml()}</span> : null;

            const cvTabName = CR.Services.Browser.isSmallScreen() ? CR.i18nMessages["report.tabNameSmallScreen.CV_REVIEW"] : CR.i18nMessages["product.name.CV_REVIEW"];
            const coverLetterTabName = CR.Services.Browser.isSmallScreen() ? CR.i18nMessages["report.tabNameSmallScreen.COVER_LETTER_REVIEW"] : CR.i18nMessages["product.name.COVER_LETTER_REVIEW"];
            const linkedinProfileTabName = CR.Services.Browser.isSmallScreen() ? CR.i18nMessages["report.tabNameSmallScreen.LINKEDIN_PROFILE_REVIEW"] : CR.i18nMessages["product.name.LINKEDIN_PROFILE_REVIEW"];

            return (
                <div id="content" className={contentPanelClasses}>
                    <header id="header-with-new-assessment-btn">
                        <div>
                            <h1>{CR.i18nMessages["report.title"]}</h1>
                            <a className="btn btn-danger new-assessment" href="/order">{newAssessmentBtnLabel}
                                <i className="fa fa-plus"/>
                            </a>
                        </div>
                    </header>
                    <div className="with-circles">
                        {subTitle}
                        <header>
                            <p>
                                <span className="assessment-label light-font">{CR.i18nMessages["order.creationDate.label"]}:</span>{moment(order.getCreationTimestamp()).format("lll")}
                            </p>
                            <span className={editionClasses}>{CR.i18nMessages["edition.name." + editionCode]}</span>
                        </header>
                        <section>
                            <ul className="nav nav-pills" role="tablist">
                                <li role="presentation" id="nav-pill-cv">
                                    <a href="#CV_REVIEW-report-panel" aria-controls="CV_REVIEW-report-panel" role="tab" data-toggle="pill">{cvTabName}</a>
                                </li>
                                <li role="presentation" id="nav-pill-cover-letter">
                                    <a href="#COVER_LETTER_REVIEW-report-panel" aria-controls="COVER_LETTER_REVIEW-report-panel" role="tab" data-toggle="pill">{coverLetterTabName}</a>
                                </li>
                                <li role="presentation" id="nav-pill-linkedin-profile">
                                    <a href="#LINKEDIN_PROFILE_REVIEW-report-panel" aria-controls="LINKEDIN_PROFILE_REVIEW-report-panel" role="tab" data-toggle="pill">{linkedinProfileTabName}</a>
                                </li>
                                <li role="presentation" id="nav-pill-cv-consult">
                                    <a href="#CV_REVIEW_CONSULT-report-panel" aria-controls="CV_REVIEW_CONSULT-report-panel" role="tab" data-toggle="pill">{cvTabName}</a>
                                </li>
                                <li role="presentation" id="nav-pill-linkedin-profile-consult">
                                    <a href="#LINKEDIN_PROFILE_REVIEW_CONSULT-report-panel" aria-controls="LINKEDIN_PROFILE_REVIEW_CONSULT-report-panel" role="tab" data-toggle="pill">{linkedinProfileTabName}</a>
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
                                <div role="tabpanel" className="tab-pane fade in active" id="CV_REVIEW_CONSULT-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.CV_REVIEW_CONSULT)}
                                </div>
                                <div role="tabpanel" className="tab-pane fade" id="LINKEDIN_PROFILE_REVIEW_CONSULT-report-panel">
                                    {this._getDocumentReportSection(CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT)}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            );
        },

        componentDidUpdate() {
            this._initElements();
            this.$tabs.on("shown.bs.tab", this._placeScoreCursors);
            this.$expandablePanels.makeExpandable();
            this._selectTabForSelectedProduct();
        },

        _initElements() {
            this.$tabList = $("#content").find("ul[role=tablist]");
            this.$tabs = this.$tabList.find("a");

            const $docPanels = $(".tab-pane");

            const productCodeCvReview = this.state.order.isForConsultant() ? CR.Models.Product.codes.CV_REVIEW_CONSULT : CR.Models.Product.codes.CV_REVIEW;

            this.$cvPanel = $docPanels.filter(`#${productCodeCvReview}-report-panel`);
            this.$cvScoreCursor = this.$cvPanel.find("#score-bar").children("span");

            this.$coverLetterPanel = $docPanels.filter("#" + CR.Models.Product.codes.COVER_LETTER_REVIEW + "-report-panel");
            this.$coverLetterScoreCursor = this.$coverLetterPanel.find("#score-bar").children("span");

            const productCodeLinkedinProfileReview = this.state.order.isForConsultant() ? CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT : CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW;

            this.$linkedinProfilePanel = $docPanels.filter(`#${productCodeLinkedinProfileReview}-report-panel`);
            this.$linkedinProfileScoreCursor = this.$linkedinProfilePanel.find("#score-bar").children("span");

            this.$expandablePanels = $docPanels.find(".expandable-panel");
        },

        _placeScoreCursors() {
            const cvReportScores = this.state.cvReportScores;

            if (cvReportScores) {
                this._animateScoreCursor(this.$cvScoreCursor, cvReportScores.globalScore);
            }

            const coverLetterReportScores = this.state.coverLetterReportScores;

            if (coverLetterReportScores) {
                this._animateScoreCursor(this.$coverLetterScoreCursor, coverLetterReportScores.globalScore);
            }

            const linkedinProfileReportScores = this.state.linkedinProfileReportScores;

            if (linkedinProfileReportScores) {
                this._animateScoreCursor(this.$linkedinProfileScoreCursor, linkedinProfileReportScores.globalScore);
            }
        },

        _animateScoreCursor($cursor, score) {
            $cursor.css("left", 0);
            TweenLite.to($cursor, 1, {left: score + "%", ease: Power4.easeInOut});
        },

        _selectTabForSelectedProduct() {
            this.$tabs.filter(`[aria-controls=${this.state.selectedProductCode}-report-panel]`).tab("show");
        },

        _getDocumentReportSection(productCode) {
            if (_.find(this.state.order.getProducts(), "code", productCode)) {
                productCode = CR.Models.Product.codeTranslatedToClassic(productCode);

                const documentUrl = this._getDocumentUrl(this.state.order.getId(), this.state.order.getIdInBase64(), productCode);
                const thumbnailUrl = this._getThumbnailUrl(this.state.order.getId(), productCode);

                let docReport = this.state.cvReport;
                let docReportScores = this.state.cvReportScores;

                if (productCode === CR.Models.Product.codes.COVER_LETTER_REVIEW) {
                    docReport = this.state.coverLetterReport;
                    docReportScores = this.state.coverLetterReportScores;
                } else if (productCode === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW) {
                    docReport = this.state.linkedinProfileReport;
                    docReportScores = this.state.linkedinProfileReportScores;
                }

                const reportAnalysisExplanationText = CR.i18nMessages["report.analysis.explanation.text"];
                const docLabel = CR.i18nMessages["report.analysis.explanation.docLabel." + productCode];
                const templatedExplanationText = CR.Services.String.template(reportAnalysisExplanationText, "docLabel", docLabel);

                const overallCommentParagraph = docReport.overallComment ? <p>{docReport.overallComment}</p> : null;

                return (
                    <div>
                        <section className="sheet-of-paper summary">
                            <h2>{CR.i18nMessages["report.summary.title"]}</h2>
                            <section>
                                <div className="centered-contents">
                                    <a href={documentUrl} target="_blank">
                                        <img src={thumbnailUrl} />
                                    </a>
                                    <div>
                                        <a href={documentUrl} target="_blank" className="pdf-link">{CR.i18nMessages["report.summary.documentLink.text"]}</a>
                                    </div>
                                </div>
                                <div className="report-summary-text-wrapper">
                                    {overallCommentParagraph}
                                    <p className="light-font" dangerouslySetInnerHTML={{__html: this._getSummary(productCode, docReportScores.globalScore)}} />
                                </div>
                            </section>
                            <article className="global-score-wrapper">
                                <section>
                                    <p>{CR.i18nMessages["report.summary.score.label"]}:</p>
                                    <p>{docReportScores.globalScore}</p>
                                </section>
                                <section>
                                    <div className="score-bar-text-labels">
                                        <span className="score-bar-text-label weak">{CR.i18nMessages["report.summary.score.bar.label.weak"]}</span>
                                        <span className="score-bar-text-label good">{CR.i18nMessages["report.summary.score.bar.label.good"]}</span>
                                        <span className="score-bar-text-label excellent">{CR.i18nMessages["report.summary.score.bar.label.excellent"]}</span>
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
                                    <span>{CR.i18nMessages["report.summary.understandYourScore.title"]}</span>
                                    <button className="styleless"/>
                                </header>
                                <div>
                                    <p className="score-explanation-paragraph" dangerouslySetInnerHTML={{__html: CR.i18nMessages["report.summary.understandYourScore.cScoreExplanation.text"]}} />
                                    <ul className="styleless">
                                        <li>
                                            <div className="highlighted-number weak">
                                                <span>0</span>
                                                <span className="separator small-screen">|</span>
                                                <span className="separator large-screen">-</span>
                                                <span>36</span>
                                            </div>
                                            <p className="light-font">{CR.i18nMessages["report.summary.understandYourScore.weak.text"]}</p>
                                        </li>
                                        <li>
                                            <div className="highlighted-number good">
                                                <span>37</span>
                                                <span className="separator small-screen">|</span>
                                                <span className="separator large-screen">-</span>
                                                <span>79</span>
                                            </div>
                                            <p className="light-font">{CR.i18nMessages["report.summary.understandYourScore.good.text"]}</p>
                                        </li>
                                        <li>
                                            <div className="highlighted-number excellent">
                                                <span>80</span>
                                                <span className="separator small-screen">|</span>
                                                <span className="separator large-screen">-</span>
                                                <span>100</span>
                                            </div>
                                            <p className="light-font">{CR.i18nMessages["report.summary.understandYourScore.excellent.text"]}</p>
                                        </li>
                                    </ul>
                                </div>
                            </article>
                        </section>
                        <section className="report-analysis">
                            <header className="sheet-of-paper">
                                <h2>{CR.i18nMessages["report.analysis.title"]}</h2>
                                <p className="light-font" dangerouslySetInnerHTML={{__html: templatedExplanationText}} />
                            </header>
                            <ul className="styleless">
                            {this._getCategoriesAndTheirComments(docReport).map(function(categoryAndItsComments) {
                                const categoryId = categoryAndItsComments.categoryId;
                                const categoryClasses = "category sheet-of-paper id-" + categoryId;

                                let topCommentParagraph = null;

                                if (categoryAndItsComments.topComment) {
                                    topCommentParagraph = <p className="well">{categoryAndItsComments.topComment.text}</p>;
                                }

                                let redCommentList = null;

                                if (!_.isEmpty(categoryAndItsComments.redComments)) {
                                    redCommentList = (
                                        <ul className="red-comments light-font">
                                            {categoryAndItsComments.redComments.map(function(comment) {
                                                return <li key={comment.id} dangerouslySetInnerHTML={{__html: this._getCommentWithProcessedLinks(comment.text)}} />;
                                            }.bind(this))}
                                        </ul>
                                    );
                                }

                                return (
                                    <li key={categoryId} className={categoryClasses}>
                                        <header>
                                            <div>
                                                <h3>{CR.i18nMessages["category." + productCode + "." + categoryId + ".title"]}</h3>
                                                <span className="highlighted-number">{docReportScores.categoryScores[categoryId]}</span>
                                            </div>
                                            <p>{CR.i18nMessages["category." + productCode + "." + categoryId + ".shortDesc"]}</p>
                                        </header>
                                        {topCommentParagraph}
                                        {redCommentList}
                                    </li>
                                );
                            }.bind(this))}
                            </ul>
                        </section>
                    </div>
                );
            }

            const url = this.state.order.isForConsultant() ? "/order/consultant" : "/order";

            return (
                <div className="sheet-of-paper centered-contents">
                    <p>{CR.i18nMessages["report.unorderedAssessment.text"]}</p>
                    <a className="btn btn-danger new-assessment" href={url}>{CR.i18nMessages["report.unorderedAssessment.orderBtn.text"]}
                        <i className="fa fa-plus"/>
                    </a>
                </div>
            );
        },

        _getDocumentUrl(orderId, orderIdInBase64, productCode) {
            switch (productCode) {
                case CR.Models.Product.codes.CV_REVIEW:
                case CR.Models.Product.codes.CV_REVIEW_CONSULT:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cv?token=" + orderIdInBase64;
                case CR.Models.Product.codes.COVER_LETTER_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cover-letter?token=" + orderIdInBase64;
                default:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/linkedin-profile?token=" + orderIdInBase64;
            }
        },

        _getThumbnailUrl(orderId, productCode) {
            switch (productCode) {
                case CR.Models.Product.codes.CV_REVIEW:
                case CR.Models.Product.codes.CV_REVIEW_CONSULT:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cv/thumbnail";
                case CR.Models.Product.codes.COVER_LETTER_REVIEW:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/cover-letter/thumbnail";
                default:
                    return this.state.dwsRootUrl + "docs/" + orderId + "/linkedin-profile/thumbnail";
            }
        },

        _getCommentWithProcessedLinks(commentText) {
            return commentText.replace(/\{link:(.+)\}(.+)\{\/link\}/, "<a href=\"$1\" target=\"_blank\">$2</a>");
        },

        _getCategoriesAndTheirComments(docReport) {
            const categoriesAndTheirComments = [];

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

            return categoriesAndTheirComments;
        },

        _getSummary(productCode, globalScore) {
            const reportSummaryKey = this._getTheRightReportSummaryKey(productCode, globalScore);

            return this._getTemplatedSummary(CR.Models.Product.codeTranslatedToClassic(productCode), globalScore, reportSummaryKey);
        },

        _getTheRightReportSummaryKey(productCode, globalScore) {
            return _.find(Object.keys(CR.i18nMessages).sort().reverse(), function(key) {
                const keyPrefix = "reportSummary" + CR.propertyFile.key.word.separator + CR.Models.Product.codeTranslatedToClassic(productCode) + CR.propertyFile.key.word.separator;

                if (_.startsWith(key, keyPrefix)) {
                    const startIndex = keyPrefix.length;
                    const minScore = key.substring(startIndex);

                    return globalScore >= minScore;
                }

                return false;
            });
        },

        _getTemplatedSummary(productCode, globalScore, reportSummaryKey) {
            const summaryWithOneVariableReplaced = CR.Services.String.template(CR.i18nMessages[reportSummaryKey], "score", globalScore);
            const summaryWithTwoVariablesReplaced = CR.Services.String.template(summaryWithOneVariableReplaced, "nbLastAssessmentsToTakeIntoAccount", this.state.nbLastAssessmentsToTakeIntoAccount);

            let thirdReplacementValue = this.state.cvAverageScore;

            if (productCode === CR.Models.Product.codes.COVER_LETTER_REVIEW) {
                thirdReplacementValue = this.state.coverLetterAverageScore;
            } else if (productCode === CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW) {
                thirdReplacementValue = this.state.linkedinProfileAverageScore;
            }

            return CR.Services.String.template(summaryWithTwoVariablesReplaced, "averageScore", thirdReplacementValue);
        }
    });

    c.init = function(i18nMessages, assessmentReport, assessmentReportScores, cvAverageScore, coverLetterAverageScore, linkedinProfileAverageScore, nbLastAssessmentsToTakeIntoAccount, selectedProductCode, dwsRootUrl) {
        CR.i18nMessages = i18nMessages;
        this.order = CR.Models.Order(assessmentReport.order);

        this.cvReport = assessmentReport.cvReport;
        this.coverLetterReport = assessmentReport.coverLetterReport;
        this.linkedinProfileReport = assessmentReport.linkedinProfileReport;

        this.cvReportScores = assessmentReportScores.cvReportScores;
        this.coverLetterReportScores = assessmentReportScores.coverLetterReportScores;
        this.linkedinProfileReportScores = assessmentReportScores.linkedinProfileReportScores;

        this.cvAverageScore = cvAverageScore;
        this.coverLetterAverageScore = coverLetterAverageScore;
        this.linkedinProfileAverageScore = linkedinProfileAverageScore;

        this.nbLastAssessmentsToTakeIntoAccount = nbLastAssessmentsToTakeIntoAccount;

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
            cvAverageScore: this.cvAverageScore,
            coverLetterAverageScore: this.coverLetterAverageScore,
            linkedinProfileAverageScore: this.linkedinProfileAverageScore,
            nbLastAssessmentsToTakeIntoAccount: this.nbLastAssessmentsToTakeIntoAccount,
            selectedProductCode: this.selectedProductCode,
            dwsRootUrl: this.dwsRootUrl
        });
    };
});
