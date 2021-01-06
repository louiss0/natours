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
var nodemailer_1 = __importDefault(require("nodemailer"));
var pug_1 = __importDefault(require("pug"));
var html_to_text_1 = __importDefault(require("html-to-text"));
var Email = /** @class */ (function () {
    function Email(user, url) {
        this.user = user;
        this.url = url;
        this.to = this.user.email;
        this.firstName = this.user.name.split(' ')[0];
        this.from = "" + process.env.EMAIL_FROM;
    }
    Email.prototype.newTransport = function () {
        var _a = process.env, SEND_GRID_USERNAME = _a.SEND_GRID_USERNAME, SEND_GRID_PASSWORD = _a.SEND_GRID_PASSWORD, EMAIL_HOST = _a.EMAIL_HOST, EMAIL_PORT = _a.EMAIL_PORT, EMAIL_USERNAME = _a.EMAIL_USERNAME, EMAIL_PASSWORD = _a.EMAIL_PASSWORD, SEND_GRID_EMAIL_FROM = _a.SEND_GRID_EMAIL_FROM;
        var stringifiedCredentials = JSON.stringify({
            SEND_GRID_USERNAME: SEND_GRID_USERNAME,
            SEND_GRID_PASSWORD: SEND_GRID_PASSWORD,
            EMAIL_HOST: EMAIL_HOST,
            EMAIL_PORT: EMAIL_PORT,
            EMAIL_USERNAME: EMAIL_USERNAME,
            EMAIL_PASSWORD: EMAIL_PASSWORD,
            SEND_GRID_EMAIL_FROM: SEND_GRID_EMAIL_FROM
        }, null, 2);
        if (!(SEND_GRID_USERNAME &&
            SEND_GRID_EMAIL_FROM &&
            SEND_GRID_PASSWORD &&
            EMAIL_HOST &&
            EMAIL_PORT &&
            EMAIL_USERNAME &&
            EMAIL_PASSWORD)) {
            return console.error('You are missing the proper credentials', stringifiedCredentials);
        }
        if (process.env.NODE_ENV === 'production') {
            // Send_grid
            this.from = SEND_GRID_EMAIL_FROM;
            return nodemailer_1.default.createTransport({
                service: 'Send_Grid',
                auth: {
                    user: SEND_GRID_USERNAME,
                    pass: SEND_GRID_PASSWORD
                }
            });
        }
        else if (process.env.NODE_ENV === 'development') {
            return nodemailer_1.default.createTransport({
                host: EMAIL_HOST,
                port: EMAIL_PORT,
                auth: {
                    user: EMAIL_USERNAME,
                    pass: EMAIL_PASSWORD
                }
            });
        }
    };
    /**  Send_ the actual email

    @param template  template file that you are using
    
    @param subject  the topic of the email in a sentence

    */
    Email.prototype.send = function (template, subject) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, from, firstName, to, url, html, text, mailOptions, transport;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, from = _a.from, firstName = _a.firstName, to = _a.to, url = _a.url;
                        html = pug_1.default.renderFile(__dirname + "/../../views/emails/" + template + ".pug", { firstName: firstName, url: url, subject: subject });
                        text = html_to_text_1.default.htmlToText(html, {
                            preserveNewlines: true
                        });
                        mailOptions = {
                            from: from,
                            to: to,
                            subject: subject,
                            html: html,
                            text: text
                        };
                        transport = this.newTransport();
                        if (!transport) return [3 /*break*/, 2];
                        return [4 /*yield*/, transport.sendMail(mailOptions)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.log(transport);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Email.prototype.sendWelcome = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send("welcome", 'Welcome to the Natours Family!')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Email.prototype.sendPasswordReset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send("password", 'Use the link to reset your password Your password reset token (valid for only 10 minutes)')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Email;
}());
exports.default = Email;
;
