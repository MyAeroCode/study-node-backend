import express from "express";
import GraphqlHTTP from "express-graphql";
import * as Graphql from "graphql";

const app = express();

/**
 * Exercise 14)
 *      - Graphql
 *      - Hello, GraphQL!
 */

const schema = Graphql.buildSchema(`
    type Query {
        hello: String
    }
 `);
const root = { hello: () => "Hello, World!" };

app.use(
    "/",
    GraphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

export default app;
