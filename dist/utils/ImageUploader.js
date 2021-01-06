"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var HTTPStatusCodes_1 = __importDefault(require("../types/HTTPStatusCodes"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var fileFilter = function (req, file, callback) {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    }
    else {
        callback(new AppError_1.default("Not an image please upload an image", HTTPStatusCodes_1.default.BadRequest));
    }
};
var ImageUploader = /** @class */ (function () {
    function ImageUploader() {
    }
    Object.defineProperty(ImageUploader, "uploadUserPhoto", {
        get: function () {
            return this.uploader.single("photo");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageUploader, "uploadTourImages", {
        get: function () {
            return this.uploader.fields([
                { name: "imageCover", maxCount: 1 },
                { name: "images", maxCount: 3 }
            ]);
        },
        enumerable: false,
        configurable: true
    });
    ImageUploader.uploader = multer_1.default({
        storage: multer_1.default.memoryStorage(),
        fileFilter: fileFilter
    });
    return ImageUploader;
}());
exports.default = ImageUploader;
