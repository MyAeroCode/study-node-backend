import express from "express";

const app = express();

/**
 * Exercise 06)
 *      - AWS Serverless Express
 *      - Wildcard
 *
 * Express    : *
 * Serverless : {any+}
 */

app.get("/", async function Hello(req, res) {
    res.send("Hello, World!");
});

app.get("/user/:username", async function(req, res) {
    const username = req.params["username"];
    res.send(`[username : ${username}]`);
});

app.get("/*", async function(req, res) {
    res.send("OOPS!");
});

export default app;
