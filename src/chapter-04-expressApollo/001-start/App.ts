import express from "express";
import { ApolloServer } from "apollo-server-express";
import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

const app = express();

const query = new GraphQLObjectType({
    name: "helloApollo",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "Hello, Apollo!"
        }
    }
});
const schema = new GraphQLSchema({ query });

/**
 * GraphQL 스키마를 사용하여,
 * 익스프레스의 "/" 경로에 아폴로를 설치한다.
 */
const apolloServer = new ApolloServer({ schema });
apolloServer.applyMiddleware({ app, path: "/" });
export default app;
