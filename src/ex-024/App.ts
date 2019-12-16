import express from "express";
import GraphqlHTTP from "express-graphql";
import schema from "./schema/Schema";

const app = express();

/**
 * Exercise 23)
 *  커서 기반 페이지네이션.
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
