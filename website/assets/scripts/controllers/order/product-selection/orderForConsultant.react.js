CR.Controllers.OrderForConsultant = P(function(c) {
    c.reactClass = React.createClass({
        getInitialState() {
            return {
                products: [],
                supportedLanguages: [],
                currentLanguageCode: null,
                controller: null
            };
        },

        render() {
            const title = CR.Services.Browser.isSmallScreen() ? CR.i18nMessages["order.consult.title"] : CR.i18nMessages["order.consult.title.largeScreen"];

            return (
                <div id="content">
                    <header>
                        <div>
                            <h1>{title}</h1>
                            <CR.Controllers.LanguageSelectionInHeader supportedLanguages={this.state.supportedLanguages} currentLanguageCode={this.state.currentLanguageCode} url="/order/consultant" />
                        </div>
                    </header>
                    <div className="with-circles">
                        <span>{CR.i18nMessages["order.productSelection.subtitle"]}</span>

                        <CR.Controllers.OrderStepBreadcrumbs step={CR.Controllers.OrderCommon.steps.productSelection} />
                        <CR.Controllers.ProductsSection products={this.state.products} currentLanguageCode={this.state.currentLanguageCode} controller={this.state.controller}/>

                        <section id="section-with-link-to-classic-products" className="two-columns widow">
                            <header/>
                            <div>
                                <div className="centered-contents">
                                    <a href={`/order${window.location.search}`}>{CR.i18nMessages["order.consult.switchToClassic.link.text"]}</a>
                                </div>
                            </div>
                        </section>

                        <CR.Controllers.OrderLanguageSelection supportedLanguages={this.state.supportedLanguages} currentLanguageCode={this.state.currentLanguageCode} url="/order/consultant" />
                        <CR.Controllers.CartSection products={this.state.products} controller={this.state.controller} />

                        <form onSubmit={this._handleSubmit} className="centered-contents">
                            <p className="other-form-error" id="empty-cart">{CR.i18nMessages["order.productSelection.validation.emptyCart"]}</p>
                            <button type="submit" className="btn btn-lg btn-primary">{CR.i18nMessages["order.productSelection.submitBtn.text"]}</button>
                        </form>
                    </div>
                </div>
            );
        },

        componentDidUpdate() {
            this._initElements();
            this._initValidation();

            if (!_.isEmpty(CR.order.getProducts())) {
                this.validator.hideErrorMessage(this.$emptyCartError);
            }
        },

        _initElements() {
            const $content = $("#content");

            this.$otherFormErrors = $content.find(".other-form-error");
            this.$emptyCartError = this.$otherFormErrors.filter("#empty-cart");

            // Coupon form
            this.$couponForm = $content.find("#cart-section").find("form");
            this.$couponCodeField = this.$couponForm.find("#coupon-code");
            this.$addCouponBtn = this.$couponForm.find("#add-coupon-btn");
            this.$couponNotFoundError = this.$otherFormErrors.filter("#coupon-not-found-error");
            this.$couponExpiredError = this.$otherFormErrors.filter("#coupon-expired-error");
        },

        _initValidation() {
            this.validator = CR.Services.Validator();
        },

        _handleSubmit(e) {
            e.preventDefault();

            this.validator.hideErrorMessage(this.$otherFormErrors);

            if (_.isEmpty(CR.order.getProducts())) {
                this.validator.showErrorMessage(this.$emptyCartError);
            } else {
                const couponCodeField = this.$couponCodeField.val();

                if (couponCodeField) {
                    const type = "GET";
                    const url = "/api/coupons/" + couponCodeField;
                    const httpRequest = new XMLHttpRequest();

                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState === XMLHttpRequest.DONE) {
                            this.$addCouponBtn.disableLoading();
                            this.$couponCodeField.blur();

                            let coupon;

                            switch (httpRequest.status) {
                                case CR.httpStatusCodes.noContent:
                                    this.validator.showErrorMessage(this.$couponNotFoundError);
                                    break;
                                case CR.httpStatusCodes.couponExpired:
                                    coupon = JSON.parse(httpRequest.responseText);
                                    this.$couponExpiredError[0].innerText = coupon.couponExpiredMsg;
                                    this.validator.showErrorMessage(this.$couponExpiredError);
                                    break;
                                case CR.httpStatusCodes.ok:
                                    coupon = JSON.parse(httpRequest.responseText);
                                    this.$couponForm[0].reset();

                                    CR.order.setCoupon(coupon);
                                    CR.order.saveInLocalStorage();

                                    location.href = "/order/assessment-info";
                                    break;
                                default:
                                    alert("AJAX failure doing a " + type + " request to \"" + url + "\"");
                            }
                        }
                    }.bind(this);
                    httpRequest.open(type, url);
                    httpRequest.setRequestHeader("Content-Type", "application/json");
                    httpRequest.send();
                } else {
                    location.href = "/order/assessment-info";
                }
            }
        }
    });

    c.init = function(i18nMessages, products, reductions, loggedInAccount, supportedLanguages) {
        CR.i18nMessages = i18nMessages;
        CR.products = products;
        CR.reductions = reductions;
        CR.loggedInAccount = loggedInAccount;
        this.supportedLanguages = supportedLanguages;

        const orderFromLocalStorage = CR.Services.Browser.getFromLocalStorage(CR.localStorageKeys.order);

        CR.order = CR.Models.Order(orderFromLocalStorage);
        this._removeProductsExceptForConsultant();
        CR.order.setEdition(null);
        CR.order.saveInLocalStorage();

        this.reactInstance = ReactDOM.render(
            React.createElement(this.reactClass),
            document.querySelector("[role=main]")
        );

        this.reRender();
    };

    c.reRender = function() {
        this.reactInstance.replaceState({
            products: this._getProducts(),
            supportedLanguages: this.supportedLanguages,
            currentLanguageCode: $("html").attr("lang"),
            controller: this
        });
    };

    c._getProducts = function() {
        const products = CR.products ? _.cloneDeep(CR.products) : [];
        const orderProducts = CR.order.getProducts();

        for (let i = 0; i < products.length; i++) {
            const sameProductInOrder = _.find(orderProducts, function(orderProduct) {
                return products[i].id === orderProduct.id;
            });

            if (sameProductInOrder) {
                products[i] = _.cloneDeep(sameProductInOrder);
            }
        }

        return products;
    };

    c._removeProductsExceptForConsultant = function() {
        const products = _.cloneDeep(CR.order.getProducts());

        // Not using `for of` because of an issue in IE after Babel transpilation
        products.forEach(p => {
            if (p.code !== CR.Models.Product.codes.CV_REVIEW_CONSULT && p.code !== CR.Models.Product.codes.LINKEDIN_PROFILE_REVIEW_CONSULT) {
                CR.order.removeProduct(p);
            }
        });
    };
});
