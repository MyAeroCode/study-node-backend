import express from "express";

const app = express();

/**
 * Exercise 08)
 *      - AWS Serverless Express
 *      - Custom Middleware
 */

// Logger Middleware
//    0~10 사이의 숫자를 뽑아,
//    홀수라면 해당 숫자를 담아 다음 미들웨어로 넘기고,
//    짝수라면 요청을 중단시킨다.
app.use(async function(req, res, next) {
    let pick: number = Math.floor(Math.random() * 10);
    console.log(`random : ${pick}`);
    if (pick % 2 == 0) {
        res.send(`Even-number is Error.`);
    } else {
        // 다음 미들웨어로 넘길려면
        // req.params가 아니라, req.query로 보낼 것.
        req.query["pick"] = pick.toString();
        next();
    }
});

const index = express.Router();
index.get("/", async function(req, res) {
    let pick = req.query["pick"];
    let hello = `Hello, World! with ${pick}`;
    console.log(hello);
    res.send(hello);
});
app.use("/", index);

export default app;
