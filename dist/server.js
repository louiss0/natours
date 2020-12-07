"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
process.on('uncaughtException', function (err) {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: './config.env' });
var app_1 = __importDefault(require("./app"));
var _a = process.env, DATABASE = _a.DATABASE, DATABASE_PASSWORD = _a.DATABASE_PASSWORD, DATABASE_NAME = _a.DATABASE_NAME;
if (DATABASE && DATABASE_PASSWORD && DATABASE_NAME) {
    var DB = DATABASE
        .replace('<PASSWORD>', DATABASE_PASSWORD)
        .replace("<dbname>", DATABASE_NAME);
    mongoose_1.default
        .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    })
        .then(function () { return console.log('DB connection successful!'); })
        .catch(function (reason) {
        console.error(reason);
    });
}
else {
    console.table({
        DATABASE: DATABASE,
        DATABASE_PASSWORD: DATABASE_PASSWORD,
        DATABASE_NAME: DATABASE_NAME
    });
}
var port = process.env.PORT || 3000;
var server = app_1.default.listen(port, function () {
    console.log("App running on port " + port + "...");
});
process.on('unhandledRejection', function (err) {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    var _a = __assign({}, err), name = _a.name, message = _a.message;
    console.error(name, message);
    server.close(function () {
        process.exit(1);
    });
});
process.on('SIGTERM', function () {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(function () {
        console.log('💥 Process terminated!');
    });
});
