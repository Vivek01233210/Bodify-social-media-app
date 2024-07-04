import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cron from "node-cron";
import { connectDB } from './utils/connectDB.js';
import postRouter from './routes/postRoutes.js';
import userRouter from './routes/userRoutes.js';
import planRouter from './routes/planRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import stripePaymentRouter from './routes/paymentRoutes.js';
import earningsRouter from './routes/earningsRoutes.js'
import notificationRouter from './routes/notificationRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import passport from './utils/passport-config.js'
import cookieParser from 'cookie-parser';
import { calculateEarnings } from './utils/calculateEarnings.js';
// calculateEarnings();

connectDB();
const app = express();
const PORT = process.env.PORT

// schedule the task to run at 23:59 on the last day of every month
cron.schedule(
    "59 23 * * * ",
    async () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (today.getMonth() !== tomorrow.getMonth()) {
            calculateEarnings(); //calc earnings
        }
    },
    {
        scheduled: true,
        timezone: "America/New_York",
    }
);

// MIDDLEWARES
const corsOptions = {
    // origin: "http://localhost:5173",
    origin: (origin, callback) => {
        // Check if the origin is allowed
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://bondifybyvivek.online",
            "http://www.bondifybyvivek.online",
        ];
        const isAllowed = allowedOrigins.includes(origin);
        callback(null, isAllowed ? origin : false);
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
// app.use(morgan('dev'));

// passport middleware
app.use(passport.initialize());

// ROUTES
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/plan", planRouter);
app.use("/api/v1/stripe", stripePaymentRouter);
app.use("/api/v1/earnings", earningsRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/comments", commentRouter);

// Not found handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found" });
});

// global error handling
app.use((err, req, res, next) => {
    console.log(err)
    const message = err.message;
    const stack = err.stack;
    res.status(500).json({ message, stack });
});

app.listen(PORT, console.log(`Server is up: http://localhost:${PORT}`));