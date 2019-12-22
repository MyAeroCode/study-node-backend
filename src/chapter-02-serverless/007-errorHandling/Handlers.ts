import express from "express";

// 강제로 에러를 발생시킨다.
export async function errorOccur(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log("Error Occur!");
    next(new Error("Error!"));
}

// 에러를 다음 에러처리 미들웨어로 떠넘긴다.
export async function errorPass(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log("Error passed to next.");
    next(err);
}

// 에러를 소비한 뒤, 다음 미들웨어롤 호출한다.
export async function errorConsume(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log("Error consumed.");
    next();
}

// 반갑게 인사하고, 다음 미들웨어를 호출한다.
export async function hello(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log("Hello!");
    next();
}
