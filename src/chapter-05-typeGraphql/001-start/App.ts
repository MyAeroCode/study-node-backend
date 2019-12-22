import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";

const app = express();

/**
 * GraphQL 스키마를 사용하여,
 * 익스프레스의 "/" 경로에 아폴로를 설치한다.
 */
const apolloServer = new ApolloServer({ schema });
apolloServer.applyMiddleware({ app, path: "/" });
export default app;
