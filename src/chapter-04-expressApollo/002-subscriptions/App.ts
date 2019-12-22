import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./Schema";
import http from "http";

export const app = express();
export const httpServer = http.createServer(app);

/**
 * GraphQL 스키마를 사용하여,
 * 익스프레스의 "/graphql(default)" 경로에 아폴로를 설치한다.
 *
 * 구독 기능은 lambda에서 동작하지 않는다.
 */
const server = new ApolloServer({ schema });
server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);
