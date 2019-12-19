import express from "express";
import GraphqlHTTP from "express-graphql";
import { schema } from "./schema";

const app = express();

app.use(
    "/",
    GraphqlHTTP({
        schema: schema,
        graphiql: true
    })
);
export default app;
