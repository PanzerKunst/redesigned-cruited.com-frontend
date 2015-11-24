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
        this._reductions = order && order.reductions ? _.cloneDeep(order.reductions) : [];
        this._coupon = order && order.coupon ? _.cloneDeep(order.coupon) : null;

        if (order && order.edition) {
            this._edition = _.cloneDeep(order.edition);
        } else if (!_.isEmpty(CR.editions)) {
            this._edition = CR.editions[0];
        }

        this._id = order && order.id ? order.id : null;
        this._cvFileName = order && order.cvFileName ? order.cvFileName : null;
        this._coverLetterFileName = order && order.coverLetterFileName ? order.coverLetterFileName : null;
        this._positionSought = order && order.positionSought ? order.positionSought : null;
        this._employerSought = order && order.employerSought ? order.employerSought : null;
        this._jobAdUrl = order && order.jobAdUrl ? order.jobAdUrl : null;

        this._saveOrderInLocalStorage();
    };

    c.getProducts = function() {
        return this._products;
    };

    c.addProduct = function(product) {
        let foundProduct = _.find(this._products, function(orderProduct) {
            return orderProduct.id === product.id;
        });

        if (!foundProduct) {
            this._products.push(product);
            this._calculateReductions();
            this._saveOrderInLocalStorage();
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
            this._saveOrderInLocalStorage();
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
        this._saveOrderInLocalStorage();
    };

    c.getCoupon = function() {
        return this._coupon;
    };

    c.setCoupon = function(coupon) {
        this._coupon = coupon;
        this._saveOrderInLocalStorage();
    };

    c.getId = function() {
        return this._id;
    };

    c.setId = function(id) {
        this._id = id;
        this._saveOrderInLocalStorage();
    };

    c.getCvFileName = function() {
        return this._cvFileName;
    };

    c.setCvFileName = function(fileNameWithPrefix) {
        this._cvFileName = this._getFileNameStrippedFromPrefix(fileNameWithPrefix);
        this._saveOrderInLocalStorage();
    };

    c.getCoverLetterFileName = function() {
        return this._coverLetterFileName;
    };

    c.setCoverLetterFileName = function(fileNameWithPrefix) {
        this._coverLetterFileName = this._getFileNameStrippedFromPrefix(fileNameWithPrefix);
        this._saveOrderInLocalStorage();
    };

    c.getSoughtPosition = function() {
        return this._positionSought;
    };

    c.setSoughtPosition = function(positionSought) {
        this._positionSought = positionSought;
        this._saveOrderInLocalStorage();
    };

    c.getSoughtEmployer = function() {
        return this._employerSought;
    };

    c.setSoughtEmployer = function(employerSought) {
        this._employerSought = employerSought;
        this._saveOrderInLocalStorage();
    };

    c.getJobAdUrl = function() {
        return this._jobAdUrl;
    };

    c.setJobAdUrl = function(jobAdUrl) {
        this._jobAdUrl = jobAdUrl;
        this._saveOrderInLocalStorage();
    };

    c._getFileNameStrippedFromPrefix = function(fileNameWithPrefix) {
        if (!fileNameWithPrefix) {
            return null;
        }

        let indexFileNameAfterPrefix = fileNameWithPrefix.indexOf(CR.Models.OrderStaticProps.fileNamePrefixSeparator, 1) + CR.Models.OrderStaticProps.fileNamePrefixSeparator.length;
        return fileNameWithPrefix.substring(indexFileNameAfterPrefix);
    };

    c._calculateReductions = function() {
        this._resetReductions();

        let reductionForTwoProductsSameOrder = _.find(CR.reductions, function(reduction) {
            return reduction.code === CR.Models.Reduction.codes.TWO_PRODUCTS_SAME_ORDER;
        });

        let rductionForThreeProductsSameOrdr = _.find(CR.reductions, function(reduction) {
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

    c._saveOrderInLocalStorage = function() {
        CR.Services.Browser.saveInLocalStorage(CR.localStorageKeys.order, {
            products: this._products,
            reductions: this._reductions,
            edition: this._edition,
            coupon: this._coupon,
            id: this._id,
            cvFileName: this._cvFileName,
            coverLetterFileName: this._coverLetterFileName,
            positionSought: this._positionSought,
            employerSought: this._employerSought,
            jobAdUrl: this._jobAdUrl
        });
    };
});
