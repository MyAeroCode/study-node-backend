import express from "express";
import GraphqlHTTP from "express-graphql";
import schema from "./Schema";

const app = express();

/**
 * Exercise 15)
 *  Object 방식으로 Hello,World! 만들기.
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
