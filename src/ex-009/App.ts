import express from "express";
import responseTime from "response-time";
const app = express();

/**
 * Exercise 09)
 *      - AWS Serverless Express
 *      - Third Party Middleware (Response-Time)
 */

const index = express.Router();
index.get("/", async function(req, res) {
    console.log("Hello, World!");
    res.send("Hello, World!");
});

app.use(
    responseTime(async function(req, res, time) {
        console.log(time, "ms");
    })
);
app.use("/", index);

export default app;
