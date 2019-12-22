import express from "express";

const app = express();

/**
 * Exercise 13)
 *      - AWS Serverless Express
 *      - Another Cookies
 *          Session
 *              브라우저가 꺼지면 삭제된다.
 *
 *          Permanent
 *              브라우저가 꺼져도 삭제되지 않는다.
 *              maxAge 또는 expires를 설정한다.
 *
 *          httpOnly
 *              document.cookies로 보이지 않게 한다.
 *
 *          path
 *              해당 디렉토리 포함, 하위에서만 작동하게한다.
 *
 *          domain
 *              서브 도메인에서 작동하게 한다.
 *
 *          secure
 *              https 통신일때만 클라이언트가 서버에게 이 쿠키를 전송한다.
 */
const rootRouter = express.Router();
rootRouter.get("/", async function(req, res) {
    res.cookie("session", "session");
    res.cookie("permanent", "permanent", { maxAge: 1000 });
    res.cookie("httpOnly", "httpOnly", { httpOnly: true });
    res.cookie("path", "path", { path: "/" });
    res.cookie("domain", "domain", { domain: "test.org" });
    res.cookie("secure", "secure", { secure: true });
});
app.use("/", rootRouter);

export default app;
