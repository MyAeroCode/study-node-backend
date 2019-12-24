/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, registerEnumType, Field, ObjectType, Args, InputType, Arg, createUnionType } from "type-graphql";

@ObjectType()
class Chrome {
    @Field()
    googleId!: string;

    @Field()
    version!: number;
}

@ObjectType()
class Firefox {
    @Field()
    version!: number;
}

const BrowserUnion = createUnionType({
    name: "BrowserUnion",
    types: () => [Chrome, Firefox],
    resolveType: (value) => {
        if ("googleId" in value) {
            return Chrome;
        }
        return "Firefox"; // or return name of objectType;
    }
});

class RootSchema {
    @Query(() => [BrowserUnion])
    test() : any[] {
        return [
            {
                googleId: "guest",
                version: 0
            },
            {
                version: 1
            }
        ];
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
