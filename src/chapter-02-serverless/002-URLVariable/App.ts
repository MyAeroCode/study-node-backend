import express from "express";

const app = express();

/**
 * Exercise 05)
 *      - AWS Serverless Express
 *      - URL Variable
 *
 * 경로변수는
 *    설정에서 {NAME}으로 지정해야 한다.
 *    코드에서 :NAME 으로 지정해야 한다.
 *    여러개 쓰일 수 있다.
 *
 * 둘 이상의 경로에 매칭된다면,
 * 먼저 등록된 쪽이 먼저 매칭된다.
 */

app.get("/", async function Hello(req, res) {
    res.send("Hello, World!");
});

app.get("/user/:username", async function(req, res) {
    const username = req.params["username"];
    res.send(`[username : ${username}]`);
});

app.get("/user/:username/delete", async function(req, res) {
    const username = req.params["username"];
    res.send(`[username : ${username}] IS DELETED`);
});

app.get("/user/:username/:operation", async function(req, res) {
    const username = req.params["username"];
    const operation = req.params["operation"];
    res.send(`[username : ${username}], [operation : ${operation}]`);
});

export default app;
