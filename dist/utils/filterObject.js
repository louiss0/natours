"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function filterObject(object) {
    var allowedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        allowedFields[_i - 1] = arguments[_i];
    }
    var newObj = {};
    var fieldsArray = __spreadArrays(allowedFields);
    Object
        .keys(object)
        .forEach(function (key) {
        if (fieldsArray.includes(key)) {
            newObj[key] = object[key];
        }
    });
    return newObj;
}
exports.default = filterObject;
