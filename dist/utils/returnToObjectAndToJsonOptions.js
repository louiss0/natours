"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function returnToObjectAndToJsonOptions(options) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var obj = {};
    if (options && keys.length !== 0) {
        keys.forEach(function (key) {
            obj[key] = options;
        });
        return obj;
    }
    return {
        toObject: {
            getters: true,
            virtuals: true
        },
        toJSON: {
            getters: true,
            virtuals: true
        }
    };
}
exports.default = returnToObjectAndToJsonOptions;
