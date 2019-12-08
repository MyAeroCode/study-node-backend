import express from "express";

const app = express();

/**
 * Exercise 07)
 *      - AWS Serverless Express
 *      - Routing
 */

app.get("/", async function Hello(req, res) {
    res.send("Hello, World!");
});

const aRouter = express.Router();
const bRouter = express.Router();

aRouter.get("/x", async function(req, res) {
    res.send("a x");
});
aRouter.get("/y", async function(req, res) {
    res.send("a y");
});
bRouter.get("/x", async function(req, res) {
    res.send("b x");
});
bRouter.get("/y", async function(req, res) {
    res.send("b y");
});

app.use("/a", aRouter);
app.use("/b", bRouter);
app.get("/*", async function(req, res) {
    res.send("OOPS!");
});

export default app;
