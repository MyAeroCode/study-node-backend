import express from "express";
import GraphqlHTTP from "express-graphql";
import schema from "./Schema";

const app = express();

/**
 * Exercise 17)
 *  매개변수로 input 타입 사용하기.
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
