import express from 'express';
import cookieParser from 'cookie-parser';
// import "./cron";
require("dotenv").config();
import "express-async-errors";
import cors from 'cors';
import authRouter from './routes/authRouter';
import portfolioRouter from './routes/portfolioRouter';
import orderRouter from './routes/orderRouter';
import stockRouter from './routes/stockRouter';
import { errorHandler } from './middlewares/errorMiddleware';


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/portfolio', portfolioRouter);
app.use('/order', orderRouter);
app.use('/stocks', stockRouter);

app.use(errorHandler as express.ErrorRequestHandler);

app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 4000}`);
});
