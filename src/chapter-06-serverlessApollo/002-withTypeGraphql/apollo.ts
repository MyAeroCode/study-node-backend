// TypeGraphQL 데코레이터를 만나기 이전에,
// 반드시 "reflect-metadata"를 import해야 한다.
//
import "reflect-metadata";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchemaSync, MiddlewareFn, Query, Resolver, UseMiddleware } from "type-graphql";

// 소요된 시간을 출력하는 TypeGraphQL Middleware.
// @see chapter-05/014
//
const ElapsedTimeFn: MiddlewareFn<any> = async ({ info }, next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    const elapsed = end - start;
    console.log(`${info.parentType.name}.${info.fieldName} [${elapsed} ms]`);
};

@Resolver()
class RootResolver {
    @Query()
    @UseMiddleware(ElapsedTimeFn)
    hello(): string {
        return "Hello, Serverless Apollo With TypeGraphQL!";
    }
}

const schema = buildSchemaSync({
    resolvers: [RootResolver]
});

const apolloServer = new ApolloServer({ schema, playground: true, introspection: true });
export const handler = apolloServer.createHandler();
