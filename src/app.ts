import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import AppError from './utils/AppError';
import globalErrorHandler from './middlewares/globalErrorHandler';
import Paths from './types/Paths';
import userRouter from './routes/UserRoutes';
import tourRouter from './routes/TourRoutes';
import reviewRouter from './routes/reviewRoutes';
import viewRouter from './routes/viewRoutes';
// Start express app
const app = express();



app.set("view engine", "pug")
app.set("views", path.join("views"))



// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

app.options('*', cors());

// Serving static files
app.use(express.static('public'))

// Set security HTTP headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'http:', 'data:'],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
        },
    })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Middleware for parsing cookies
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
const whitelist = [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
]


app.use(
    hpp({
        whitelist
    })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {

    Object.assign(req, { requestTime: new Date().toISOString() })

    next();
});

// 3) ROUTES



app.use(`/`, viewRouter)

app.use(`${Paths.Version1}${Paths.Users}`, userRouter)

app.use(`${Paths.Version1}${Paths.Tours}`, tourRouter)

app.use(`${Paths.Version1}${Paths.Reviews}`, reviewRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

});

app.use(globalErrorHandler);

export default app;