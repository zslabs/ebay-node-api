'use strict';
const { makeRequest, base64Encode } = require('./request');
const { getItem,
    getItemByLegacyId,
    getItemByItemGroup,
    searchItems } = require('./buy-api');
const { getAllCategories,
    getShippingCosts,
    getItemStatus,
    getUserDetails } = require('./shopping');
const { getDefaultCategoryTreeId,
    getCategoryTree,
    getCategorySubtree,
    getCategorySuggestions,
    getItemAspectsForCategory } = require('./taxonomy-api');
const { findItemsByKeywords,
    findItemsByCategory,
    findCompletedItems,
    getVersion } = require('./findingApi');
const { getSimilarItems, getMostWatchedItems } = require('./merchandising');
const { PROD_BASE_URL, SANDBOX_BASE_URL, BASE_SANDBX_SVC_URL, BASE_SVC_URL } = require('./constants');
const PROD_ENV = 'PROD';
const SANDBOX_ENV = 'SANDBOX';

function Ebay(options) {

    if (!options) throw new Error('Options is missing, please provide the input');
    if (!options.clientID) throw Error('Client ID is Missing\ncheck documentation to get Client ID http://developer.ebay.com/DevZone/account/');
    if (!(this instanceof Ebay)) return new Ebay(options);
    if (!options.env) options.env = PROD_ENV;
    options.baseUrl = PROD_BASE_URL;
    options.baseSvcUrl = BASE_SVC_URL;
    // handle sandbox env.
    if (options.env === SANDBOX_ENV) {
        options.baseUrl = SANDBOX_BASE_URL;
        options.baseSvcUrl = BASE_SANDBX_SVC_URL;
    }
    this.options = options;
    this.options.globalID = options.countryCode || 'EBAY-US';
}

Ebay.prototype = {

    setAccessToken: function (token) {
        this.options.access_token = token;
    },

    getAccessToken: function () {
        if (!this.options.clientID) throw new Error('Missing Client ID');
        if (!this.options.clientSecret) throw new Error('Missing Client Secret or Cert Id');
        if (!this.options.body) throw new Error('Missing Body, required Grant type');
        const encodedStr = base64Encode(this.options.clientID + ':' + this.options.clientSecret);
        const self = this;
        const auth = 'Basic ' + encodedStr;
        return makeRequest(this.options.baseUrl, '/identity/v1/oauth2/token', 'POST', this.options.body, auth).then((result) => {
            const resultJSON = JSON.parse(result);
            self.setAccessToken(resultJSON.access_token);
            return resultJSON;
        });
    },
    findItemsByKeywords,
    findItemsByCategory,
    findCompletedItems,
    getVersion,
    getItem,
    getItemByLegacyId,
    getItemByItemGroup,
    searchItems,
    getDefaultCategoryTreeId,
    getCategoryTree,
    getCategorySubtree,
    getCategorySuggestions,
    getItemAspectsForCategory,
    getMostWatchedItems,
    getSimilarItems,
    getAllCategories,
    getShippingCosts,
    getItemStatus,
    getUserDetails
};

module.exports = Ebay;
