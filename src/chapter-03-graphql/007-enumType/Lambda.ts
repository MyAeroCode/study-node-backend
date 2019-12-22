import { APIGatewayEvent, Context } from "aws-lambda";
import serverless from "aws-serverless-express";
import app from "./App";

// 미리 정의한 Express-App으로 서버를 생성하고.
// Lambda에 들어온 이벤트는 serverless를 통해 전달한다.
const server = serverless.createServer(app);
export function handler(event: APIGatewayEvent, context: Context) {
    serverless.proxy(server, event, context);
}
