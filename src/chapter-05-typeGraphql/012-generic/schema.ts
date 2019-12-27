/**
 * TypeGraphql 데코레이션을 만나기 이전에,
 * 반드시 "reflect-metadata"를 import해야 한다.
 */
import "reflect-metadata";
import { buildSchemaSync, Query, Field, ObjectType, ClassType } from "type-graphql";

function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
    // ClassType을 이용하여 클래스 타입을 캡쳐한다.
    // 청크함수로 정의하면 코드의 재사용률을 높일 수 있다.
    // isAbstract 옵션은 같은 이름으로 여러번 등록되는 것을 막아준다.
    //
    @ObjectType({ isAbstract: true })
    abstract class PaginatedResponseClass {
        @Field(() => [TItemClass])
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
