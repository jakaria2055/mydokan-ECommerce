import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean"
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import router from "./src/routers/api.js";

const app = express();


//Security Middlewares
app.use(cookieParser());
app.use(cors());
app.use(helmet());
//app.use(mongoSanitize());
//app.use(xss());
app.use(hpp());


//Parsing
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true, limit: "5mb"}));


//Rate Limiter
const limiter  = rateLimit({
    windowMs: 15*60*1000,
    max: 1000
})

app.use(limiter);

//app.use('etag', false)

app.use('/api/v1', router);

export default app;