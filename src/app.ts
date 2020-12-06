import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';

import globalErrorHandler from './middlewares/globalErrorHandler';
import Paths from './types/Paths';
import userRouter from './routes/UserRoutes';
import AppError from './utils/AppError';
// Start express app
const app = express();






// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

app.options('*', cors());

// Serving static files
app.use(express.static('public'))

// Set security HTTP headers
app.use(helmet);

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


// Data sanitization against XSS
app.use(xss());


app.use(compression());

// Test middleware
app.use((req, res, next) => {

    Object.assign(req, { requestTime: new Date().toISOString() })

    next();
});

// 3) ROUTES




app.use(`${Paths.Version1}${Paths.Users}`, userRouter)


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

});

app.use(globalErrorHandler);

export default app;