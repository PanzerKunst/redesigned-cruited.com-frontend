"use strict";

CR.Models.OrderStaticProps = {
    statusIds: {
        notPaid: -1,
        paid: 0,
        inProgress: 1,
        awaitingFeedback: 4,
        scheduled: 3,
        completed: 2
    },
    fileNamePrefixSeparator: "-"
};

CR.Models.Order = P(function(c) {
    c.init = function(order) {
        this._products = order && order.products ? _.cloneDeep(order.products) : [];
        if (_.isEmpty(this._products) && order && !_.isEmpty(order.containedProductCodes)) {
            this._products = order.containedProductCodes.map(function(productCode) {
                if (!_.isEmpty(CR.products)) {
                    const product = _.find(CR.products, "code", productCode);
                    if (product) {
                        return product;
                    }

                    return {code: productCode};
                }

                return {code: productCode};
            });
        }

        this._calculateReductions();

        this._coupon = order && order.coupon ? _.cloneDeep(order.coupon) : null;

        if (order && order.edition) {
            this._edition = _.cloneDeep(order.edition);
        } else if (!_.isEmpty(CR.editions)) {
            this._edition = CR.editions[0];
        }

        this._id = order && order.id ? order.id : null;
        this._idInBase64 = order && order.idInBase64 ? order.idInBase64 : null;
        this._cvFileName = order && order.cvFileName ? order.cvFileName : null;
        this._coverLetterFileName = order && order.coverLetterFileName ? order.coverLetterFileName : null;
        this._positionSought = order && order.positionSought ? order.positionSought : null;
        this._employerSought = order && order.employerSought ? order.employerSought : null;
        this._jobAdUrl = order && order.jobAdUrl ? order.jobAdUrl : null;
        this._jobAdFileName = order && order.jobAdFileName ? order.jobAdFileName : null;
        this._customerComment = order && order.customerComment ? order.customerComment : null;
        this._status = order && order.status !== null ? order.status : null;
        this._creationTimestamp = order && order.creationTimestamp ? order.creationTimestamp : null;
        this._isTosAccepted = order && order.isTosAccepted ? order.isTosAccepted : null;
    };

    c.saveInLocalStorage = function() {
        CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.order, {
            products: this._products,
            reductions: this._reductions,
            edition: this._edition,
            coupon: this._coupon,
            id: this._id,
            idInBase64: this._idInBase64,
            cvFileName: this._cvFileName,
            coverLetterFileName: this._coverLetterFileName,
            positionSought: this._positionSought,
            employerSought: this._employerSought,
            jobAdUrl: this._jobAdUrl,
            jobAdFileName: this._jobAdFileName,
            customerComment: this._customerComment,
            status: this._status,
            isTosAccepted: this._isTosAccepted
        });
    };

    c.getProducts = function() {
        return this._products;
    };

    c.addProduct = function(product) {
        const foundProduct = _.find(this._products, function(orderProduct) {
            return orderProduct.id === product.id;
        });

        if (!foundProduct) {
            this._products.push(product);
            this._calculateReductions();
        }
    };

    c.removeProduct = function(product) {
        let productIndex = null;

        for (let i = 0; i < this._products.length; i++) {
            if (this._products[i].id === product.id) {
                productIndex = i;
                break;
            }
        }

        if (!_.isNull(productIndex)) {
            this._products.splice(productIndex, 1);
            this._calculateReductions();
        }
    };

    c.getReductions = function() {
        return this._reductions;
    };

    c.getEdition = function() {
        return this._edition;
    };

    c.setEdition = function(edition) {
        this._edition = edition;
    };

    c.getCoupon = function() {
        return this._coupon;
    };

    c.setCoupon = function(coupon) {
        this._coupon = coupon;
    };

    c.getId = function() {
        return this._id;
    };

    c.setId = function(id) {
        this._id = id;
    };

    c.getIdInBase64 = function() {
        return this._idInBase64;
    };

    c.setIdInBase64 = function(idInBase64) {
        this._idInBase64 = idInBase64;
    };

    c.getCvFileName = function() {
        return this._cvFileName;
    };

    c.setCvFileName = function(fileName) {
        this._cvFileName = fileName;
    };

    c.getCoverLetterFileName = function() {
        return this._coverLetterFileName;
    };

    c.setCoverLetterFileName = function(fileName) {
        this._coverLetterFileName = fileName;
    };

    c.getSoughtPosition = function() {
        return this._positionSought;
    };

    c.setSoughtPosition = function(positionSought) {
        this._positionSought = positionSought;
    };

    c.getSoughtEmployer = function() {
        return this._employerSought;
    };

    c.setSoughtEmployer = function(employerSought) {
        this._employerSought = employerSought;
    };

    c.getJobAdUrl = function() {
        return this._jobAdUrl;
    };

    c.setJobAdUrl = function(jobAdUrl) {
        this._jobAdUrl = jobAdUrl;
    };

    c.getJobAdFileName = function() {
        return this._jobAdFileName;
    };

    c.setJobAdFileName = function(fileName) {
        this._jobAdFileName = fileName;
    };

    c.getCustomerComment = function() {
        return this._customerComment;
    };

    c.setCustomerComment = function(customerComment) {
        this._customerComment = customerComment;
    };

    c.getStatus = function() {
        return this._status;
    };

    c.getCreationTimestamp = function() {
        return this._creationTimestamp;
    };

    c.isTosAccepted = function() {
        return this._isTosAccepted;
    };

    c.setTosAccepted = function() {
        this._isTosAccepted = true;
    };

    c.getBasePrice = function() {
        let basePrice = 0;

        this._products.forEach(function(product) {
            basePrice += product.price.amount;
        });

        return basePrice;
    };

    c.getTotalPrice = function() {
        let totalPrice = this.getBasePrice();

        this._reductions.forEach(function(reduction) {
            totalPrice -= reduction.price.amount;
        });

        const orderCoupon = this._coupon;
        if (orderCoupon) {
            if (orderCoupon.discountPercentage) {
                totalPrice = Math.round(totalPrice - totalPrice * orderCoupon.discountPercentage / 100);
            } else {
                totalPrice -= orderCoupon.discountPrice.amount;
            }
        }

        return Math.round(totalPrice);
    };

    c.getTitleForHtml = function() {
        if (this._positionSought && this._employerSought) {
            return this._positionSought + " - " + this._employerSought;
        }
        if (this._positionSought) {
            return this._positionSought;
        }
        if (this._employerSought) {
            return this._employerSought;
        }
        return CR.i18nMessages.defaultAssessmentTitle;
    };

    c.getStatusForHtml = function() {
        switch (this._status) {
            case CR.Models.OrderStaticProps.statusIds.notPaid:
                return CR.i18nMessages["order.status.notPaid.text"];
            case CR.Models.OrderStaticProps.statusIds.paid:
                return CR.i18nMessages["order.status.paid.text"];
            case CR.Models.OrderStaticProps.statusIds.completed:
                return CR.i18nMessages["order.status.completed.text"];
            default:
                return CR.i18nMessages["order.status.inProgress.text"];
        }
    };

    c.getEditionForHtml = function() {
        if (!this._edition) {
            return null;
        }

        return CR.i18nMessages["edition.name." + this._edition.code];
    };

    c._calculateReductions = function() {
        this._resetReductions();

        const reductionForTwoProductsSameOrder = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER;
        });

        const rductionForThreeProductsSameOrdr = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.THREE_PRODUCTS_SAME_ORDER;
        });

        this._reductions = [];

        if (this._products.length === 2 && reductionForTwoProductsSameOrder) {
            this._products[1].reducedPrice = {
                amount: this._products[1].price.amount - reductionForTwoProductsSameOrder.price.amount,
                currencyCode: this._products[1].price.currencyCode
            };

            this._addReduction(reductionForTwoProductsSameOrder);
        } else if (this._products.length === 3 && reductionForTwoProductsSameOrder && rductionForThreeProductsSameOrdr) {
            this._products[1].reducedPrice = {
                amount: this._products[1].price.amount - reductionForTwoProductsSameOrder.price.amount,
                currencyCode: this._products[1].price.currencyCode
            };

            this._products[2].reducedPrice = {
                amount: this._products[2].price.amount - (rductionForThreeProductsSameOrdr.price.amount - reductionForTwoProductsSameOrder.price.amount),
                currencyCode: this._products[2].price.currencyCode
            };

            this._addReduction(rductionForThreeProductsSameOrdr);
        }
    };

    c._addReduction = function(reduction) {
        this._reductions.push(reduction);
    };

    c._resetReductions = function() {
        for (let i = 0; i < this._products.length; i++) {
            delete this._products[i].reducedPrice;
        }
    };
});
