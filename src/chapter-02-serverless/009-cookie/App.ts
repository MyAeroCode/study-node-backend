import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

/**
 * Exercise 12)
 *      - AWS Serverless Express
 *      - Session Cookie Counter (With cookie-parser)
 */
const rootRouter = express.Router();
rootRouter.get("/", async function(req, res) {
    const count: number = !req.cookies.count || isNaN(Number(req.cookies.count)) ? 0 : Number(req.cookies.count);
    res.cookie("count", count + 1);
    res.send(count.toString());
});
app.use("/", rootRouter);

export default app;
