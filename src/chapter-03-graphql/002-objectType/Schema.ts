import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

let query = new GraphQLObjectType({
    // name pattern
    // ^[_a-zA-Z][_a-zA-Z0-9]*$
    name: "Hello_Query",
    description: "Print to 'Hello, World!'",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: (parent, args) => {
                return "Hello, World!!";
            }
        }
    }
});

let schema = new GraphQLSchema({
    query: query
});

export default schema;
