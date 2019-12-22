import express, { Router } from "express";
import responseTime from "response-time";
const app = express();

/**
 * Exercise 11)
 *      - AWS Serverless Express
 *      - Redirect
 */
const rootRouter = express.Router();
rootRouter.get("/", async function(req, res) {
    res.send("/google | /redirectHello | /hello");
});
rootRouter.get("/google", async function(req, res) {
    res.redirect("https://google.com");
});
rootRouter.get("/redirectHello", async function(req, res) {
    res.redirect("hello");
});
rootRouter.get("/hello", async function(req, res) {
    res.send("hello");
});
app.use("/", rootRouter);

export default app;
