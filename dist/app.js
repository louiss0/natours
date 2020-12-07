"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var helmet_1 = __importDefault(require("helmet"));
var express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
var xss_clean_1 = __importDefault(require("xss-clean"));
var hpp_1 = __importDefault(require("hpp"));
var compression_1 = __importDefault(require("compression"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var AppError_1 = __importDefault(require("./utils/AppError"));
var globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
var Paths_1 = __importDefault(require("./types/Paths"));
var UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
var TourRoutes_1 = __importDefault(require("./routes/TourRoutes"));
var reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
var viewRoutes_1 = __importDefault(require("./routes/viewRoutes"));
// Start express app
var app = express_1.default();
app.set("view engine", "pug");
app.set("views", path_1.default.join("views"));
// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors_1.default());
app.options('*', cors_1.default());
// Serving static files
app.use(express_1.default.static('public'));
// Set security HTTP headers
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'http:', 'data:'],
        scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
}));
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan_1.default('dev'));
}
// Limit requests from same API
var limiter = express_rate_limit_1.default({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// Middleware for parsing cookies
app.use(cookie_parser_1.default());
// Data sanitization against NoSQL query injection
app.use(express_mongo_sanitize_1.default());
// Data sanitization against XSS
app.use(xss_clean_1.default());
// Prevent parameter pollution
var whitelist = [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
];
app.use(hpp_1.default({
    whitelist: whitelist
}));
app.use(compression_1.default());
// Test middleware
app.use(function (req, res, next) {
    Object.assign(req, { requestTime: new Date().toISOString() });
    next();
});
// 3) ROUTES
app.use("/", viewRoutes_1.default);
app.use("" + Paths_1.default.Version1 + Paths_1.default.Users, UserRoutes_1.default);
app.use("" + Paths_1.default.Version1 + Paths_1.default.Tours, TourRoutes_1.default);
app.use("" + Paths_1.default.Version1 + Paths_1.default.Reviews, reviewRoutes_1.default);
app.all('*', function (req, res, next) {
    next(new AppError_1.default("Can't find " + req.originalUrl + " on this server!", 404));
});
app.use(globalErrorHandler_1.default);
exports.default = app;
