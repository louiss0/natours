import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);

});

dotenv.config({ path: './config.env' });
import app from './app';

const { DATABASE, DATABASE_PASSWORD, DATABASE_NAME } = process.env

if (DATABASE && DATABASE_PASSWORD && DATABASE_NAME) {

    const DB = DATABASE
        .replace('<PASSWORD>', DATABASE_PASSWORD)
        .replace("<dbname>", DATABASE_NAME);

    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('DB connection successful!'))
        .catch((reason) => {
            console.log(reason)
        });

} else {

    console.table({
        DATABASE,
        DATABASE_PASSWORD,
        DATABASE_NAME
    });
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    const { name, message } = { ...err } as Error

    console.error(name, message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});