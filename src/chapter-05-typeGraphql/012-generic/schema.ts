/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Field, ObjectType, Arg, ArgsType, Resolver, Int, InputType, FieldResolver, ClassType } from "type-graphql";

function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
    // ClassType을 이용하여 클래스 타입을 캡쳐한다.
    // 청크함수로 정의하면 코드의 재사용률을 높일 수 있다.
    // isAbstract는 해당 오브젝트가 스키마에 등록하지 않도록 만든다.
    //
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field((type) => [TItemClass])
        items!: TItem[];

        @Field()
        hasMore!: boolean;
    }
    return PaginatedResponseClass;
}

@ObjectType()
class User {
    @Field()
    name!: string;
}
@ObjectType()
class PaginatedUserResponse extends PaginatedResponse(User) {
    @Field()
    otherInfo(): string {
        return "Hello, World!";
    }
}

class RootSchema {
    @Query(() => PaginatedUserResponse)
    sample() {
        return {
            items: [{ name: "Yi" }, { name: "Park" }],
            hasMore: false
        };
    }
}

export const schema = buildSchemaSync({
    resolvers: [RootSchema]
});
