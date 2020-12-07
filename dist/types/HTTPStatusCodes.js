"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPStatusCodes;
(function (HTTPStatusCodes) {
    HTTPStatusCodes[HTTPStatusCodes["Ok"] = 200] = "Ok";
    HTTPStatusCodes[HTTPStatusCodes["Created"] = 201] = "Created";
    HTTPStatusCodes[HTTPStatusCodes["NoContent"] = 204] = "NoContent";
    HTTPStatusCodes[HTTPStatusCodes["NotModified"] = 304] = "NotModified";
    HTTPStatusCodes[HTTPStatusCodes["BadRequest"] = 400] = "BadRequest";
    HTTPStatusCodes[HTTPStatusCodes["Unauthorized"] = 401] = "Unauthorized";
    HTTPStatusCodes[HTTPStatusCodes["Forbidden"] = 403] = "Forbidden";
    HTTPStatusCodes[HTTPStatusCodes["NotFound"] = 404] = "NotFound";
    HTTPStatusCodes[HTTPStatusCodes["Conflict"] = 409] = "Conflict";
    HTTPStatusCodes[HTTPStatusCodes["ServerError"] = 500] = "ServerError";
})(HTTPStatusCodes || (HTTPStatusCodes = {}));
exports.default = HTTPStatusCodes;
