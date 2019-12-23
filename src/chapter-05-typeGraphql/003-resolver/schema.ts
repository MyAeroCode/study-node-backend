import { buildSchemaSync, Query } from "type-graphql";
import { PostQuery } from "./schema-post";
import { OddNumberQuery } from "./schema-odd";

class RootSchema {
    @Query(() => PostQuery)
    postQuery(): typeof PostQuery {
        return PostQuery;
    }

    @Query(() => OddNumberQuery)
    oddNumberQuery(): typeof OddNumberQuery {
        return OddNumberQuery;
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
