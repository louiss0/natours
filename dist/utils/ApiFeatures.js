"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var APIFeatures = /** @class */ (function () {
    function APIFeatures(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    Object.defineProperty(APIFeatures.prototype, "$query", {
        get: function () { return this.query; },
        enumerable: false,
        configurable: true
    });
    APIFeatures.prototype.filter = function () {
        var queryObj = __assign({}, this.queryString);
        var excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(function (el) { return delete queryObj[el]; });
        // 1B) Advanced filtering
        var queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$" + match; });
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };
    APIFeatures.prototype.sort = function () {
        if (this.queryString.sort) {
            var sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    };
    APIFeatures.prototype.limitFields = function () {
        if (this.queryString.fields) {
            var fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    };
    APIFeatures.prototype.paginate = function () {
        var page = this.queryString.page ? parseInt(this.queryString.page) : 1;
        var limit = this.queryString.limit ? parseInt(this.queryString.limit) : 100;
        var skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
    return APIFeatures;
}());
exports.default = APIFeatures;
