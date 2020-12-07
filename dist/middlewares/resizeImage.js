"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sharp_1 = __importDefault(require("sharp"));
var resizeImage = function (req, res, next) {
    var width = 500, height = 500, quality = 90;
    var userRequest = req;
    req.file.filename = "user-" + userRequest.user.id + "-" + Date.now() + ".jpeg";
    if (!req.file)
        return next();
    sharp_1.default(req.file.buffer)
        .resize(width, height)
        .toFormat("jpeg")
        .jpeg({
        quality: quality
    }).toFile("public/img/users/" + req.file.filename);
    next();
};
exports.default = resizeImage;
