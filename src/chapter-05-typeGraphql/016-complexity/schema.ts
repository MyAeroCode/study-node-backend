/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import {
    buildSchemaSync,
    Query,
    Field,
    Int,
    ObjectType,
    Resolver, FieldResolver, Root
} from "type-graphql";

// 데코레이터 옵션에 complexity로 복잡도를 정의한다.
// 단순히 숫자로 정의하거나, 숫자를 반환하는 청크함수로 정의할 수 있다.
//
@ObjectType()
class Increment {
    @Field(() => Int)
    value!: number;

    @Field(() => Increment)
    next?: Increment;
}

@Resolver(() => Increment)
class IncrementResolver {
    @FieldResolver(() => Increment, {
        complexity: (info) => {
            return info.childComplexity * 5;
        }
    })
    next(@Root() source: Increment) {
        return {
            value: source.value + 1
        };
    }
}

class RootSchema {
    // 데코레이터에도 순서가 있으니 주의한다.
    //
    @Query(() => Increment)
    getIncrement() {
        return {
            value: 0
        };
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
