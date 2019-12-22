import express from "express";
import GraphqlHTTP from "express-graphql";
import schema from "./Schema";

const app = express();

/**
 * Exercise 16)
 *  필드에 매개변수 전달하기
 *
 */
app.use(
    "/",
    GraphqlHTTP({
        schema: schema,
        graphiql: true
    })
);
export default app;
