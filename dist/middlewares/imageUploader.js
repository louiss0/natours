"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var AppError_1 = __importDefault(require("../utils/AppError"));
function imageUploader() {
    return multer_1.default({
        storage: multer_1.default.memoryStorage(),
        fileFilter: function (req, file, cb) {
            if (file.mimetype.startsWith("image")) {
                cb(null, true);
            }
            else {
                cb(new AppError_1.default("Not an image please upload an image", HTTPStatusCodes_1.default.BadRequest));
            }
        }
    });
}
exports.default = imageUploader;
