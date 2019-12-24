/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, registerEnumType, Field, ObjectType, Args, InputType, Arg, createUnionType, InterfaceType } from "type-graphql";

// 인터페이스를 abstract class로 정의하고,
// ResolveType은 데코레이터에 적는다.
@InterfaceType({
    resolveType: (value: IBrowser) => {
        if (value.browserName == "chrome") return Chrome;
        if (value.browserName == "firefox") return Firefox;
        return undefined;
    }
})
abstract class IBrowser {
    @Field()
    browserName!: string;
}

// 데코레이터에서 어떤 인터페이스를 구현할것인지 적고,
// 오브젝트는 extends 또는 implements 키워드를 사용한다.
@ObjectType({ implements: IBrowser })
class Chrome extends IBrowser {
    @Field()
    googleId!: string;
}

@ObjectType({ implements: IBrowser })
class Firefox extends IBrowser {
    @Field()
    mozillaId!: string;
}

class RootSchema {
    @Query(() => [IBrowser])
    test(): any[] {
        return [
            {
                browserName: "firefox",
                mozillaId: "mo"
            },
            {
                browserName: "chrome",
                googleId: "go"
            }
        ];
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
