import { GraphQLSchema } from "graphql";
import { query } from "./TypeQuery";

let schema = new GraphQLSchema({
    query: query
});

export default schema;
