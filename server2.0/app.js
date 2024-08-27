import express  from "express";
import userRoutes from "./routes/user.routers.js";
import courseRoutes from "./routes/course.routers.js"
import miscRoutes from './routes/miscellaneous.routes.js';
import { config } from 'dotenv';
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";
config();
import errorMiddleware from "./middlewares/errorMiddleware.js";


const app = express();


// app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}));

app.use(morgan('dev'));
app.use(cookieParser());

app.use('/ping',(req,res)=>{
    res.send("PONG")
});


//3 modules of routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1', miscRoutes);

app.all('*', (req, res)=>{
    res.status(404).send('OOPS! 404 page not found')
})

app.use(errorMiddleware);

export default app;