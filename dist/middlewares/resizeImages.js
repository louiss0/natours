"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sharp_1 = __importDefault(require("sharp"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
/**

    *  @param startName  :string the word used to name the image its, placed at the start

    *  @param folderPath :string  this is the path to the folder you want to use

    *  ! Don't  start with / with folder path or end with /

*/
var resizeImages = function (startName, folderPath) {
    if (folderPath === void 0) { folderPath = "public/img"; }
    return catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        function returnSharp(buffer, fileName) {
            return sharp_1.default(buffer)
                .resize(width, height)
                .toFormat("jpeg")
                .jpeg({ quality: quality })
                .toFile(fileName);
        }
        var _a, width, height, quality, fileName, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [2000, 1333, 90], width = _a[0], height = _a[1], quality = _a[2];
                    if (Array.isArray(req.files)) {
                        return [2 /*return*/, next()];
                    }
                    req.body.imageCover = startName + "-" + req.params.id + "-" + Date.now() + ".jpeg";
                    fileName = folderPath + "/" + req.body.imageCover;
                    return [4 /*yield*/, returnSharp(req.files.imageCover[0].buffer, fileName)];
                case 1:
                    _c.sent();
                    _b = req.body;
                    return [4 /*yield*/, Promise.all(req.files.images.map(function (file, i) { return __awaiter(void 0, void 0, void 0, function () {
                            var fileFormat, fileName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fileFormat = startName + "-" + req.params.id + "-" + Date.now() + "-" + (i + 1) + ".jpeg";
                                        fileName = folderPath + "/" + fileFormat;
                                        return [4 /*yield*/, returnSharp(file.buffer, fileName)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, fileFormat];
                                }
                            });
                        }); }))];
                case 2:
                    _b.images = _c.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.default = resizeImages;
