import { ApolloServer } from "apollo-server-lambda";
import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

const query = new GraphQLObjectType({
    name: "helloApollo",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "Hello, Serverless Apollo!"
        }
    }
});
const schema = new GraphQLSchema({ query });

const apolloServer = new ApolloServer({ schema, playground: true, introspection: true });
export const handler = apolloServer.createHandler();
