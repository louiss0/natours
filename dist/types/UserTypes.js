"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserTypes;
(function (UserTypes) {
    var UserRoles;
    (function (UserRoles) {
        UserRoles["User"] = "user";
        UserRoles["Guide"] = "guide";
        UserRoles["LeadGuide"] = "lead-guide";
        UserRoles["Admin"] = "admin";
    })(UserRoles = UserTypes.UserRoles || (UserTypes.UserRoles = {}));
})(UserTypes || (UserTypes = {}));
exports.default = UserTypes;
